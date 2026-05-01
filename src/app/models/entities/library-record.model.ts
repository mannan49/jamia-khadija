import { BaseEntity } from './base-entity.model';
import { Reference } from '../shared/reference.model';

export class LibraryRecord extends BaseEntity {
  LibraryBook: Reference;
  Borrower: Reference;
  BorrowDate: Date;
  ReturnDate: Date;
  ActualReturnDate: Date;
  IssuerName: string;
  IsBorrowed: boolean;
  Condition: string;
  ConditionOnReturn: string;
  Remarks: string;
  IssuedBy: Reference;
}
