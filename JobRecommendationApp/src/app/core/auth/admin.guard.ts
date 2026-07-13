import { CanActivateFn } from '@angular/router';
import { roleGuard } from './role.guard';

// เก็บไฟล์นี้ไว้เพื่อ backward-compat กับ import เดิมใน app.routes.ts
// logic จริงย้ายไปรวมที่ role.guard.ts (roleGuard) แล้ว เพื่อใช้ซ้ำกับ Employer/JobSeeker guard ได้ด้วย
export const adminGuard: CanActivateFn = roleGuard(['Admin']);
