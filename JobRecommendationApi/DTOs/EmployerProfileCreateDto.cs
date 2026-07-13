namespace JobRecommendationApi.DTOs
{
    public class EmployerProfileCreateDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyDescription { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
    }
}
