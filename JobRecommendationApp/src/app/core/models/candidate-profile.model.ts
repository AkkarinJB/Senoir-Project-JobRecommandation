export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  skills: string;
  expectedSalary: number;
  experienceYears: number;
  preferredLocation: string | null;
  updatedAt: string | null;
}

export interface CandidateProfilePayload {
  fullName: string;
  skills: string;
  expectedSalary: number;
  experienceYears: number;
  preferredLocation: string | null;
}
