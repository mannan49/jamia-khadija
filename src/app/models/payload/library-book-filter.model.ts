import { BaseFilter } from './base-filter.model';

export class LibraryBookFilter extends BaseFilter {
  Title?: string;
  Author?: string;
  Category?: string;
  Language?: string;
  Query?: string;
}
