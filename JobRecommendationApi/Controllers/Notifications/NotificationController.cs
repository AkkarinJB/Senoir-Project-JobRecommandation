using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;

namespace JobRecommendationApi.Controllers.Notifications
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-notifications")]
        public IActionResult GetMyNotifications()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var notifications = _context.Notifications
                .Where(n => n.UserId == user.Id)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var notification = _context.Notifications.FirstOrDefault(n => n.Id == id && n.UserId == user.Id);
            if (notification == null) return NotFound("ไม่พบการแจ้งเตือนนี้");

            notification.IsRead = true;
            _context.SaveChanges();

            return Ok(new { message = "อ่านแล้ว" });
        }

        [HttpPut("read-all")]
        public IActionResult MarkAllAsRead()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return Unauthorized();

            var unread = _context.Notifications.Where(n => n.UserId == user.Id && !n.IsRead).ToList();
            foreach (var n in unread)
            {
                n.IsRead = true;
            }
            _context.SaveChanges();

            return Ok(new { message = $"อ่านทั้งหมด {unread.Count} รายการ" });
        }
    }
}
