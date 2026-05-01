export class PagedResponse<T> {
  Items: T[];
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}
