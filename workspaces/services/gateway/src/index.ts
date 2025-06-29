import { Gateway } from '@libs/gateway';
import express, { Response } from 'express';
import { axiosInstance } from './axios';
import { Endpoints } from './endpoints';
import { AxiosError, AxiosResponse } from 'axios';
import { IncomingHttpHeaders } from 'http';

const PORT = 3000;

const REQUEST_HEADERS_TO_FORWARD = [
  'authorization',
  'content-type',
  'accept',
  'x-request-id',
  'x-correlation-id',
];
const RESPONSE_HEADERS_TO_FORWARD = [
  'content-type',
  'cache-control',
  'etag',
  'last-modified',
];

const server = express();

server.use(express.json());

server.post('/command', async (expressReq, expressRes) => {
  console.log('[GATEWAY] [COMMAND] Received');

  // TODO add logs

  console.log('[GATEWAY] [COMMAND] Trying to parse request');
  const result = Gateway.RequestSchema.safeParse(expressReq.body);

  if (!result.success) {
    const exception = Gateway.createRequestValidationException({
      issues: result.error.issues,
    });

    console.error('[GATEWAY] [COMMAND] Error while parsing');

    expressRes.status(exception.status).json(exception);
  } else {
    console.log(
      '[GATEWAY] [COMMAND] Success parsing',
      JSON.stringify(result.data, null, 2),
    );

    const service = Gateway.getServiceFromRequest(result.data);

    expressRes.setHeader('x-service', service);

    try {
      console.log(
        `[GATEWAY] [COMMAND] Trying to connect '${service}' service on ${Endpoints[service]}`,
      );

      const axiosRes = await axiosInstance.post(
        `${Endpoints[service]}/command`,
        result.data,
        {
          headers: forwardRequestHeaders(expressReq.headers, {}),
        },
      );

      forwardResponseHeaders(axiosRes, expressRes);

      expressRes.status(axiosRes.status).json(axiosRes.data);
    } catch (e) {
      console.error(`[GATEWAY] [COMMAND] Error while connecting '${service}' service`);

      const axiosErr = e as AxiosError;

      if (axiosErr.response) {
        // The microservice responded with an error
        forwardResponseHeaders(axiosErr.response, expressRes);
        expressRes.status(axiosErr.response.status).send(axiosErr.response.data);
      } else if (axiosErr.request) {
        // The request was made but no response received
        expressRes.status(504).json(Gateway.createMicroserviceTimeoutException());
      } else {
        // Something happened in setting up the request
        expressRes.status(500).json(Gateway.createGatewayException());
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`[GATEWAY] Up and listening on ${PORT}!`);
});

function forwardRequestHeaders(
  headers: IncomingHttpHeaders,
  result: IncomingHttpHeaders,
) {
  REQUEST_HEADERS_TO_FORWARD.forEach(header => {
    if (headers[header]) {
      result[header] = headers[header];
    }
  });

  // Add gateway-specific headers - // TODO use it in microservice to check request?
  result['x-gateway-request'] = 'true';

  return result;
}

function forwardResponseHeaders(axiosResponse: AxiosResponse, expressResponse: Response) {
  RESPONSE_HEADERS_TO_FORWARD.forEach(header => {
    const headerValue = axiosResponse.headers[header];

    if (headerValue) {
      expressResponse.setHeader(header, headerValue);
    }
  });

  // Add gateway-specific headers
  expressResponse.setHeader('x-gateway-response', 'true');
}
