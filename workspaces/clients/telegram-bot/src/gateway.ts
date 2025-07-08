import { Gateway } from '@libs/gateway';

const GATEWAY_ENDPOINT = process.env.GATEWAY_ENDPOINT || '';

export const gateway = new Gateway({ endpoint: GATEWAY_ENDPOINT });
