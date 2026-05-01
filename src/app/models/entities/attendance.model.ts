import { BaseEntity } from './base-entity.model';

export class Attendance extends BaseEntity {
  Date: string;
  Day: string;
  StudentId: string;
  StudentName: string;
  Class: string;
  Department: string;
  Status: string;
  LeaveReason: string;
  MarkedBy: string;
}
