using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobRecommendationApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateForeignKeyCategoryId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "JobPosts",
                keyColumn: "CategoryId",
                keyValue: null,
                column: "CategoryId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "CategoryId",
                table: "JobPosts",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "JobPosts",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
