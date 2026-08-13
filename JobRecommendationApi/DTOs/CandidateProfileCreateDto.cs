namespace JobRecommendationApi.DTOs
{
    public class CandidateProfileCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public List<int> SkillIds { get; set; } = new List<int>();
        public decimal ExpectedSalary { get; set; }
        public int ExperienceYears { get; set; }
        public string? PreferredLocation { get; set; }
    }
}
