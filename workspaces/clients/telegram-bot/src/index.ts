import 'dotenv/config';

import express from 'express';
import axios, { AxiosError } from 'axios';
import YAML from 'yaml';
import {
  Exception,
  GatewayRequestSchema,
  IGatewayResponse,
  RequestValidationException,
  UnknownException,
} from '@libs/gateway';

const PORT = 3000;
const GATEWAY_ENDPOINT = process.env.GATEWAY_ENDPOINT || '';

const app = express();

app.use(express.text());

app.post('/test-message', async (req, res) => {
  console.log(req.body, GATEWAY_ENDPOINT);
  const message = req.body;

  // FIXME catch error send common error
  const actionRequest = YAML.parse(message);
  console.log('[TELEGRAM BOT] Received message:', actionRequest);

  const validatedBody = GatewayRequestSchema.safeParse(actionRequest);
  console.log('[TELEGRAM BOT] Validation success:', validatedBody.success);

  if (!validatedBody.success) {
    const result = new RequestValidationException({ issues: validatedBody.error.issues });

    console.error('[TELEGRAM BOT] [COMMAND ERROR]', JSON.stringify(result, null, 2));

    res.status(result.status).send(result).json().end();
  } else {
    const result = await axios
      .post<IGatewayResponse>(`${GATEWAY_ENDPOINT}/command`, validatedBody.data, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(res => res.data as IGatewayResponse)
      .catch(
        error =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((error as AxiosError).response?.data as Exception<any, any>) ||
          new UnknownException(),
      );

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
