export class StudentFilter {
  SearchQuery: string = String.Empty;
  Class: string = String.Empty;
  Gender: string = String.Empty;
  Department: string = String.Empty;
  IsActive: boolean = true;
  SortField: string = String.Empty;
  SortOrder: string = String.Empty;
  PageIndex: number = 1;
  Limit: number = 20;
}
