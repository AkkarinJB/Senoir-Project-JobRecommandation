import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../core/services/category.service';
import { JobCategory } from '../../../core/models/category.model';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="page-title mb-0">หมวดหมู่งาน</h1>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          เพิ่มหมวดหมู่
        </button>
      </div>

      @if (isLoading()) {
        <mat-spinner diameter="32"></mat-spinner>
      } @else if (categories().length === 0) {
        <p class="text-muted">ยังไม่มีหมวดหมู่งาน</p>
      } @else {
        <table mat-table [dataSource]="categories()" class="w-full card p-0 overflow-hidden">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>ชื่อหมวดหมู่</th>
            <td mat-cell *matCellDef="let category">{{ category.name }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="text-right">จัดการ</th>
            <td mat-cell *matCellDef="let category" class="text-right">
              <button mat-icon-button (click)="openEditDialog(category)" aria-label="แก้ไขหมวดหมู่">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteCategory(category)" aria-label="ลบหมวดหมู่">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      }
    </div>
  `
})
export class AdminCategoriesComponent {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'actions'];
  isLoading = signal(true);
  categories = signal<JobCategory[]>([]);

  constructor() {
    this.load();
  }

  private load() {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('โหลดหมวดหมู่ไม่สำเร็จ', 'ปิด', { duration: 3000 });
      }
    });
  }

  openCreateDialog() {
    this.openDialog(null);
  }

  openEditDialog(category: JobCategory) {
    this.openDialog(category);
  }

  private openDialog(category: JobCategory | null) {
    const ref = this.dialog.open(CategoryFormDialogComponent, {
      data: { category },
      width: '400px'
    });

    ref.afterClosed().subscribe((name?: string) => {
      if (!name) return;

      const request = category
        ? this.categoryService.updateCategory(category.id, name)
        : this.categoryService.createCategory(name);

      request.subscribe({
        next: () => {
          this.snackBar.open(category ? 'แก้ไขหมวดหมู่สำเร็จ' : 'เพิ่มหมวดหมู่สำเร็จ', 'ปิด', { duration: 2500 });
          this.load();
        },
        error: () => this.snackBar.open('บันทึกไม่สำเร็จ (อาจมีชื่อนี้อยู่แล้ว)', 'ปิด', { duration: 3000 })
      });
    });
  }

  deleteCategory(category: JobCategory) {
    if (!confirm(`ยืนยันการลบหมวดหมู่ "${category.name}"?`)) return;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.id !== category.id));
        this.snackBar.open('ลบหมวดหมู่สำเร็จ', 'ปิด', { duration: 2500 });
      },
      error: () => this.snackBar.open('ลบหมวดหมู่ไม่สำเร็จ', 'ปิด', { duration: 3000 })
    });
  }
}
