const API_CATEGORIES = "/api/categories";

export async function updateCategory(id, name) {
  const response = await fetch(`${API_CATEGORIES}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  return await response.json();
}