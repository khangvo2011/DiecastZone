const API_CATEGORIES = "/api/categories";

export async function getCategories() {
  const response = await fetch(API_CATEGORIES);

  if (!response.ok) {
    throw new Error("Failed to load categories");
  }

  return await response.json();
}

export async function getCategory(id) {
  const response = await fetch(`${API_CATEGORIES}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load category");
  }

  return await response.json();
}