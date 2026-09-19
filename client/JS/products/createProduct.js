const API_PRODUCTS = "/api/products";

export async function createProduct(formData) {
  const response = await fetch(API_PRODUCTS, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return await response.json();
}
