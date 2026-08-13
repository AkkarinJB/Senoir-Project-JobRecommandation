import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobCategory } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private adminBaseUrl = `${environment.apiUrl}/Admin/categories`;
  private publicBaseUrl = `${environment.apiUrl}/Category`;

  getCategories(): Observable<JobCategory[]> {
    return this.http.get<JobCategory[]>(this.publicBaseUrl);
  }

  addCategory(name: string): Observable<JobCategory> {
    return this.http.post<JobCategory>(this.publicBaseUrl, { name });
  }

  createCategory(name: string): Observable<{ message: string; categoryId: number }> {
    return this.http.post<{ message: string; categoryId: number }>(this.adminBaseUrl, { name });
  }

  updateCategory(id: number, name: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.adminBaseUrl}/${id}`, { name });
  }

  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.adminBaseUrl}/${id}`);
  }
}
