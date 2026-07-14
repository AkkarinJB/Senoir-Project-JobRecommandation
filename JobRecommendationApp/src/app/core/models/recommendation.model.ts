export interface JobRecommendation {
  jobId: number;
  title: string;
  location: string;
  offeredSalary: number;
  matchPercentage: number;
  skillScore: number;
  salaryScore: number;
  locationScore: number;
  matchedSkills: string[];
}
