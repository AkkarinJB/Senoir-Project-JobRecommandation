namespace JobRecommendationApi.DTOs
{
    public class JaccardDemoResultDto
    {
        public List<string> SetA { get; set; } = new List<string>();
        public List<string> SetB { get; set; } = new List<string>();
        public List<string> Intersection { get; set; } = new List<string>();
        public List<string> Union { get; set; } = new List<string>();

        public int IntersectionCount { get; set; }
        public int UnionCount { get; set; }

        public double MatchPercentage { get; set; }
    }
}
