export class AttendanceEntryPayload {
  StudentId: string;
  StudentName: string;
  Class: string;
  Department: string;
  Status: string;
  LeaveReason: string = String.Empty;
}

export class AttendanceBatchPayload {
  Date: string;
  Entries: AttendanceEntryPayload[] = [];
}
