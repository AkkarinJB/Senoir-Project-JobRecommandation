using System.ComponentModel.DataAnnotations;

namespace JobRecommendationApi.Models
{
    public static class JobApplicationStatus
    {
        public const string Applied = "Applied";
        public const string Reviewed = "Reviewed";
        public const string Accepted = "Accepted";
        public const string Rejected = "Rejected";

        public static readonly string[] All = { Applied, Reviewed, Accepted, Rejected };
    }

    public class JobApplication
    {
        [Key]
        public int Id { get; set; }

        public int JobPostId { get; set; }

        public int CandidateProfileId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = JobApplicationStatus.Applied;

        public DateTime AppliedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
    }
}
