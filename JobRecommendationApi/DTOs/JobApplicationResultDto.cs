namespace JobRecommendationApi.DTOs
{
    public class JobApplicationResultDto
    {
        public int ApplicationId { get; set; }
        public int JobPostId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public int CandidateProfileId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateSkills { get; set; } = string.Empty;
        public int CandidateExperienceYears { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
    }
}
