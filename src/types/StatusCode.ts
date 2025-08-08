// Enum for HTTP status codes and their common action names
export enum StatusCode {
  OK = 200, // Success
  CREATED = 201, // Resource created
  BAD_REQUEST = 400, // Invalid input
  UNAUTHORIZED = 401, // Auth required
  FORBIDDEN = 403, // Not allowed
  NOT_FOUND = 404, // Resource not found
  INTERNAL_ERROR = 500, // Server error
}

export const StatusAction: Record<StatusCode, string> = {
  [StatusCode.OK]: 'OK',
  [StatusCode.CREATED]: 'CREATED',
  [StatusCode.BAD_REQUEST]: 'BAD_REQUEST',
  [StatusCode.UNAUTHORIZED]: 'UNAUTHORIZED',
  [StatusCode.FORBIDDEN]: 'FORBIDDEN',
  [StatusCode.NOT_FOUND]: 'NOT_FOUND',
  [StatusCode.INTERNAL_ERROR]: 'INTERNAL_ERROR',
};
