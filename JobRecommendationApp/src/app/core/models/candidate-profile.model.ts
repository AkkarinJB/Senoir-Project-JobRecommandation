import { Skill } from './skill.model';

export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  skills: Skill[];
  expectedSalary: number;
  experienceYears: number;
  preferredLocation: string | null;
  updatedAt: string | null;
}

export interface CandidateProfilePayload {
  fullName: string;
  skillIds: number[];
  expectedSalary: number;
  experienceYears: number;
  preferredLocation: string | null;
}
