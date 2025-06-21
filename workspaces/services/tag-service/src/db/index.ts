import { Prisma } from './generated';

export { Database } from '../db/db-singleton';
export type PrismaTransaction = Prisma.TransactionClient;
