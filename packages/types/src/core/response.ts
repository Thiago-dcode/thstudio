export type ResponseBase = {
  audit: {
    device: string;
    ip: string;
  };
};
export type ResponseError = ResponseBase & {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
};

export type ResponseSuccess<T> = ResponseBase & {
  data: T;
};
export type ResponseSuccessList<T> = ResponseBase & {
  data: T[];
  total: number;
};

export type ResponseSuccessPagination<T> = ResponseSuccessList<T> & {
  pagination: {
    page: number;
    per_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
  };
};
