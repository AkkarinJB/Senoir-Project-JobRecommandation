using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Services; 

namespace JobRecommendationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMatchingService _matchingService;

        public RecommendationController(AppDbContext context, IMatchingService matchingService)
        {
            _context = context;
            _matchingService = matchingService;
        }

        [HttpGet("match-jobs")]
        public IActionResult GetRecommendedJobs()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return BadRequest("กรุณาสร้างโปรไฟล์ก่อนใช้งานระบบแนะนำงาน");

            var allJobs = _context.JobPosts.Where(j => j.IsActive).ToList();
            var recommendations = new List<JobRecommendationResultDto>();

            foreach (var job in allJobs)
            {
                double matchPercentage = _matchingService.CalculateJaccardSimilarity(job.RequiredSkills, profile.Skills);

                char[] delimiters = { ',', ' ' };
                var candidateSkills = profile.Skills.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                                                    .Select(s => s.ToLowerInvariant()).ToList();
                var jobSkills = job.RequiredSkills.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                                                  .Select(s => s.ToLowerInvariant()).ToList();
                var matchedSkills = jobSkills.Intersect(candidateSkills).ToList();

                recommendations.Add(new JobRecommendationResultDto
                {
                    JobId = job.Id,
                    Title = job.Title,
                    Location = job.Location,
                    OfferedSalary = job.OfferedSalary,
                    MatchPercentage = matchPercentage,
                    MatchedSkills = matchedSkills
                });
            }

            var sortedRecommendations = recommendations
                                        .OrderByDescending(r => r.MatchPercentage)
                                        .ToList();

            return Ok(sortedRecommendations);
        }
    }
}