// type for error sources
export type TErrorScources = {
  path: string | number;
  message: string;
}[];

// common error response type for all type error
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorScources;
};
