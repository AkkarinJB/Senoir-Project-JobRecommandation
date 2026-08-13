namespace JobRecommendationApi.DTOs
{
    public class JobPostCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public List<int> SkillIds { get; set; } = new List<int>();
        public decimal OfferedSalary { get; set; }
        public string Location { get; set; } = string.Empty;
        public int? CategoryId { get; set; }
    }
}