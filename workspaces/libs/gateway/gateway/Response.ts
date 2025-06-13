export type IResponse<TData> = {
  success: true;
  data: TData;
  status: number;
};

export function createResponse<TData>(
  arg: Pick<IResponse<TData>, 'data' | 'status'>,
): IResponse<TData> {
  return {
    success: true,
    ...arg,
  };
}
