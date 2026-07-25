using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public class EmployerProfile
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(150)]
        public string CompanyName { get; set; } = string.Empty;

        public string? CompanyDescription { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? Website { get; set; }

        public bool IsVerified { get; set; } = false;

        public DateTime? VerifiedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
    }
}
