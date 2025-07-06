export class SuccessResponse<T> {
  success = true as const;
  data: T;
  status: number;

  constructor(arg: { data: T; status?: number }) {
    this.status = arg.status ?? 200;
    this.data = arg.data;
  }
}
