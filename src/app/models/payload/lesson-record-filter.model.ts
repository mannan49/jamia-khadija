import { BaseFilter } from "./base-filter.model";

export class LessonRecordFilter extends BaseFilter {
    StudentId: string;
    Type: string;
    Date: string;
    FromDate: string;
    ToDate: string;
    SearchQuery: string;
}