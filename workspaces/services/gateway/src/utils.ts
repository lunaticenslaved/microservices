import { IGatewayRequest, ServiceCommandConfig, ServiceContracts } from '@libs/gateway';
import { Service, ServiceContract } from '@libs/gateway';

import { IncomingHttpHeaders } from 'http';
import { AxiosResponse } from 'axios';
import { Response } from 'express';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getServiceFromRequest(req: IGatewayRequest<any>): Service {
  const service = req.command.split('/')[0] as Service;

  return service;
}

export function getServiceContract(
  service: Service,
): ServiceContract<ServiceCommandConfig> {
  return ServiceContracts[service] as ServiceContract<ServiceCommandConfig>;
}

export function forwardRequestHeaders(
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

export function forwardResponseHeaders(
  axiosResponse: AxiosResponse,
  expressResponse: Response,
) {
  RESPONSE_HEADERS_TO_FORWARD.forEach(header => {
    const headerValue = axiosResponse.headers[header];

    if (headerValue) {
      expressResponse.setHeader(header, headerValue);
    }
  });

  // Add gateway-specific headers
  expressResponse.setHeader('x-gateway-response', 'true');
}
