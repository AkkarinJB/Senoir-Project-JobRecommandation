using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CandidateProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CandidateProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateProfile(CandidateProfileCreateDto request)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            
            if (user == null) return Unauthorized("ไม่พบผู้ใช้งานในระบบ");

            var existingProfile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (existingProfile != null)
            {
                return BadRequest("คุณได้สร้างโปรไฟล์ไว้เรียบร้อยแล้ว");
            }

            var newProfile = new CandidateProfile
            {
                UserId = user.Id, 
                FullName = request.FullName,
                Skills = request.Skills,
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
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);

            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            return Ok(profile);
        }

        [HttpPut("my-profile")]
        public IActionResult UpdateMyProfile(CandidateProfileCreateDto request)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            profile.FullName = request.FullName;
            profile.Skills = request.Skills;
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
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างโปรไฟล์");

            _context.CandidateProfiles.Remove(profile);
            _context.SaveChanges();

            return Ok(new { message = "ลบโปรไฟล์สำเร็จ" });
        }
    }
}