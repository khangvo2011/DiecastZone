const API_CATEGORIES = "/api/categories";

export async function createCategory(name) {
  const response = await fetch(API_CATEGORIES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return await response.json();
}   