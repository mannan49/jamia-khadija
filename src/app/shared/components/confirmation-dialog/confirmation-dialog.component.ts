import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogData } from '@models/shared/dialog-data.model';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, MatDialogModule, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})

export class ConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent, boolean>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
