using System.Net;
using System.Net.Mail;

namespace JobRecommendationApi.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                return;
            }

            var host = _configuration["Smtp:Host"];
            if (string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning(
                    "ยังไม่ได้ตั้งค่า Smtp:Host ใน appsettings จึงข้ามการส่งอีเมลไปยัง {ToEmail}: {Subject}",
                    toEmail, subject);
                return;
            }

            try
            {
                var port = int.TryParse(_configuration["Smtp:Port"], out var parsedPort) ? parsedPort : 587;
                var username = _configuration["Smtp:Username"];
                var password = _configuration["Smtp:Password"];
                var fromEmail = _configuration["Smtp:FromEmail"] ?? username ?? "no-reply@udonthani.link";
                var fromName = _configuration["Smtp:FromName"] ?? "Udonthani.link";

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };

                using var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                message.To.Add(toEmail);

                await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ส่งอีเมลไปยัง {ToEmail} ไม่สำเร็จ", toEmail);
            }
        }
    }
}
