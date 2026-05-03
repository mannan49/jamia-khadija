import { BaseFilter } from './base-filter.model';

export class StudentFilter extends BaseFilter {
  SearchQuery: string = String.Empty;
  Class: string = String.Empty;
  Gender: string = String.Empty;
  Department: string = String.Empty;
  IsActive: boolean;
}
