import { CommandContext } from '#/app';

export function createTestCommandContext(
  arg: Partial<CommandContext> = {},
): CommandContext {
  return {
    ...arg,
  };
}
