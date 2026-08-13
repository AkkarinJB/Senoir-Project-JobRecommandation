using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public class JobPost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        public ICollection<Skill> RequiredSkills { get; set; } = new List<Skill>();

        public decimal OfferedSalary { get; set; }

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;
        public int EmployerId { get; set; }

        public int? CategoryId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}