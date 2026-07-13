using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobRecommendationApi.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? RevokedAt { get; set; }

        // เก็บ token ใหม่ที่แทนที่ตัวนี้ไว้ เผื่อใช้ตรวจจับการนำ refresh token เก่ากลับมาใช้ซ้ำ (token reuse / replay attack)
        [MaxLength(200)]
        public string? ReplacedByToken { get; set; }

        [NotMapped]
        public bool IsActive => RevokedAt == null && DateTime.Now < ExpiresAt;
    }
}
