// api-types.ts in libs/shared-utils/src/lib/types/api-types.ts

export interface ApiResponse<T> {
  data: T;
  error?: string;
  statusCode: number;
}
