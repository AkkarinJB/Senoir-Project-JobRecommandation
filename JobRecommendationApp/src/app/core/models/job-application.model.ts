export type ApplicationStatus = 'Applied' | 'Reviewed' | 'Accepted' | 'Rejected';

export const APPLICATION_STATUSES: ApplicationStatus[] = ['Applied', 'Reviewed', 'Accepted', 'Rejected'];

export interface MyApplication {
  id: number;
  status: ApplicationStatus;
  appliedAt: string;
  jobId: number;
  title: string;
  companyName: string;
  location: string;
}

export interface ApplicantResult {
  applicationId: number;
  jobPostId: number;
  jobTitle: string;
  candidateProfileId: number;
  candidateName: string;
  candidateSkills: string;
  candidateExperienceYears: number;
  status: ApplicationStatus;
  appliedAt: string;
}
