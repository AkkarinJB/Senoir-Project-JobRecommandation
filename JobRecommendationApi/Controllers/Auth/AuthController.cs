using Microsoft.AspNetCore.Mvc;
using JobRecommendationApi.Data;
using JobRecommendationApi.DTOs;
using JobRecommendationApi.Models;
using JobRecommendationApi.Services;

namespace JobRecommendationApi.Controllers.Auth
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
    {
        private static readonly string[] AllowedRegistrationRoles = { "JobSeeker", "Employer" };

        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, IConfiguration configuration, ITokenService tokenService)
        {
            _context = context;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public IActionResult Register(UserRegisterDto request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var role = string.IsNullOrWhiteSpace(request.Role) ? "JobSeeker" : request.Role.Trim();
            if (!AllowedRegistrationRoles.Contains(role))
            {
                return BadRequest("สามารถสมัครได้เฉพาะบทบาท JobSeeker หรือ Employer เท่านั้น");
            }

            if (_context.Users.Any(u => u.Username == request.Username))
            {
                return BadRequest("ชื่อผู้ใช้นี้มีในระบบแล้ว");
            }

            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest("อีเมลนี้มีในระบบแล้ว");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = role
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "สมัครสมาชิกสำเร็จ", userId = newUser.Id, role = newUser.Role });
        }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDto request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);
            if (user == null)
            {
                return BadRequest("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
            }

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshTokenExpiryDays = _configuration.GetValue<int?>("Jwt:RefreshTokenExpiryDays") ?? 7;

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.Now.AddDays(refreshTokenExpiryDays)
            });
            _context.SaveChanges();

            return Ok(new { token = accessToken, refreshToken = refreshTokenValue, role = user.Role });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh(RefreshTokenRequestDto request)
        {
            var existing = _context.RefreshTokens.FirstOrDefault(r => r.Token == request.RefreshToken);
            if (existing == null || !existing.IsActive)
            {
                return Unauthorized("Refresh token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่");
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == existing.UserId);
            if (user == null) return Unauthorized();

            var newRefreshTokenValue = _tokenService.GenerateRefreshToken();
            existing.RevokedAt = DateTime.Now;
            existing.ReplacedByToken = newRefreshTokenValue;

            var refreshTokenExpiryDays = _configuration.GetValue<int?>("Jwt:RefreshTokenExpiryDays") ?? 7;
            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                Token = newRefreshTokenValue,
                ExpiresAt = DateTime.Now.AddDays(refreshTokenExpiryDays)
            });

            var newAccessToken = _tokenService.GenerateAccessToken(user);
            _context.SaveChanges();

            return Ok(new { token = newAccessToken, refreshToken = newRefreshTokenValue });
        }

        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPost("logout")]
        public IActionResult Logout(RefreshTokenRequestDto request)
        {
            var existing = _context.RefreshTokens.FirstOrDefault(r => r.Token == request.RefreshToken);
            if (existing != null && existing.RevokedAt == null)
            {
                existing.RevokedAt = DateTime.Now;
                _context.SaveChanges();
            }

            return Ok(new { message = "ออกจากระบบสำเร็จ" });
        }

        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpGet("test")]
        public IActionResult TestSecure()
        {
            var username = User.Identity?.Name;
            return Ok(new { message = $"ยินดีต้อนรับ {username}!" });
        }

    }

}
