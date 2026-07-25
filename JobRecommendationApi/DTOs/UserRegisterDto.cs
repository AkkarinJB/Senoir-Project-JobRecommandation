using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.DTOs
{
    public class UserRegisterDto
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "JobSeeker";
    }
}
