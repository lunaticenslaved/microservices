export type IResponse<TData> = {
  success: true;
  data: TData;
  status: number;
};
