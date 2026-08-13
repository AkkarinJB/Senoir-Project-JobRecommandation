using Microsoft.AspNetCore.Mvc;
using JobRecommendationApi.Data;
using JobRecommendationApi.Models;

namespace JobRecommendationApi.Controllers
{
    // Controller กลางให้ controller อื่นที่ต้อง [Authorize] สืบทอด
    // เกือบทุก action ที่ผ่านมาต้องหา "ผู้ใช้ที่กำลัง login อยู่" จาก username ใน JWT ก่อนเสมอ
    // (var username = User.Identity?.Name; var user = _context.Users.FirstOrDefault(...); if (user == null) ...)
    // ซึ่งซ้ำกันเกือบ 20 จุดทั่วโปรเจค — ย้ายมารวมไว้ที่เดียวตรงนี้ ลูก controller เรียก GetCurrentUser() แทนได้เลย
    public abstract class BaseApiController : ControllerBase
    {
        protected readonly AppDbContext _context;

        protected BaseApiController(AppDbContext context)
        {
            _context = context;
        }

        // คืนค่า user ปัจจุบันจาก username ใน token; null ถ้าไม่มี claim หรือหาไม่เจอในฐานข้อมูล
        // (เผื่อกรณี token ยังไม่หมดอายุแต่บัญชีถูกลบไปแล้ว)
        protected User? GetCurrentUser()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            return _context.Users.FirstOrDefault(u => u.Username == username);
        }
    }
}
