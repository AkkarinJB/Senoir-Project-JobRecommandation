using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CandidateProfileController : BaseApiController
    {
        public CandidateProfileController(AppDbContext context) : base(context)
        {
        }

        [HttpPost]
        public IActionResult CreateProfile(CandidateProfileCreateDto request)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized("ไม่พบผู้ใช้งานในระบบ");

            var existingProfile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (existingProfile != null)
            {
                return BadRequest("คุณได้สร้างโปรไฟล์ไว้เรียบร้อยแล้ว");
            }

            var skills = _context.Skills.Where(s => request.SkillIds.Contains(s.Id)).ToList();

            var newProfile = new CandidateProfile
            {
                UserId = user.Id,
                FullName = request.FullName,
                Skills = skills,
                ExpectedSalary = request.ExpectedSalary,
                ExperienceYears = request.ExperienceYears,
                PreferredLocation = request.PreferredLocation
            };

            _context.CandidateProfiles.Add(newProfile);
            _context.SaveChanges();

            return Ok(new { message = "สร้างโปรไฟล์ผู้สมัครสำเร็จ!", profileId = newProfile.Id });
        }

        [HttpGet("my-profile")]
        public IActionResult GetMyProfile()
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefault(p => p.UserId == user.Id);

            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            return Ok(profile);
        }

        [HttpPut("my-profile")]
        public IActionResult UpdateMyProfile(CandidateProfileCreateDto request)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            var skills = _context.Skills.Where(s => request.SkillIds.Contains(s.Id)).ToList();

            profile.FullName = request.FullName;
            profile.Skills = skills;
            profile.ExpectedSalary = request.ExpectedSalary;
            profile.ExperienceYears = request.ExperienceYears;
            profile.PreferredLocation = request.PreferredLocation;
            profile.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok(new { message = "อัปเดตโปรไฟล์สำเร็จ" });
        }

        [HttpDelete("my-profile")]
        public IActionResult DeleteMyProfile()
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            _context.CandidateProfiles.Remove(profile);
            _context.SaveChanges();

            return Ok(new { message = "ลบโปรไฟล์สำเร็จ" });
        }
    }
}
