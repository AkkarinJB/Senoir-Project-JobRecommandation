using JobRecommendationApi.Data;
using JobRecommendationApi.Models;

namespace JobRecommendationApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public NotificationService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task NotifyAsync(int userId, string? toEmail, string type, string message, string emailSubject)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                Type = type,
                Message = message
            });
            _context.SaveChanges();

            if (!string.IsNullOrWhiteSpace(toEmail))
            {
                await _emailService.SendEmailAsync(toEmail, emailSubject, message);
            }
        }
    }
}
