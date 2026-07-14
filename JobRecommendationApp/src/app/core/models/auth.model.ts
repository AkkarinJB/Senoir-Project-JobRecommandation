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

export interface CurrentUser {
  username: string;
  email: string;
  role: UserRole;
  uid: number;
}
