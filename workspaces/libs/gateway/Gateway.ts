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
    const result = await a
      .post<IGatewayResponse<T>>(`${this.endpoint}/command`, config, {
        withCredentials: true,
      })
      .then(res => res.data)
      .catch(err => {
        const axiosErr = err as AxiosError;

        // The microservice responded with an error
        if (axiosErr.response) {
          return axiosErr.response.data as IGatewayResponse<T>;
        }

        // The request was made but no response received
        else if (axiosErr.request) {
          return new MicroserviceTimeoutException();
        }

        // Something happened in setting up the request
        else {
          return new GatewayException();
        }
      });

    return result;
  }
}
