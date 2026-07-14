import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployerProfile, EmployerProfilePayload } from '../models/employer-profile.model';

@Injectable({ providedIn: 'root' })
export class EmployerProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/EmployerProfile`;

  getMyProfile(): Observable<EmployerProfile> {
    return this.http.get<EmployerProfile>(`${this.baseUrl}/my-profile`);
  }

  createProfile(payload: EmployerProfilePayload): Observable<{ message: string; profileId: number }> {
    return this.http.post<{ message: string; profileId: number }>(this.baseUrl, payload);
  }

  updateProfile(payload: EmployerProfilePayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/my-profile`, payload);
  }
}
