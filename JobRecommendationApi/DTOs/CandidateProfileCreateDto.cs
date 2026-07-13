namespace JobRecommendationApi.DTOs
{
    public class CandidateProfileCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public decimal ExpectedSalary { get; set; }
        public int ExperienceYears { get; set; }
        public string? PreferredLocation { get; set; }
    }
}
