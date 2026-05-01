import { Attachment } from '@models/shared/attachment.model';

export class UserModel {
  Id: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
  Picture: Attachment;
}
