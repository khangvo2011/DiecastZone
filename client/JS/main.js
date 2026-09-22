document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const sortSelect = document.getElementById("sort");
  const categoryButtons = document.querySelectorAll(".category-filter");

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
              src="${escapeHTML(imageUrl)}"
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
                  data-product-id="${product._id || product.id || ""}"
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

  const filterProducts = (products, categoryId, sort) => {
    let filteredProducts = [...products];

    if (categoryId !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        const productCategoryId =
          typeof product.categoryId === "object"
            ? product.categoryId?._id || product.categoryId?.id
            : product.categoryId;

        return String(productCategoryId) === String(categoryId);
      });
    }

    switch (sort) {
      case "newest":
        filteredProducts.sort((a, b) => {
          return new Date(b.createAt) - new Date(a.createAt);
        });
        break;

      case "price-asc":
        filteredProducts.sort((a, b) => {
          return Number(a.price) - Number(b.price);
        });
        break;

      case "price-desc":
        filteredProducts.sort((a, b) => {
          return Number(b.price) - Number(a.price);
        });
        break;
    }

    return filteredProducts;
  };

  let allProducts = [];
  let allCategories = [];

  const updateProducts = () => {
    const activeButton = document.querySelector(".category-filter.bg-primary");

    const selectedCategory = activeButton?.dataset.category || "all";

    const selectedSort = sortSelect ? sortSelect.value : "newest";

    const filteredProducts = filterProducts(
      allProducts,
      selectedCategory,
      selectedSort,
    );

    renderProducts(filteredProducts);
  };

  const setupCategoryButtons = () => {
    categoryButtons.forEach((button) => {
      const categoryName = button.dataset.category;

      if (categoryName === "all") {
        button.dataset.category = "all";
        return;
      }

      const category = allCategories.find(
        (item) => item.name.toLowerCase() === categoryName.toLowerCase(),
      );

      if (category) {
        button.dataset.category = category.id || category._id;
      }
    });
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-primary",
          "text-surface-white",
          "border-primary",
        );

        btn.classList.add(
          "bg-surface-white",
          "text-ink-black",
          "border-ink-black",
        );
      });

      button.classList.remove(
        "bg-surface-white",
        "text-ink-black",
        "border-ink-black",
      );

      button.classList.add(
        "bg-primary",
        "text-surface-white",
        "border-primary",
      );

      updateProducts();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      updateProducts();
    });
  }

  const loadProducts = async () => {
    renderLoading();

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("http://localhost:3000/api/products"),
        fetch("http://localhost:3000/api/categories"),
      ]);

      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.status}`);
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          `Failed to fetch categories: ${categoriesResponse.status}`,
        );
      }

      allProducts = await productsResponse.json();
      allCategories = await categoriesResponse.json();

      setupCategoryButtons();
      updateProducts();
    } catch (error) {
      console.error("Product loading error:", error);

      renderError();
    }
  };

  loadProducts();
});
