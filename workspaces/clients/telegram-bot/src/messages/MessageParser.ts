export class MessageParser {
  isMatch: (text: string) => boolean;
  handle: (text: string) => Promise<{ success: boolean; message: string }>;

  constructor(arg: {
    isMatch: (text: string) => boolean;
    handle: (text: string) => Promise<{ success: boolean; message: string }>;
  }) {
    this.isMatch = arg.isMatch;
    this.handle = arg.handle;

    MESSAGES.push(this);
  }
}

export const MESSAGES: MessageParser[] = [];
