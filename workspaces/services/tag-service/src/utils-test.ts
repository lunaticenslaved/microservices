import { CommandContext } from '#/app';
import { randomUUID } from 'crypto';

const testContext = {
  user: {
    id: randomUUID(),
  },
};

export function createTestCommandContext(
  arg: Partial<CommandContext> = {},
): CommandContext {
  return {
    user: testContext.user,
    ...arg,
  };
}
