using System.ComponentModel.DataAnnotations;

namespace Mission12_Foote.Models;

/// <summary>
/// Represents a single book in the bookstore. Schema matches
/// the provided SQLite database exactly.
/// </summary>
public class Book
{
    [Key]
    public int BookID { get; set; }

    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string Author { get; set; } = string.Empty;
    [Required] public string Publisher { get; set; } = string.Empty;
    [Required] public string ISBN { get; set; } = string.Empty;
    [Required] public string Classification { get; set; } = string.Empty;
    [Required] public string Category { get; set; } = string.Empty;
    [Required] public int PageCount { get; set; }
    [Required] public decimal Price { get; set; }
}
