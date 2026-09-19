const API_CATEGORIES = "/api/categories";

export async function deleteCategory(id) {
  const response = await fetch(`${API_CATEGORIES}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return await response.json();
}