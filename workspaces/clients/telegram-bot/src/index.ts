import 'dotenv/config';

import express from 'express';
import axios, { AxiosError } from 'axios';
import YAML from 'yaml';
import { Gateway } from '@libs/gateway';

const PORT = 5001;

const app = express();

const Endpoints = {
  food: 'http://localhost:4002',
};

app.use(express.json());

app.post('/message', async (req, res) => {
  const { message } = req.body;

  // FIXME catch error send common error
  const actionRequest = YAML.parse(message);
  console.log('[TELEGRAM BOT] Received message:', actionRequest);

  const validatedBody = Gateway.RequestSchema.safeParse(actionRequest);

  if (!validatedBody.success) {
    const result: Gateway.RequestValidationException =
      Gateway.createRequestValidationException({
        issues: validatedBody.error.issues,
      });

    console.error('[TELEGRAM BOT] [COMMAND ERROR]', JSON.stringify(result, null, 2));

    res.status(result.status).send(result).json().end();
  } else {
    const result = await command(validatedBody.data.service)(validatedBody.data);

    if (!result.success) {
      console.error('[TELEGRAM BOT] [COMMAND ERROR]', JSON.stringify(result, null, 2));
    } else {
      console.log('[TELEGRAM BOT] [COMMAND SUCCESS]', JSON.stringify(result, null, 2));
    }

    res.status(result.status).send(result).json().end();
  }
});

app.listen(PORT, () => {
  console.log(`[TELEGRAM BOT] Up and running on port ${PORT}!`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function command(service: Gateway.IRequest<any, any>['service']) {
  return async <
    TReq extends Gateway.IRequest<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    TRes extends Gateway.IResponse<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    TError extends Gateway.Exception<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  >(
    req: TReq,
  ): Promise<TRes | TError | Gateway.CommonExceptions> => {
    try {
      const response = await axios.post<TRes>(`${Endpoints[service]}/command`, req, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const obj = (error.response?.data ?? {}) as Record<string, unknown>;

        return {
          success: false,
          status: typeof obj['status'] === 'number' ? obj['status'] : 500,
          type: typeof obj['type'] === 'string' ? obj['type'] : 'common/unknown-error',
          message: typeof obj['message'] === 'string' ? obj['message'] : 'Unknown error',
          details: obj['details'] ?? null,
        } as TError;
      } else {
        const unknownError = Gateway.createUnknownException();

        return unknownError as TError;
      }
    }
  };
}
