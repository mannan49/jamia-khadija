import { BaseEntity } from './base-entity.model';
import { Reference } from '../shared/reference.model';
import { Attachment } from '../shared/attachment.model';

export class LibraryBook extends BaseEntity {
  Title: string;
  Description: string;
  Author: string;
  Publisher: string;
  PublishedYear: string;
  Language: string;
  Category: string;
  Edition: string;
  TotalCopies: number;
  Index: number;
  AvailableCopies: number;
  CoverImage: Attachment;
  File: Attachment;
  UploadedBy?: Reference;
}
