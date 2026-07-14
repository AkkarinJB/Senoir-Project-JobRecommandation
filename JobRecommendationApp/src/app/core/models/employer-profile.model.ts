export interface EmployerProfile {
  id: number;
  userId: number;
  companyName: string;
  companyDescription: string | null;
  address: string | null;
  website: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface EmployerProfilePayload {
  companyName: string;
  companyDescription: string | null;
  address: string | null;
  website: string | null;
}
