import { Reference } from '@models/shared/reference.model';
import { McqOption } from '@models/shared/mcq-option.model';
import { Attachment } from '@models/shared/attachment.model';

export class McqTest {
  Id: string;
  Statement: string;
  Options: McqOption[];
  Subject: string;
  Grade: string;
  Chapter: Reference;
  Attachments: Attachment[];
}
