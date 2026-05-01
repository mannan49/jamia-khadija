import { BaseFilter } from './base-filter.model';

export class EntityFilter extends BaseFilter {
  Board?: string;
  Boards?: string[];
  Subject?: string;
  Query?: string;
  Types?: string[];
  Grade?: string;
  ChapterIds?: string[];
  DifficultyLevel?: string;
}
