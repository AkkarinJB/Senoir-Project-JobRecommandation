using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
    // Master data endpoint สำหรับ "ทักษะ" — ผู้ใช้ทุก role ที่ login แล้วเรียกดู/เพิ่มรายการใหม่ได้ทันที
    // ไม่มีขั้นตอนอนุมัติจาก Admin ตามที่ตกลงกันไว้ (กันซ้ำด้วยการเช็คชื่อแบบ case-insensitive ก่อนสร้าง)
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SkillController : BaseApiController
    {
        public SkillController(AppDbContext context) : base(context)
        {
        }

        // GET /api/Skill?search=rea  -> ใช้ทำ autocomplete ตอนพิมพ์ในช่อง chip picker
        [HttpGet]
        public IActionResult GetSkills([FromQuery] string? search)
        {
            var query = _context.Skills.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(s => s.Name.ToLower().Contains(term));
            }

            var skills = query
                .OrderBy(s => s.Name)
                .Select(s => new SkillDto { Id = s.Id, Name = s.Name })
                .ToList();

            return Ok(skills);
        }

        // POST /api/Skill -> "get or create": ถ้ามีชื่อนี้อยู่แล้ว (ไม่สนตัวพิมพ์เล็ก/ใหญ่) คืนตัวเดิม ไม่สร้างซ้ำ
        [HttpPost]
        public IActionResult CreateSkill(CreateSkillDto request)
        {
            var name = request.Name?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("กรุณาระบุชื่อทักษะ");
            }

            var existing = _context.Skills.FirstOrDefault(s => s.Name.ToLower() == name.ToLower());
            if (existing != null)
            {
                return Ok(new SkillDto { Id = existing.Id, Name = existing.Name });
            }

            var skill = new Skill { Name = name };
            _context.Skills.Add(skill);
            _context.SaveChanges();

            return Ok(new SkillDto { Id = skill.Id, Name = skill.Name });
        }
    }
}
