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

            // กันชื่อผู้ใช้/อีเมลซ้ำที่ระดับฐานข้อมูล ไม่ใช่แค่ตรวจในโค้ดฝั่งเดียว
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();

            // ผู้ใช้ 1 คนมีได้ 1 โปรไฟล์ผู้หางาน / 1 โปรไฟล์บริษัทเท่านั้น
            modelBuilder.Entity<CandidateProfile>()
                .HasIndex(p => p.UserId).IsUnique();
            modelBuilder.Entity<EmployerProfile>()
                .HasIndex(p => p.UserId).IsUnique();

            // ป้องกันการสมัครงานเดียวกันซ้ำหลายครั้งที่ระดับฐานข้อมูล
            modelBuilder.Entity<JobApplication>()
                .HasIndex(a => new { a.JobPostId, a.CandidateProfileId }).IsUnique();

            // กำหนด precision ของ decimal ชัดเจน ป้องกัน EF Core silently truncate ทศนิยม
            modelBuilder.Entity<CandidateProfile>()
                .Property(p => p.ExpectedSalary).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<JobPost>()
                .Property(p => p.OfferedSalary).HasColumnType("decimal(18,2)");

            // สำคัญ: ต้องกำหนด default ที่ระดับคอลัมน์ด้วย ไม่งั้น EF Core migration จะใช้ CLR default (false)
            // สำหรับแถวเดิมที่มีอยู่แล้วตอนรัน AddColumn ซึ่งจะทำให้ประกาศงานเก่าทั้งหมดหายไปจาก GetAllJobs (เพราะถูก filter ด้วย IsActive)
            modelBuilder.Entity<JobPost>()
                .Property(p => p.IsActive).HasDefaultValue(true);

            // ค้นหา refresh token ตอน validate/rotate บ่อยมาก และต้องไม่ซ้ำกัน
            modelBuilder.Entity<RefreshToken>()
                .HasIndex(r => r.Token).IsUnique();

            // ใช้กรองรายการแจ้งเตือนของผู้ใช้แต่ละคนบ่อย
            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.UserId);
        }
    }
}
