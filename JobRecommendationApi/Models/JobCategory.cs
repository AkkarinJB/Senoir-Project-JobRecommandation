using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public class JobCategory
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}
