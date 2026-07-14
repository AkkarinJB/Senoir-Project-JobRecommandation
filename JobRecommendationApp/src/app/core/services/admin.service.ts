import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUserSummary } from '../models/admin.model';
import { EmployerProfile } from '../models/employer-profile.model';
import { JobPost } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Admin`;

  getUsers(): Observable<AdminUserSummary[]> {
    return this.http.get<AdminUserSummary[]>(`${this.baseUrl}/users`);
  }

  getPendingEmployers(): Observable<EmployerProfile[]> {
    return this.http.get<EmployerProfile[]>(`${this.baseUrl}/employers/pending`);
  }

  verifyEmployer(employerProfileId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/employers/${employerProfileId}/verify`, {});
  }

  rejectEmployer(employerProfileId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/employers/${employerProfileId}/reject`, {});
  }

  // moderation — เห็นทุกประกาศงานรวมที่ปิดรับสมัครแล้ว ต่างจาก JobService.getAllJobs (public, active เท่านั้น)
  getAllJobsForModeration(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.baseUrl}/jobs`);
  }

  deleteJob(jobId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/jobs/${jobId}`);
  }
}
