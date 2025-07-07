import express from 'express';
import { AxiosError } from 'axios';
import jwt from 'jsonwebtoken';

import { GatewayRequestSchema } from '@libs/gateway';
import {
  GatewayException,
  ICommandRequest,
  MicroserviceTimeoutException,
  RequestValidationException,
  UnknownCommandException,
} from '@libs/gateway';

import { axiosInstance } from './axios';
import { Endpoints } from './endpoints';
import {
  forwardRequestHeaders,
  forwardResponseHeaders,
  getServiceContract,
  getServiceFromRequest,
} from './utils';

const PORT = 3000;
const USER_ID = '054726b2-fafd-426c-a04e-ce744f1ecdab';
const GATEWAY_TOKEN_HEADER = 'x-gateway-token';
const JWT_GATEWAY_SECRET = process.env.JWT_GATEWAY_SECRET || '';

const server = express();

server.use(express.json());

server.post('/command', async (expressReq, expressRes) => {
  console.log('[GATEWAY] [COMMAND] Received');

  console.log('[GATEWAY] [COMMAND] Trying to parse request');
  const result = GatewayRequestSchema.safeParse(expressReq.body);

  if (!result.success) {
    const exception = new RequestValidationException({
      issues: result.error.issues,
    });

    console.error('[GATEWAY] [COMMAND] Error while parsing');

    expressRes.status(exception.status).json(exception);
  } else {
    console.log(
      '[GATEWAY] [COMMAND] Success parsing',
      JSON.stringify(result.data, null, 2),
    );

    const service = getServiceFromRequest(result.data);

    expressRes.setHeader('x-service', service);

    const serviceContract = getServiceContract(service);
    const commandContract = serviceContract.findCommand(result.data.command);

    if (!commandContract) {
      const exception = new UnknownCommandException({ command: result.data.command });

      expressRes.status(exception.status).json(exception);
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commandRequest: ICommandRequest<any> = {
          command: result.data.command,
          data: result.data.data,
          enrichments: {
            user: undefined,
          },
        };

        if (commandContract.request.enrichments.user) {
          commandRequest.enrichments.user = { id: USER_ID };
        }

        console.log(
          `[GATEWAY] [COMMAND] Trying to connect '${service}' service on ${Endpoints[service]}`,
        );

        const payload = {
          iss: 'api-gateway', // Issuer
          iat: Math.floor(Date.now() / 1000), // Issued at
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour

          // Custom claims
          source: 'gateway',
        };

        const gatewayToken = jwt.sign(payload, JWT_GATEWAY_SECRET, {
          algorithm: 'HS256',
        });

        const axiosRes = await axiosInstance.post(
          `${Endpoints[service]}/command`,
          commandRequest,
          {
            headers: {
              ...forwardRequestHeaders(expressReq.headers, {}),
              [GATEWAY_TOKEN_HEADER]: gatewayToken,
            },
          },
        );

        forwardResponseHeaders(axiosRes, expressRes);

        expressRes.status(axiosRes.status).json(axiosRes.data);
      } catch (e) {
        console.error(`[GATEWAY] [COMMAND] Error while connecting '${service}' service`);

        const axiosErr = e as AxiosError;

        console.error(`[GATEWAY] [COMMAND] [ERROR]`, axiosErr.message);

        // The microservice responded with an error
        if (axiosErr.response) {
          forwardResponseHeaders(axiosErr.response, expressRes);

          expressRes.status(axiosErr.response.status).json(axiosErr.response.data);
        }

        // The request was made but no response received
        else if (axiosErr.request) {
          const exception = new MicroserviceTimeoutException();

          expressRes.status(exception.status).json(exception);
        }

        // Something happened in setting up the request
        else {
          const exception = new GatewayException();

          expressRes.status(exception.status).json(exception);
        }
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`[GATEWAY] Up and listening on ${PORT}!`);
});
