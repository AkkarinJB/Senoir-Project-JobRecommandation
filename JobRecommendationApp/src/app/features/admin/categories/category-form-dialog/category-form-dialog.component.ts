import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobCategory } from '../../../../core/models/category.model';

export interface CategoryFormDialogData {
  category: JobCategory | null; // null = โหมดเพิ่มใหม่, มีค่า = โหมดแก้ไข
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.category ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}</h2>
    <form (ngSubmit)="save()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>ชื่อหมวดหมู่</mat-label>
          <input matInput name="name" [(ngModel)]="name" required cdkFocusInitial />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">ยกเลิก</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="!name.trim()">บันทึก</button>
      </mat-dialog-actions>
    </form>
  `
})
export class CategoryFormDialogComponent {
  dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  data = inject<CategoryFormDialogData>(MAT_DIALOG_DATA);

  name = this.data.category?.name ?? '';

  save() {
    const trimmed = this.name.trim();
    if (!trimmed) return;
    this.dialogRef.close(trimmed);
  }
}
