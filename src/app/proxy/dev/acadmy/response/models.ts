
export interface ResponseApi<T> {
  success: boolean;
  message?: string;
  data: T;
}
