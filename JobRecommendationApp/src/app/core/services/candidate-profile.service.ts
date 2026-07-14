import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CandidateProfile, CandidateProfilePayload } from '../models/candidate-profile.model';

@Injectable({ providedIn: 'root' })
export class CandidateProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/CandidateProfile`;

  getMyProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/my-profile`);
  }

  createProfile(payload: CandidateProfilePayload): Observable<{ message: string; profileId: number }> {
    return this.http.post<{ message: string; profileId: number }>(this.baseUrl, payload);
  }

  updateProfile(payload: CandidateProfilePayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/my-profile`, payload);
  }

  deleteProfile(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/my-profile`);
  }
}
