import axios, { AxiosError } from 'axios';

import { ServiceCommandConfig } from './api-microservice';
import { MicroserviceTimeoutException, GatewayException } from './interfaces';
import { IGatewayRequest } from './GatewayRequest';
import { IGatewayResponse } from './GatewayResponse';

const a = axios.create();

export class Gateway {
  private endpoint: string;

  constructor(arg: { endpoint: string }) {
    this.endpoint = arg.endpoint;
  }

  async command<T extends ServiceCommandConfig['command']>(config: IGatewayRequest<T>) {
    const result: IGatewayResponse<T> = await a
      .post(`${this.endpoint}/command`, config, {
        withCredentials: true,
      })
      .then(res => res.data)
      .catch(err => {
        const axiosErr = err as AxiosError;

        // The microservice responded with an error
        if (axiosErr.response) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return axiosErr.response.data as any;
        }

        // The request was made but no response received
        else if (axiosErr.request) {
          const exception = new MicroserviceTimeoutException();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return exception as any;
        }

        // Something happened in setting up the request
        else {
          const exception = new GatewayException();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return exception as any;
        }
      });

    return result;
  }
}
