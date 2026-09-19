document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (!productGrid) return;

  const escapeHTML = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const renderLoading = () => {
    productGrid.innerHTML = `
      <div class="empty-state md:col-span-2 xl:col-span-4">
        Loading products...
      </div>
    `;
  };

  const renderEmpty = () => {
    productGrid.innerHTML = `
      <div class="empty-state md:col-span-2 xl:col-span-4">
        No products available right now.
      </div>
    `;
  };

  const renderError = () => {
    productGrid.innerHTML = `
      <div class="empty-state md:col-span-2 xl:col-span-4">
        Unable to load products.
      </div>
    `;
  };

  const renderProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      renderEmpty();
      return;
    }

    productGrid.innerHTML = products
      .slice(0, 8)
      .map((product) => {
        const imageUrl =
          product.image_url ||
          product.imageUrl ||
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

        const name = escapeHTML(product.name || "Untitled product");

        const description = escapeHTML(
          product.description || "Collector-grade diecast model",
        );

        return `
          <article class="product-card">
            <img
              class="product-card__image"
              src="${imageUrl}"
              alt="${name}"
              loading="lazy"
            />

            <div class="product-card__content">
              <span class="product-card__tag">
                Featured
              </span>

              <h4 class="product-card__title">
                ${name}
              </h4>

              <p class="mt-2 line-clamp-2 text-sm text-slate-600">
                ${description}
              </p>

              <div class="product-card__meta">
                <span class="product-card__price">
                  ${formatPrice(product.price)}
                </span>

                <button
                  class="product-card__button"
                  type="button"
                  data-product-id="${product._id || ""}"
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const loadProducts = async () => {
    renderLoading();

    try {
      const response = await fetch("http://localhost:3000/api/products");

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const products = await response.json();

      renderProducts(products);
    } catch (error) {
      console.error("Product loading error:", error);
      renderError();
    }
  };

  loadProducts();
});
