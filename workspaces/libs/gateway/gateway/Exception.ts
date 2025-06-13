export interface IException<TType extends string, TDetails = null> {
  success: false;
  status: number;
  type: TType;
  message: string;
  details: TDetails;
}

export class Exception<TType extends string, TDetails>
  implements IException<TType, TDetails>
{
  success = false as const;
  status: number;
  type: TType;
  message: string;
  details: TDetails;

  constructor(arg: { type: TType; status: number; message: string; details: TDetails }) {
    this.type = arg.type;
    this.status = arg.status;
    this.message = arg.message;
    this.details = arg.details;
  }
}

export function createException<TType extends string, TDetails>(arg: {
  type: TType;
  status: number;
  message: string;
  details: TDetails;
}) {
  return new Exception(arg);
}
