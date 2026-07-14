import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobCategory } from '../models/category.model';

// endpoint จริงอยู่ใต้ /api/Admin/categories — GET เปิด public (AllowAnonymous ฝั่ง backend) แต่ POST/PUT/DELETE ต้องเป็น Admin เท่านั้น
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Admin/categories`;

  getCategories(): Observable<JobCategory[]> {
    return this.http.get<JobCategory[]>(this.baseUrl);
  }

  createCategory(name: string): Observable<{ message: string; categoryId: number }> {
    return this.http.post<{ message: string; categoryId: number }>(this.baseUrl, { name });
  }

  updateCategory(id: number, name: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, { name });
  }

  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
