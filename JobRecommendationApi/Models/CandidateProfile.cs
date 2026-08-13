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

        public ICollection<Skill> Skills { get; set; } = new List<Skill>();

        public decimal ExpectedSalary { get; set; }

        public int ExperienceYears { get; set; }

        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}