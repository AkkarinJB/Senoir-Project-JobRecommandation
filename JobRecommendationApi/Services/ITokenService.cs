using JobRecommendationApi.Models;

namespace JobRecommendationApi.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);

        string GenerateRefreshToken();
    }
}
