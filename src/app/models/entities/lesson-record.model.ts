export class LessonRecord {
  Id: string;
  StudentId: string;
  StudentName: string;
  Date: string;
  Lessons: LessonEntry[];
}

export class LessonEntry {
  Type: string;
  ParaNumber: number;
  Listener: string;
  Mistakes: number;
  Description: string;
}
