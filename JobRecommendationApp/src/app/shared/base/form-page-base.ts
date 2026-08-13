import { signal } from '@angular/core';
import { extractErrorMessage } from '../../core/utils/http-error.util';

// คลาสฐานสำหรับหน้าที่มีฟอร์มให้กรอกแล้วกดบันทึก (สมัครสมาชิก, เข้าสู่ระบบ, โปรไฟล์, ประกาศงาน ฯลฯ)
// ทุกหน้าฟอร์มในโปรเจคนี้ต้องมีสถานะชุดเดียวกันเสมอ: กำลังโหลดข้อมูลเดิมอยู่ไหม, กำลังบันทึกอยู่ไหม,
// มี error หรือ success message ไหม — เดิมแต่ละ component ประกาศ signal พวกนี้ซ้ำกันเองทุกที่
// component ที่มีฟอร์มควร `extends FormPageBase` แล้วเรียก setError()/setSuccess()/clearMessages() แทน
export abstract class FormPageBase {
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // เคลียร์ข้อความทั้งสองแบบก่อนเริ่ม submit รอบใหม่ทุกครั้ง กันข้อความเก่าค้างจอ
  protected clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  // ตั้งข้อความ error จากผลลัพธ์ที่ได้จาก HTTP call — ถ้า backend ส่งข้อความมาเป็น string ก็ใช้ตรงๆ
  // ถ้าไม่ใช่ (เช่น network error, unknown shape) ใช้ fallback ที่ผู้เรียกกำหนดเอง
  protected setError(err: unknown, fallback: string): void {
    this.errorMessage.set(extractErrorMessage(err, fallback));
    this.successMessage.set(null);
  }

  protected setSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set(null);
  }
}
