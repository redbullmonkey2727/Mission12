import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5280/api';

interface CategoryFilterProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

/**
 * Sidebar checkbox list of categories. Fetches the distinct list of
 * categories from the API once on mount.
 */
function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/Books/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: string[] = await res.json();
        setCategories(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load categories: ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggle = (category: string) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Filter by Category</h5>

        {loading && <p className="text-muted small mb-0">Loading...</p>}
        {error && <p className="text-danger small mb-0">{error}</p>}

        {!loading && !error && (
          <>
            {categories.map((category) => {
              const id = `cat-${category.replace(/\s+/g, '-')}`;
              return (
                <div className="form-check" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={id}
                    checked={selected.includes(category)}
                    onChange={() => toggle(category)}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {category}
                  </label>
                </div>
              );
            })}

            {selected.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mt-3 w-100"
                onClick={() => onChange([])}
              >
                Clear filters
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
