const API_PRODUCTS = "/api/products";

export async function getProducts() {
  const response = await fetch(API_PRODUCTS);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return await response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_PRODUCTS}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return await response.json();
}