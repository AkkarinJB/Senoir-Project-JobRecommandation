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
  templateUrl: './category-form-dialog.component.html'
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
