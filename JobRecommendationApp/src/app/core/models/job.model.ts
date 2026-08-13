import { Skill } from './skill.model';

export interface JobPost {
  id: number;
  title: string;
  description: string;
  companyName: string;
  requiredSkills: Skill[];
  offeredSalary: number;
  location: string;
  employerId: number;
  categoryId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface JobPostPayload {
  title: string;
  description: string;
  companyName: string;
  skillIds: number[];
  offeredSalary: number;
  location: string;
  categoryId: number | null;
}
