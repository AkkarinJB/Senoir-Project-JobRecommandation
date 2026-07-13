using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using JobRecommendationApi.Data;
using JobRecommendationApi.Services;
using JobRecommendationApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddScoped<IMatchingService, MatchingService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddEndpointsApiExplorer();

// CORS: Angular SPA อยู่คนละ origin กับ API จำเป็นต้องเปิดไว้ ไม่งั้น browser จะบล็อกทุก request
// รายชื่อ origin ที่อนุญาตกำหนดผ่าน appsettings เพื่อแยกค่าระหว่าง dev/prod ได้
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:4200" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen( c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo{ Title = "Job Recommendation API", Version = "v1", });
   c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value!);
builder.Services.AddAuthentication( x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer( x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, 
        ValidateAudience = false
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// สร้างบัญชี Admin เริ่มต้นถ้ายังไม่มีในระบบ (ต้องรัน migration ให้ตารางถูกสร้างก่อน)
// ค่าเริ่มต้นอ่านจาก AdminSeed ใน appsettings — ควรเปลี่ยนรหัสผ่านทันทีหลัง deploy จริง
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        var adminUsername = builder.Configuration["AdminSeed:Username"] ?? "admin";
        var adminEmail = builder.Configuration["AdminSeed:Email"] ?? "admin@udonthani.link";
        var adminPassword = builder.Configuration["AdminSeed:Password"] ?? "ChangeMe123!";

        db.Users.Add(new User
        {
            Username = adminUsername,
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = "Admin"
        });
        db.SaveChanges();
    }
}

app.Run();