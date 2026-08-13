import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Skill } from '../models/skill.model';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Skill`;

  getSkills(search?: string): Observable<Skill[]> {
    const params: Record<string, string> = {};
    if (search) {
      params['search'] = search;
    }
    return this.http.get<Skill[]>(this.baseUrl, { params });
  }

  createSkill(name: string): Observable<Skill> {
    return this.http.post<Skill>(this.baseUrl, { name });
  }
}
