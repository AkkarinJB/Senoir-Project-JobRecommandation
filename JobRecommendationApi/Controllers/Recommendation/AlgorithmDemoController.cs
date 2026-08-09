using Microsoft.AspNetCore.Mvc;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Services;

namespace JobRecommendationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmDemoController : ControllerBase
    {
        private readonly IMatchingService _matchingService;

        public AlgorithmDemoController(IMatchingService matchingService)
        {
            _matchingService = matchingService;
        }

        [HttpPost("jaccard")]
        public IActionResult CalculateJaccardBreakdown([FromBody] JaccardDemoRequestDto request)
        {
            var result = _matchingService.GetJaccardBreakdown(request.JobSkills, request.CandidateSkills);
            return Ok(result);
        }
    }
}
