using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public static class NotificationType
    {
        public const string NewApplication = "NewApplication";
        public const string ApplicationStatusChanged = "ApplicationStatusChanged";
        public const string EmployerVerified = "EmployerVerified";
    }

    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
