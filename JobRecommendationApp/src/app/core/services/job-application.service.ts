import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicantResult, ApplicationStatus, MyApplication } from '../models/job-application.model';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/JobApplication`;

  apply(jobId: number): Observable<{ message: string; applicationId: number }> {
    return this.http.post<{ message: string; applicationId: number }>(`${this.baseUrl}/${jobId}/apply`, {});
  }

  getMyApplications(): Observable<MyApplication[]> {
    return this.http.get<MyApplication[]>(`${this.baseUrl}/my-applications`);
  }

  // เฉพาะ Employer เจ้าของประกาศงาน
  getApplicantsForJob(jobId: number): Observable<ApplicantResult[]> {
    return this.http.get<ApplicantResult[]>(`${this.baseUrl}/job/${jobId}`);
  }

  updateStatus(applicationId: number, status: ApplicationStatus): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${applicationId}/status`, { status });
  }
}
