using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Controllers.Jobs
{
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

            string newRowKey = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            
            var category = new JobCategory { 
                Id = newRowKey,
                Name = name 
                };
            _context.JobCategories.Add(category);
            _context.SaveChanges();

            return Ok(new { category.Id, category.Name });
        }
    }
}
