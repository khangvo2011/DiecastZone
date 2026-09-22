const API = "/api/products";

const CART_KEY = "diecastzone_cart";
const WISHLIST_KEY = "diecastzone_wishlist";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const titleElement = document.getElementById("product-title");
const brandElement = document.getElementById("product-brand");
const priceElement = document.getElementById("product-price");
const descriptionElement = document.getElementById("product-description");
const stockElement = document.getElementById("product-stock");

const mainImage = document.getElementById("main-product-image");

const addToCartButton = document.getElementById("add-to-cart");
const wishlistButton = document.getElementById("add-to-wishlist");

const scaleElement = document.getElementById("product-scale");
const manufacturerElement = document.getElementById("product-manufacturer");
const materialElement = document.getElementById("product-material");
const dimensionsElement = document.getElementById("product-dimensions");
const featuresElement = document.getElementById("product-features");

let currentProduct = null;

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price) || 0);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

async function loadProduct() {
  if (!productId) {
    titleElement.textContent = "Product not found";
    return;
  }

  try {
    const response = await fetch(`${API}/${productId}`);

    if (!response.ok) {
      throw new Error("Failed to load product");
    }

    const product = await response.json();

    currentProduct = product;

    renderProduct(product);
  } catch (error) {
    console.error(error);
    titleElement.textContent = "Failed to load product";
  }
}

function renderProduct(product) {
  titleElement.textContent = product.name || "Unnamed Product";

  brandElement.textContent = product.brand || "Diecast Zone";

  priceElement.textContent = formatPrice(product.price);

  descriptionElement.textContent =
    product.description || "No description available.";

  stockElement.textContent = product.stock > 0 ? "In Stock" : "Out of Stock";

  if (product.image_url) {
    mainImage.src = product.image_url;
  }

  if (scaleElement) {
    scaleElement.textContent = product.scale || "-";
  }

  if (manufacturerElement) {
    manufacturerElement.textContent =
      product.manufacturer || product.brand || "-";
  }

  if (materialElement) {
    materialElement.textContent = product.material || "-";
  }

  if (dimensionsElement) {
    dimensionsElement.textContent = product.dimensions || "-";
  }

  if (featuresElement) {
    featuresElement.textContent = product.features || "-";
  }
}

function addToCart() {
  if (!currentProduct) {
    return;
  }

  const cart = getCart();

  const existingProduct = cart.find((item) => item.id === currentProduct.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: currentProduct.id,
      title: currentProduct.name,
      price: Number(currentProduct.price) || 0,
      image: currentProduct.image_url || "",
      quantity: 1,
    });
  }

  saveCart(cart);

  addToCartButton.textContent = "Added to Cart";

  setTimeout(() => {
    addToCartButton.innerHTML = `
            <span class="material-symbols-outlined">
                shopping_cart
            </span>
            Add to Collection
        `;
  }, 1200);
}

function addToWishlist() {
  if (!currentProduct) {
    return;
  }

  const wishlist = getWishlist();

  const exists = wishlist.some((item) => item.id === currentProduct.id);

  if (!exists) {
    wishlist.push({
      id: currentProduct.id,
      title: currentProduct.name,
      price: Number(currentProduct.price) || 0,
      image: currentProduct.image_url || "",
    });

    saveWishlist(wishlist);
  }

  wishlistButton.textContent = "Saved to Wishlist";

  setTimeout(() => {
    wishlistButton.textContent = "Save to Wishlist";
  }, 1200);
}

function setupThumbnails() {
  const thumbnails = document.querySelectorAll(".product-thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = thumbnail.src;
    });
  });
}

if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCart);
}

if (wishlistButton) {
  wishlistButton.addEventListener("click", addToWishlist);
}

setupThumbnails();
loadProduct();
