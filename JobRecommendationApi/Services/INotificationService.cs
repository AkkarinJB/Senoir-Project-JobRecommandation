namespace JobRecommendationApi.Services
{
    public interface INotificationService
    {
        Task NotifyAsync(int userId, string? toEmail, string type, string message, string emailSubject);
    }
}
