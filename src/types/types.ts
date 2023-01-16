export interface IResponse {
  body: string
  statusCode: StatusCodes
  headers: any
}

export enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export interface IQueryParams {
  id?: string
}