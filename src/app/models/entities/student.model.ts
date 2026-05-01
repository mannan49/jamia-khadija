import { BaseEntity } from './base-entity.model';

export class Student extends BaseEntity {
  Name: string;
  FatherName: string;
  DateOfBirth: string;
  Gender: string;
  Cnic: string;
  ParentCnic: string;
  Phone: string;
  Address: string;
  Class: string;
  EnrollmentDate: string;
  TeacherId: string;
  Department: string;
  RegistrationNumber: string;
  IsActive: boolean;
}
