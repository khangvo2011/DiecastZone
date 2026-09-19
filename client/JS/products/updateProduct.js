const API_PRODUCTS = "/api/products";

export async function updateProduct(id, formData) {
  const response = await fetch(`${API_PRODUCTS}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return await response.json();
}