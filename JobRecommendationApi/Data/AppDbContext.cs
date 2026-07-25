using Microsoft.EntityFrameworkCore;
using JobRecommendationApi.Models;

namespace JobRecommendationApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<JobPost> JobPosts { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<EmployerProfile> EmployerProfiles { get; set; }
        public DbSet<JobCategory> JobCategories { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<CandidateProfile>()
                .HasIndex(p => p.UserId).IsUnique();
            modelBuilder.Entity<EmployerProfile>()
                .HasIndex(p => p.UserId).IsUnique();

            modelBuilder.Entity<JobApplication>()
                .HasIndex(a => new { a.JobPostId, a.CandidateProfileId }).IsUnique();

            modelBuilder.Entity<CandidateProfile>()
                .Property(p => p.ExpectedSalary).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<JobPost>()
                .Property(p => p.OfferedSalary).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<JobPost>()
                .Property(p => p.IsActive).HasDefaultValue(true);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(r => r.Token).IsUnique();

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.UserId);
        }
    }
}
