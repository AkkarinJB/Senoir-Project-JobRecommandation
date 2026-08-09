namespace JobRecommendationApi.DTOs
{
    public class JobRecommendationResultDto
    {
        public int JobId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal OfferedSalary { get; set; }
        public double MatchPercentage { get; set; }

        public List<string> MatchedSkills { get; set; } = new List<string>();
    }
}
