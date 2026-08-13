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
    public class JobController : BaseApiController
    {
        public JobController(AppDbContext context) : base(context)
        {
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public IActionResult CreateJobPost(JobPostCreateDto request)
        {
            var user = GetCurrentUser();
            if (user == null)
            {
                return Unauthorized("ไม่พบผู้ใช้งานในระบบ");
            }

            var skills = _context.Skills.Where(s => request.SkillIds.Contains(s.Id)).ToList();

            var newJob = new JobPost
            {
                Title = request.Title,
                Description = request.Description,
                RequiredSkills = skills,
                CompanyName = request.CompanyName,
                OfferedSalary = request.OfferedSalary,
                Location = request.Location,
                CategoryId = request.CategoryId,
                EmployerId = user.Id
            };

            _context.JobPosts.Add(newJob);
            _context.SaveChanges();
            return Ok(new { message = "สร้างประกาศรับสมัครงานเรียบร้อยแล้ว!", jobId = newJob.Id });
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllJobs()
        {
            var jobs = _context.JobPosts
            .Include(j => j.RequiredSkills)
            .Where(j => j.IsActive)
            .OrderByDescending(j => j.CreatedAt)
            .ToList();

            return Ok(jobs);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetJobById(int id)
        {
            var job = _context.JobPosts.Include(j => j.RequiredSkills).FirstOrDefault(j => j.Id == id);
            if (job == null) return NotFound("ไม่พบประกาศงานนี้");

            return Ok(job);
        }

        [HttpGet("my-jobs")]
        [Authorize(Roles = "Employer")]
        public IActionResult GetMyJobs()
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var jobs = _context.JobPosts
                .Include(j => j.RequiredSkills)
                .Where(j => j.EmployerId == user.Id)
                .OrderByDescending(j => j.CreatedAt)
                .ToList();

            return Ok(jobs);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public IActionResult UpdateJobPost(int id, JobPostCreateDto request)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var job = _context.JobPosts.Include(j => j.RequiredSkills).FirstOrDefault(j => j.Id == id);
            if (job == null) return NotFound("ไม่พบประกาศงานนี้");
            if (job.EmployerId != user.Id) return Forbid();

            var skills = _context.Skills.Where(s => request.SkillIds.Contains(s.Id)).ToList();

            job.Title = request.Title;
            job.Description = request.Description;
            job.RequiredSkills = skills;
            job.CompanyName = request.CompanyName;
            job.OfferedSalary = request.OfferedSalary;
            job.Location = request.Location;
            job.CategoryId = request.CategoryId;
            job.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok(new { message = "แก้ไขประกาศงานสำเร็จ" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public IActionResult DeleteJobPost(int id)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var job = _context.JobPosts.FirstOrDefault(j => j.Id == id);
            if (job == null) return NotFound("ไม่พบประกาศงานนี้");
            if (job.EmployerId != user.Id) return Forbid();

            _context.JobPosts.Remove(job);
            _context.SaveChanges();

            return Ok(new { message = "ลบประกาศงานสำเร็จ" });
        }
    }
}
