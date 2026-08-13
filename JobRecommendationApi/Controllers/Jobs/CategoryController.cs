using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
    // Master data endpoint สำหรับ "หมวดหมู่งาน/ตำแหน่งงาน" ที่ผู้ใช้ทั่วไปเรียกดู/เพิ่มรายการใหม่ได้เอง
    // แยกจาก Controllers/Admin/AdminController.cs ซึ่งยังคุม แก้ไข/ลบ หมวดหมู่แบบ Admin-only ไว้เหมือนเดิม
    // (หน้า admin-categories ฝั่ง frontend ยังใช้ api/Admin/categories ตามเดิมสำหรับตาราง manage เต็มรูปแบบ)
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseApiController
    {
        public CategoryController(AppDbContext context) : base(context)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetCategories()
        {
            var categories = _context.JobCategories
                .OrderBy(c => c.Name)
                .Select(c => new { c.Id, c.Name })
                .ToList();

            return Ok(categories);
        }

        // "get or create" — ผู้ใช้ที่ login แล้วทุก role เพิ่มหมวดหมู่ใหม่ได้ทันทีถ้ายังไม่มีในระบบ
        [HttpPost]
        [Authorize]
        public IActionResult CreateCategory(JobCategoryDto request)
        {
            var name = request.Name?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("กรุณาระบุชื่อหมวดหมู่");
            }

            var existing = _context.JobCategories.FirstOrDefault(c => c.Name.ToLower() == name.ToLower());
            if (existing != null)
            {
                return Ok(new { existing.Id, existing.Name });
            }

            var category = new JobCategory { Name = name };
            _context.JobCategories.Add(category);
            _context.SaveChanges();

            return Ok(new { category.Id, category.Name });
        }
    }
}
