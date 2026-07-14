import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobPost, JobPostPayload } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Job`;

  getAllJobs(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(this.baseUrl);
  }

  getJobById(id: number): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/${id}`);
  }

  // เฉพาะ Employer — ประกาศงานของตัวเอง (รวมที่ปิดรับสมัครแล้ว)
  getMyJobs(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.baseUrl}/my-jobs`);
  }

  createJob(payload: JobPostPayload): Observable<{ message: string; jobId: number }> {
    return this.http.post<{ message: string; jobId: number }>(this.baseUrl, payload);
  }

  updateJob(id: number, payload: JobPostPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, payload);
  }

  deleteJob(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
