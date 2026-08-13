namespace JobRecommendationApi.DTOs
{
    public class SkillDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateSkillDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
