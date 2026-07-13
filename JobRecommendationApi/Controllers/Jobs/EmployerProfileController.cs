using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employer")]
    public class EmployerProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployerProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateProfile(EmployerProfileCreateDto request)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized("ไม่พบผู้ใช้งานในระบบ");

            var existingProfile = _context.EmployerProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (existingProfile != null)
            {
                return BadRequest("คุณได้สร้างข้อมูลบริษัทไว้เรียบร้อยแล้ว");
            }

            var newProfile = new EmployerProfile
            {
                UserId = user.Id,
                CompanyName = request.CompanyName,
                CompanyDescription = request.CompanyDescription,
                Address = request.Address,
                Website = request.Website
            };

            _context.EmployerProfiles.Add(newProfile);
            _context.SaveChanges();

            return Ok(new { message = "สร้างข้อมูลบริษัทสำเร็จ รอการยืนยันตัวตนจากผู้ดูแลระบบ", profileId = newProfile.Id });
        }

        [HttpGet("my-profile")]
        public IActionResult GetMyProfile()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var profile = _context.EmployerProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างข้อมูลบริษัท");

            return Ok(profile);
        }

        [HttpPut("my-profile")]
        public IActionResult UpdateMyProfile(EmployerProfileCreateDto request)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var profile = _context.EmployerProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return NotFound("คุณยังไม่ได้สร้างข้อมูลบริษัท");

            profile.CompanyName = request.CompanyName;
            profile.CompanyDescription = request.CompanyDescription;
            profile.Address = request.Address;
            profile.Website = request.Website;
            profile.UpdatedAt = DateTime.Now;

            // แก้ไขข้อมูลบริษัทแล้วต้องยืนยันตัวตนใหม่ ป้องกันสวมรอยเปลี่ยนข้อมูลหลังผ่านการ verify แล้ว
            profile.IsVerified = false;
            profile.VerifiedAt = null;

            _context.SaveChanges();

            return Ok(new { message = "อัปเดตข้อมูลบริษัทสำเร็จ ต้องรอการยืนยันตัวตนจากผู้ดูแลระบบอีกครั้ง" });
        }
    }
}
