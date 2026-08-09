using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Services
{
    public interface IMatchingService
    {
        double CalculateJaccardSimilarity(string jobSkills, string candidateSkills);

        JaccardDemoResultDto GetJaccardBreakdown(string jobSkills, string candidateSkills);
    }
}
