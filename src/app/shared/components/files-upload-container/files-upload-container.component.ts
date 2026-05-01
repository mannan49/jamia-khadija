import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, EMPTY, switchMap, take, tap } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Attachment } from '@models/shared/attachment.model';
import { UploadPreSignedUrlResponse } from '@models/response/upload-pre-signed-url-response.model';

import { ApiHttpService } from '@shared/services/api-http.service';

import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { IconDoneSvgComponent } from '../svgs/icon-done-svg/icon-done-svg.component';
import { IconUploadSvgComponent } from '../svgs/icon-upload-svg/icon-upload-svg.component';
import { IconDeleteSvgComponent } from '../svgs/icon-delete-svg/icon-delete-svg.component';

@Component({
  selector: 'app-files-upload-container',
  imports: [
    CommonModule,
    IconUploadSvgComponent,
    IconDeleteSvgComponent,
    IconDoneSvgComponent,
    ProgressBarComponent,
  ],
  templateUrl: './files-upload-container.component.html',
  styleUrl: './files-upload-container.component.css',
})
export class FilesUploadContainerComponent {
  fileUploadPercentage = 0;
  imageUploadPercentage = 0;
  isFileUploadingCompleted = false;
  isImageUploadingCompleted = false;
  resourceTypesList: Select[] = [
    { Display: 'Notes', Value: 'Notes' },
    { Display: 'TextBook', Value: 'TextBook' },
    { Display: 'HelpingBook', Value: 'HelpingBook' },
  ];

  @Input() resetForm = false;
  @Input() fileAttachment = new Attachment();
  @Input() imageAttachment = new Attachment();
  @Input() filePreview: string | ArrayBuffer | null = null;
  @Input() coverImagePreview: string | ArrayBuffer | null = null;
  @Output() imageUploaded = new EventEmitter<Attachment>();
  @Output() fileUploaded = new EventEmitter<Attachment>();

  constructor(
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.imageAttachment ||= new Attachment();
    this.fileAttachment ||= new Attachment();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetForm']?.currentValue === true) {
      this.filePreview = null;
      this.coverImagePreview = null;
      this.isFileUploadingCompleted = false;
      this.isImageUploadingCompleted = false;
      this.fileAttachment = new Attachment();
      this.imageAttachment = new Attachment();
    }
  }

  onFileSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.getPreSignedUrl(file?.type?.split('/')[1], file, type);

      // this.notesForm.patchValue({ [type]: file });
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'coverImage') {
          this.coverImagePreview = reader.result;
        } else if (type === 'pdf') {
          this.filePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  getPreSignedUrl(fileType: string, file: File, type: string) {
    this.apiHttpService
      .generatePreSignedUrl(fileType)
      .pipe(
        take(1),
        switchMap((res: UploadPreSignedUrlResponse) => {
          const url = res?.Url;
          if (type === 'coverImage') {
            this.setImageAttachment(res, file);
          } else if (type === 'pdf') {
            this.setFileAttachment(res, file);
          }
          if (url) {
            return this.apiHttpService.uploadFileToS3(url, file);
          }
          return EMPTY;
        }),
        tap(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((event.loaded / (event.total || 1)) * 100);
            if (type === 'coverImage') {
              this.imageUploadPercentage = progress;
            } else if (type === 'pdf') {
              this.fileUploadPercentage = progress;
            }
          } else if (event.type === HttpEventType.Response) {
            if (type === 'coverImage') {
              this.isImageUploadingCompleted = true;
              this.imageUploaded.emit(this.imageAttachment);
            } else if (type === 'pdf') {
              this.isFileUploadingCompleted = true;
              this.fileUploaded.emit(this.fileAttachment);
            }
          }
        }),
        catchError(err => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  setImageAttachment(res: UploadPreSignedUrlResponse, file: File) {
    this.imageUploadPercentage = 2;
    this.imageAttachment.Url = res?.FileName;
    this.imageAttachment.PublicId = res?.FileName;
    this.imageAttachment.ContentType = file.type;
    this.imageAttachment.Title = file.name;
    this.imageAttachment.Size = file.size;
  }

  setFileAttachment(res: UploadPreSignedUrlResponse, file: File) {
    this.fileUploadPercentage = 1;
    this.fileAttachment.Url = res?.FileName;
    this.fileAttachment.PublicId = res?.FileName;
    this.fileAttachment.ContentType = file.type;
    this.fileAttachment.Title = file.name;
    this.fileAttachment.Size = file.size;
  }

  removeUploadedFile(type: string) {
    // this.notesForm.patchValue({ [type]: null });
    if (type === 'coverImage') {
      this.isImageUploadingCompleted = false;
      this.coverImagePreview = null;
    } else if (type === 'pdf') {
      this.isFileUploadingCompleted = null;
      this.filePreview = null;
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
