import fs from 'fs';
import path from 'path';
import z from 'zod/v4';

export function nonReachable(arg: never): never {
  return arg;
}

export async function recursiveImport(dir: string) {
  const paths = fs.readdirSync(dir);

  while (paths.length) {
    const item = paths.pop();

    if (!item) {
      continue;
    }

    const currentPath = path.resolve(dir, item);
    const stat = fs.lstatSync(currentPath);

    if (stat.isDirectory()) {
      fs.readdirSync(currentPath).forEach(i => {
        paths.push(`${item}/${i}`);
      });
    } else {
      await import(currentPath).catch(() => null);
    }
  }
}

export function parseSchema<T>(data: unknown, schema: z.ZodType<T>): T {
  const parsed = z.safeParse(schema, data);

  if (parsed.success) {
    return parsed.data;
  }

  throw new Error('Error parsing data!');
}
