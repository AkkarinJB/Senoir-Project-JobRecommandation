namespace JobRecommendationApi.Services
{
    public interface INotificationService
    {
        // บันทึกการแจ้งเตือนลงฐานข้อมูล + ส่งอีเมลควบคู่กัน (ถ้ามีอีเมล)
        Task NotifyAsync(int userId, string? toEmail, string type, string message, string emailSubject);
    }
}
