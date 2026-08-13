using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Services;

namespace JobRecommendationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecommendationController : BaseApiController
    {
        private readonly IMatchingService _matchingService;

        public RecommendationController(AppDbContext context, IMatchingService matchingService) : base(context)
        {
            _matchingService = matchingService;
        }

        [HttpGet("match-jobs")]
        public IActionResult GetRecommendedJobs()
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return BadRequest("กรุณาสร้างโปรไฟล์ก่อนใช้งานระบบแนะนำงาน");

            var activeJobs = _context.JobPosts.Include(j => j.RequiredSkills).Where(j => j.IsActive).ToList();

            var recommendations = activeJobs
                .Select(job => BuildRecommendation(job, profile.Skills))
                .OrderByDescending(r => r.MatchPercentage)
                .ToList();

            return Ok(recommendations);
        }

        // เทียบทักษะของงานหนึ่งใบกับโปรไฟล์ผู้สมัคร แล้วคืนผลลัพธ์พร้อมเปอร์เซ็นต์ความเหมาะสม
        // Skill เป็น master data ที่ผ่านการ dedupe ตอนสร้างแล้ว จึงเปรียบชื่อ (ผ่าน string ที่ join จาก relation)
        // ให้ผลลัพธ์เดียวกับเทียบด้วย Skill ID ทุกประการ — ใช้ MatchingService ตัวเดิมที่ผ่านการ demo/ทดสอบแล้วได้เลย
        private JobRecommendationResultDto BuildRecommendation(JobPost job, ICollection<Skill> candidateSkills)
        {
            var candidateSkillNames = candidateSkills.Select(s => s.Name).ToList();
            var jobSkillNames = job.RequiredSkills.Select(s => s.Name).ToList();

            double matchPercentage = _matchingService.CalculateJaccardSimilarity(
                string.Join(", ", jobSkillNames),
                string.Join(", ", candidateSkillNames));

            var matchedSkills = jobSkillNames
                .Select(s => s.ToLowerInvariant())
                .Intersect(candidateSkillNames.Select(s => s.ToLowerInvariant()))
                .ToList();

            return new JobRecommendationResultDto
            {
                JobId = job.Id,
                Title = job.Title,
                Location = job.Location,
                OfferedSalary = job.OfferedSalary,
                MatchPercentage = matchPercentage,
                MatchedSkills = matchedSkills
            };
        }
    }
}
