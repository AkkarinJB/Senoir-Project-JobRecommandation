using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Services;

namespace JobRecommendationApi.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public AdminController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .Select(u => new { u.Id, u.Username, u.Email, u.Role, u.CreatedAt })
                .ToList();
            return Ok(users);
        }

        [HttpGet("employers/pending")]
        public IActionResult GetPendingEmployers()
        {
            var pending = _context.EmployerProfiles.Where(p => !p.IsVerified).ToList();
            return Ok(pending);
        }

        [HttpPost("employers/{id}/verify")]
        public async Task<IActionResult> VerifyEmployer(int id)
        {
            var profile = _context.EmployerProfiles.FirstOrDefault(p => p.Id == id);
            if (profile == null) return NotFound("ไม่พบข้อมูลบริษัท");

            profile.IsVerified = true;
            profile.VerifiedAt = DateTime.Now;
            _context.SaveChanges();

            var employerUser = _context.Users.FirstOrDefault(u => u.Id == profile.UserId);
            if (employerUser != null)
            {
                await _notificationService.NotifyAsync(
                    employerUser.Id,
                    employerUser.Email,
                    NotificationType.EmployerVerified,
                    $"บัญชีบริษัท \"{profile.CompanyName}\" ของคุณได้รับการยืนยันตัวตนแล้ว",
                    "ยืนยันตัวตนสำเร็จ - Udonthani.link"
                );
            }

            return Ok(new { message = "ยืนยันตัวตนผู้ประกอบการสำเร็จ" });
        }

        [HttpPost("employers/{id}/reject")]
        public IActionResult RejectEmployer(int id)
        {
            var profile = _context.EmployerProfiles.FirstOrDefault(p => p.Id == id);
            if (profile == null) return NotFound("ไม่พบข้อมูลบริษัท");

            profile.IsVerified = false;
            profile.VerifiedAt = null;
            _context.SaveChanges();

            return Ok(new { message = "ปฏิเสธการยืนยันตัวตนแล้ว" });
        }

        [HttpGet("jobs")]
        public IActionResult GetAllJobsForModeration()
        {
            var jobs = _context.JobPosts.OrderByDescending(j => j.CreatedAt).ToList();
            return Ok(jobs);
        }

        [HttpDelete("jobs/{id}")]
        public IActionResult RemoveJobPost(int id)
        {
            var job = _context.JobPosts.FirstOrDefault(j => j.Id == id);
            if (job == null) return NotFound("ไม่พบประกาศงาน");

            _context.JobPosts.Remove(job);
            _context.SaveChanges();

            return Ok(new { message = "ลบประกาศงานสำเร็จ (โดยผู้ดูแลระบบ)" });
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        public IActionResult GetCategories()
        {
            return Ok(_context.JobCategories.ToList());
        }

        [HttpPost("categories")]
        public IActionResult CreateCategory(JobCategoryDto request)
        {
            if (_context.JobCategories.Any(c => c.Name == request.Name))
            {
                return BadRequest("มีหมวดหมู่นี้อยู่แล้ว");
            }

            var category = new JobCategory { Name = request.Name };
            _context.JobCategories.Add(category);
            _context.SaveChanges();

            return Ok(new { message = "เพิ่มหมวดหมู่สำเร็จ", categoryId = category.Id });
        }

        [HttpPut("categories/{id}")]
        public IActionResult UpdateCategory(int id, JobCategoryDto request)
        {
            var category = _context.JobCategories.FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound("ไม่พบหมวดหมู่");

            category.Name = request.Name;
            _context.SaveChanges();

            return Ok(new { message = "แก้ไขหมวดหมู่สำเร็จ" });
        }

        [HttpDelete("categories/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.JobCategories.FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound("ไม่พบหมวดหมู่");

            _context.JobCategories.Remove(category);
            _context.SaveChanges();

            return Ok(new { message = "ลบหมวดหมู่สำเร็จ" });
        }
    }
}
