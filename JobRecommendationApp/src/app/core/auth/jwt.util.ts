import { CurrentUser, UserRole } from '../models/auth.model';

// ถอด JWT payload แบบไม่พึ่ง library ภายนอก (หลีกเลี่ยงการเพิ่ม dependency ใหม่)
// หมายเหตุ: นี่แค่ decode ไม่ได้ verify signature — การ verify เกิดที่ backend อยู่แล้วทุกครั้งที่เรียก API
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// .NET JwtSecurityTokenHandler แปลงชื่อ claim มาตรฐาน (ClaimTypes.Name/.Email/.Role) เป็นชื่อสั้นแบบไม่คงที่ตาม version
// จึงเช็คหลาย key ที่เป็นไปได้แทนการเดาชื่อเดียว ให้ทนทานต่อการเปลี่ยนแปลงฝั่ง backend
function readClaim(payload: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return undefined;
}

const NAME_KEYS = ['unique_name', 'name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
const EMAIL_KEYS = ['email', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
const ROLE_KEYS = ['role', 'roles', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];

export function parseCurrentUserFromToken(token: string): CurrentUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const username = readClaim(payload, NAME_KEYS);
  const email = readClaim(payload, EMAIL_KEYS);
  const role = readClaim(payload, ROLE_KEYS) as UserRole | undefined;
  const uidRaw = payload['uid'];

  if (!username || !role) return null;

  return {
    username,
    email: email ?? '',
    role,
    uid: typeof uidRaw === 'string' ? parseInt(uidRaw, 10) : Number(uidRaw ?? 0)
  };
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = payload?.['exp'];
  if (typeof exp !== 'number') return true;

  // exp ใน JWT เป็นวินาที (Unix time) ส่วน Date.now() เป็นมิลลิวินาที
  return Date.now() >= exp * 1000;
}
