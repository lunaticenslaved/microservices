import 'dotenv/config';

import express from 'express';
import axios, { AxiosError } from 'axios';

import { Action } from '@libs/types';

const PORT = Number(process.env.PORT__TELEGRAM_BOT);

const app = express();

export const Services = {
  food: {
    act: act,
  },
};

app.use(express.json());

app.post('/message', async (req, res) => {
  const validatedBody = Action.RequestValidator.safeParse(req);

  console.log('[TELEGRAM BOT]', req.body);

  if (!validatedBody.success) {
    const result: Action.CommonError.RequestValidation =
      Action.Error.createRequestValidationError({
        issues: validatedBody.error.issues,
      });

    console.error('[TELEGRAM BOT] [ACT ERROR]', JSON.stringify(result, null, 2));

    res.status(result.status).send(result).json().end();
  } else {
    const result = await Services.food.act(req.body);

    if (!result.success) {
      console.error('[TELEGRAM BOT] [ACT ERROR]', JSON.stringify(result, null, 2));
    } else {
      console.log('[TELEGRAM BOT] [ACT SUCCESS]', JSON.stringify(result, null, 2));
    }

    res.status(result.status).send(result).json().end();
  }
});

app.listen(PORT, () => {
  console.log(`[TELEGRAM BOT] Up and running on port ${PORT}!`);
});

async function act<
  TReq extends Action.IRequest<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRes extends Action.IResponse<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TError extends Action.IError<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
>(req: TReq): Promise<TRes | TError | Action.CommonError.Any> {
  try {
    const response = await axios.post('http://localhost:4002/act', req, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    return response.data as TRes;
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
      const unknownError: Action.CommonError.UnknownError = {
        success: false,
        status: 500,
        type: 'common/unknown-error',
        message: 'Unknown error',
        details: null,
      };

      return unknownError as TError;
    }
  }
}
