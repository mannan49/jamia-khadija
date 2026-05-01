import { BaseFilter } from './base-filter.model';

export class LibraryRecordFilter extends BaseFilter {
  BookId?: string;
  BorrowerId?: string;
  IsBorrowed?: boolean;
  BorrowDateFrom?: Date;
  BorrowDateTo?: Date;
  Query?: string;
}
