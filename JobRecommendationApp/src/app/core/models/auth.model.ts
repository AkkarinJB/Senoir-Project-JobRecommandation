// บทบาทต้องตรงกับ enum ฝั่ง backend (User.Role ใน JobRecommendationApi) ตัวสะกดต้องเหมือนกันเป๊ะ
export type UserRole = 'JobSeeker' | 'Employer' | 'Admin';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: 'JobSeeker' | 'Employer';
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: UserRole;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

// ข้อมูลที่ถอดได้จาก JWT payload (ดู claims ที่ TokenService ฝั่ง backend ใส่ไว้)
export interface CurrentUser {
  username: string;
  email: string;
  role: UserRole;
  uid: number;
}
