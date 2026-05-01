import { Otp } from '@models/shared/otp.model';
import { BaseEntity } from './base-entity.model';
import { Attachment } from '@models/shared/attachment.model';

export class User extends BaseEntity {
  Name: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  Role: string;
  SignupOtp: Otp;
  ForgotOtp: Otp;
  Picture: Attachment;
}
