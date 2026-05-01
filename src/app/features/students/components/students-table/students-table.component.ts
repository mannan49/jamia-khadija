import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Dialog } from '@models/shared/diloag.model';
import { Student } from '@models/entities/student.model';
import { PagedResponse } from '@models/response/paged-response.model';

import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-students-table',
  standalone: false,
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css',
})
export class StudentsTableComponent {
  @Input() pagedStudents: PagedResponse<Student>;
  @Output() deleteButtonClicked = new EventEmitter<string>();

  constructor(private router: Router, private dialogService: DialogService) {}

  onEditButtonClick(studentId: string) {
    this.router.navigate([`students/form/${studentId}`]);
  }
  
  onDetailButtonClick(studentId: string){
    this.router.navigate([`students/lesson-record/${studentId}`]);
  }

  onDeleteButtonClick(studentId: string) {
    const dialogText: Dialog = {
      title: 'طالبعلم حذف کریں',
      message: 'کیا آپ واقعی اس طالبعلم کو حذف کرنا چاہتے ہیں؟',
      confirmText: 'حذف کریں',
      cancelText: 'منسوخ',
      confirmButtonClass: 'bg-secondary',
    };

    this.dialogService.confirm(dialogText).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteButtonClicked.emit(studentId);
      }
    });
  }
}
