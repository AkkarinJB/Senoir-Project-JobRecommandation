import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobRecommendation } from '../models/recommendation.model';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Recommendation`;

  // ต้อง login และมีโปรไฟล์ผู้หางานแล้วเท่านั้น (backend คืน 400 ถ้ายังไม่มีโปรไฟล์)
  getRecommendedJobs(): Observable<JobRecommendation[]> {
    return this.http.get<JobRecommendation[]>(`${this.baseUrl}/match-jobs`);
  }
}
