import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JaccardDemoRequest, JaccardDemoResult } from '../models/algorithm-demo.model';

// เรียก AlgorithmDemoController ฝั่ง backend ซึ่งตั้งใจเปิดสาธารณะ (ไม่ต้อง login)
// เพราะใช้สำหรับสาธิตขั้นตอนอัลกอริทึมต่อกรรมการสอบเท่านั้น ไม่เกี่ยวกับการจับคู่งานจริง
@Injectable({ providedIn: 'root' })
export class AlgorithmDemoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/AlgorithmDemo`;

  calculateJaccard(request: JaccardDemoRequest): Observable<JaccardDemoResult> {
    return this.http.post<JaccardDemoResult>(`${this.baseUrl}/jaccard`, request);
  }
}
