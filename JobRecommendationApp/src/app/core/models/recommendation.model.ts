export interface JobRecommendation {
  jobId: number;
  title: string;
  location: string;
  offeredSalary: number;
  matchPercentage: number;
  matchedSkills: string[];
}
