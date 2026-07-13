using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public class CandidateProfile
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Skills { get; set; } = string.Empty;

        public decimal ExpectedSalary { get; set; }

        public int ExperienceYears { get; set; }

        // พื้นที่ที่ต้องการทำงาน ใช้เป็นปัจจัยหนึ่งใน Weighted Scoring Model (เทียบกับ JobPost.Location)
        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}