// TODO move it to @lib/utils

export const Result = {
  success: <T>(data: T): ResultSuccess<T> => {
    return {
      success: true as const,
      data,
    };
  },
  error: <T>(error: T): ResultError<T> => {
    return {
      success: false as const,
      error,
    };
  },
};

export type Result<TData, TError> = ResultSuccess<TData> | ResultError<TError>;

export type ResultError<T> = {
  success: false;
  error: T;
};

export type ResultSuccess<T> = {
  success: true;
  data: T;
};
