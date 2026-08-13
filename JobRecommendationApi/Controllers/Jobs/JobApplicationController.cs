using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Services;

namespace JobRecommendationApi.Controllers.Jobs
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JobApplicationController : BaseApiController
    {
        private readonly INotificationService _notificationService;

        public JobApplicationController(AppDbContext context, INotificationService notificationService) : base(context)
        {
            _notificationService = notificationService;
        }

        // ผู้หางานสมัครงาน
        [HttpPost("{jobId}/apply")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> Apply(int jobId)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return BadRequest("กรุณาสร้างโปรไฟล์ก่อนสมัครงาน");

            var job = _context.JobPosts.FirstOrDefault(j => j.Id == jobId && j.IsActive);
            if (job == null) return NotFound("ไม่พบประกาศงานนี้ หรือประกาศถูกปิดรับสมัครแล้ว");

            var alreadyApplied = _context.JobApplications
                .Any(a => a.JobPostId == jobId && a.CandidateProfileId == profile.Id);
            if (alreadyApplied)
            {
                return BadRequest("คุณได้สมัครงานนี้ไปแล้ว");
            }

            var application = new JobApplication
            {
                JobPostId = jobId,
                CandidateProfileId = profile.Id,
                Status = JobApplicationStatus.Applied
            };

            _context.JobApplications.Add(application);
            _context.SaveChanges();

            var employer = _context.Users.FirstOrDefault(u => u.Id == job.EmployerId);
            if (employer != null)
            {
                await _notificationService.NotifyAsync(
                    employer.Id,
                    employer.Email,
                    NotificationType.NewApplication,
                    $"มีผู้สมัครงานใหม่สำหรับตำแหน่ง \"{job.Title}\"",
                    "มีผู้สมัครงานใหม่ - Udonthani.link"
                );
            }

            return Ok(new { message = "ส่งใบสมัครสำเร็จ", applicationId = application.Id });
        }

        [HttpGet("my-applications")]
        [Authorize(Roles = "JobSeeker")]
        public IActionResult GetMyApplications()
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null) return Ok(new List<object>());

            var applications = (
                from a in _context.JobApplications
                join j in _context.JobPosts on a.JobPostId equals j.Id
                where a.CandidateProfileId == profile.Id
                orderby a.AppliedAt descending
                select new
                {
                    a.Id,
                    a.Status,
                    a.AppliedAt,
                    JobId = j.Id,
                    j.Title,
                    j.CompanyName,
                    j.Location
                }
            ).ToList();

            return Ok(applications);
        }

        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer")]
        public IActionResult GetApplicantsForJob(int jobId)
        {
            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var job = _context.JobPosts.FirstOrDefault(j => j.Id == jobId);
            if (job == null) return NotFound("ไม่พบประกาศงานนี้");
            if (job.EmployerId != user.Id) return Forbid();

            var applicants = (
                from a in _context.JobApplications
                join c in _context.CandidateProfiles on a.CandidateProfileId equals c.Id
                where a.JobPostId == jobId
                orderby a.AppliedAt descending
                select new JobApplicationResultDto
                {
                    ApplicationId = a.Id,
                    JobPostId = jobId,
                    JobTitle = job.Title,
                    CandidateProfileId = c.Id,
                    CandidateName = c.FullName,
                    CandidateSkills = c.Skills.Select(s => s.Name).ToList(),
                    CandidateExperienceYears = c.ExperienceYears,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                }
            ).ToList();

            return Ok(applicants);
        }

        [HttpPut("{applicationId}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateStatus(int applicationId, JobApplicationStatusUpdateDto request)
        {
            if (!JobApplicationStatus.All.Contains(request.Status))
            {
                return BadRequest("สถานะไม่ถูกต้อง ต้องเป็นหนึ่งใน: " + string.Join(", ", JobApplicationStatus.All));
            }

            var user = GetCurrentUser();
            if (user == null) return Unauthorized();

            var application = _context.JobApplications.FirstOrDefault(a => a.Id == applicationId);
            if (application == null) return NotFound("ไม่พบใบสมัคร");

            var job = _context.JobPosts.FirstOrDefault(j => j.Id == application.JobPostId);
            if (job == null || job.EmployerId != user.Id) return Forbid();

            application.Status = request.Status;
            application.UpdatedAt = DateTime.Now;
            _context.SaveChanges();

            var candidateProfile = _context.CandidateProfiles.FirstOrDefault(c => c.Id == application.CandidateProfileId);
            var candidateUser = candidateProfile != null
                ? _context.Users.FirstOrDefault(u => u.Id == candidateProfile.UserId)
                : null;

            if (candidateUser != null)
            {
                await _notificationService.NotifyAsync(
                    candidateUser.Id,
                    candidateUser.Email,
                    NotificationType.ApplicationStatusChanged,
                    $"สถานะใบสมัครตำแหน่ง \"{job.Title}\" ของคุณเปลี่ยนเป็น {request.Status}",
                    "อัปเดตสถานะใบสมัครงาน - Udonthani.link"
                );
            }

            return Ok(new { message = "อัปเดตสถานะใบสมัครสำเร็จ" });
        }
    }
}
