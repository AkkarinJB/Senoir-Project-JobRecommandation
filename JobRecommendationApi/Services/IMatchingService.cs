namespace JobRecommendationApi.Services
{
    public interface IMatchingService
    {
        double CalculateCosineSimilarity(string jobSkills, string candidateSkills);

        double CalculateLocationScore(string? candidateLocation, string? jobLocation);
    }
}
