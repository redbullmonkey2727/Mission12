using Microsoft.EntityFrameworkCore;
using Mission12_Foote.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// EF Core + SQLite
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// CORS so the Vite dev server (port 5173) can call the API
const string CorsPolicyName = "AllowReactDevServer";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(CorsPolicyName);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
