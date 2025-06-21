import { CommandContext } from '#/app';
import { randomUUID } from 'crypto';

const testContext = {
  user: {
    id: randomUUID(),
  },
};

export function createTestCommandContext(
  arg: Partial<Pick<CommandContext, 'user'>> = {},
): CommandContext {
  return {
    user: testContext.user,
    ...arg,
  };
}
