using Microsoft.EntityFrameworkCore;
using Mission12_Foote.Models;

namespace Mission12_Foote.Data;

/// <summary>
/// EF Core context for the bookstore database.
/// The underlying SQLite file is pre-populated and ships with the app.
/// </summary>
public class BookstoreDbContext : DbContext
{
    public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options)
    {
    }

    public DbSet<Book> Books { get; set; } = null!;
}
