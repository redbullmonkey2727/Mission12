using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission12_Foote.Data;
using Mission12_Foote.Models;

namespace Mission12_Foote.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreDbContext _context;

    public BooksController(BookstoreDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns a paginated, optionally-filtered list of books along
    /// with a total count so the frontend can render pagination.
    /// </summary>
    /// <param name="pageSize">Books per page (default 5).</param>
    /// <param name="pageNum">Page number, 1-indexed (default 1).</param>
    /// <param name="sortBy">Currently supports "title".</param>
    /// <param name="sortDir">"asc" (default) or "desc".</param>
    /// <param name="categories">
    /// Zero or more categories to filter by. Uses the [FromQuery] binder so
    /// the client can send repeated ?categories=X&categories=Y params.
    /// </param>
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int pageSize = 5,
        int pageNum = 1,
        string? sortBy = null,
        string? sortDir = "asc",
        [FromQuery] List<string>? categories = null)
    {
        if (pageSize < 1) pageSize = 5;
        if (pageNum < 1) pageNum = 1;

        IQueryable<Book> query = _context.Books;

        // Category filter — only applied when at least one category is selected
        if (categories is { Count: > 0 })
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        // Sort
        if (!string.IsNullOrWhiteSpace(sortBy) &&
            sortBy.Equals("title", StringComparison.OrdinalIgnoreCase))
        {
            query = sortDir?.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);
        }
        else
        {
            query = query.OrderBy(b => b.BookID);
        }

        var totalBooks = await query.CountAsync();

        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { books, totalBooks });
    }

    /// <summary>
    /// Returns the distinct list of categories present in the database,
    /// for populating the category filter sidebar.
    /// </summary>
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }
}
