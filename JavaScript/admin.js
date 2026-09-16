document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // DOM
  // =========================

  const main = document.getElementById("admin-main");

  const ordersLink = document.getElementById("orders-link");
  const inventoryLink = document.getElementById("inventory-link");
  const categoryLink = document.getElementById("category-link");
  const customersLink = document.getElementById("customers-link");

  if (!main) {
    console.error("Cannot find #admin-main");
    return;
  }

  // =========================
  // API
  // =========================

  const API = {
    categories: "/api/categories",
    products: "/api/products",
  };

  // =========================
  // Sidebar
  // =========================

  function setActiveLink(activeLink) {
    const links = [
      ordersLink,
      inventoryLink,
      categoryLink,
      customersLink,
    ];

    links.forEach((link) => {
      if (!link) return;

      link.classList.remove("bg-primary", "text-white");
      link.classList.add("text-gray-600");
    });

    if (activeLink) {
      activeLink.classList.remove("text-gray-600");
      activeLink.classList.add("bg-primary", "text-white");
    }
  }

  // =========================
  // ORDERS
  // =========================

  function renderOrders() {
    setActiveLink(ordersLink);

    main.innerHTML = `
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
              Admin
            </p>

            <h1 class="text-3xl font-bold uppercase">
              Order Management
            </h1>
          </div>
        </div>

        <div class="border border-gray-200 bg-white p-8">
          <p class="text-gray-500">
            Order management has not been connected yet.
          </p>
        </div>
      </div>
    `;
  }

  // =========================
  // CATEGORY MANAGEMENT
  // =========================

  function renderCategories() {
    setActiveLink(categoryLink);

    main.innerHTML = `
      <div class="p-8">

        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
              Management
            </p>

            <h1 class="text-3xl font-bold uppercase">
              Category Management
            </h1>
          </div>

          <button
            id="add-category-button"
            type="button"
            class="bg-primary text-white px-5 py-3 uppercase text-sm font-bold hover:opacity-90 transition"
          >
            + Add Category
          </button>
        </div>

        <div id="category-list">
          <p class="text-gray-500">
            Loading categories...
          </p>
        </div>

      </div>
    `;

    const addButton = document.getElementById("add-category-button");

    if (addButton) {
      addButton.addEventListener("click", renderAddCategory);
    }

    loadCategories();
  }

  async function loadCategories() {
    const container = document.getElementById("category-list");

    if (!container) return;

    try {
      const response = await fetch(API.categories);

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const categories = await response.json();

      if (!Array.isArray(categories) || categories.length === 0) {
        container.innerHTML = `
          <div class="border border-gray-200 bg-white p-8">
            <p class="text-gray-500">
              No categories found.
            </p>
          </div>
        `;

        return;
      }

      container.innerHTML = categories
        .map((category) => {
          return `
            <div
              class="bg-white border border-gray-200 p-6 flex items-center justify-between mb-4"
            >
              <div>
                <h3 class="text-lg font-bold uppercase">
                  ${escapeHTML(category.name)}
                </h3>

                <p class="text-xs text-gray-400 mt-2 font-mono">
                  ${category.createDate || ""}
                </p>
              </div>

              <button
                type="button"
                class="delete-category-button text-red-600 text-sm font-bold uppercase hover:underline"
                data-id="${category.id}"
              >
                Delete
              </button>
            </div>
          `;
        })
        .join("");

      const deleteButtons = document.querySelectorAll(
        ".delete-category-button"
      );

      deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.id;

          if (id) {
            deleteCategory(id);
          }
        });
      });
    } catch (error) {
      console.error(error);

      container.innerHTML = `
        <div class="border border-red-200 bg-red-50 p-6">
          <p class="text-red-600">
            Failed to load categories.
          </p>
        </div>
      `;
    }
  }

  // =========================
  // ADD CATEGORY
  // =========================

  function renderAddCategory() {
    main.innerHTML = `
      <div class="p-8">

        <div class="mb-8">
          <button
            id="back-category-button"
            type="button"
            class="text-sm text-gray-500 hover:text-black mb-4"
          >
            ← Back to Categories
          </button>

          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            Management
          </p>

          <h1 class="text-3xl font-bold uppercase">
            Add Category
          </h1>
        </div>

        <form
          id="category-form"
          class="bg-white border border-gray-200 p-8 max-w-xl"
        >

          <div class="mb-6">
            <label
              for="category-name"
              class="block text-sm font-bold uppercase mb-2"
            >
              Category Name
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              required
              class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter category name"
            />
          </div>

          <button
            type="submit"
            class="bg-primary text-white px-6 py-3 uppercase text-sm font-bold hover:opacity-90"
          >
            Create Category
          </button>

        </form>

      </div>
    `;

    const backButton = document.getElementById("back-category-button");
    const form = document.getElementById("category-form");

    if (backButton) {
      backButton.addEventListener("click", renderCategories);
    }

    if (form) {
      form.addEventListener("submit", handleCategorySubmit);
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const name = formData.get("name");

    if (!name || !name.trim()) {
      alert("Please enter a category name.");
      return;
    } 

    try {
      const response = await fetch(API.categories, {
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

      alert("Category created successfully.");

      renderCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to create category.");
    }
  }

  async function deleteCategory(id) {
    const confirmed = confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API.categories}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category.");
    }
  }

  // =========================
  // PRODUCT MANAGEMENT
  // =========================

  function renderProducts() {
    setActiveLink(inventoryLink);

    main.innerHTML = `
      <div class="p-8">

        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
              Management
            </p>

            <h1 class="text-3xl font-bold uppercase">
              Product Management
            </h1>
          </div>

          <button
            id="add-product-button"
            type="button"
            class="bg-primary text-white px-5 py-3 uppercase text-sm font-bold hover:opacity-90 transition"
          >
            + Add Product
          </button>
        </div>

        <div id="product-list">
          <p class="text-gray-500">
            Loading products...
          </p>
        </div>

      </div>
    `;

    const addButton = document.getElementById("add-product-button");

    if (addButton) {
      addButton.addEventListener("click", renderAddProduct);
    }

    loadProducts();
  }

  async function loadProducts() {
    const container = document.getElementById("product-list");

    if (!container) return;

    try {
      const response = await fetch(API.products);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const products = await response.json();

      if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = `
          <div class="border border-gray-200 bg-white p-8">
            <p class="text-gray-500">
              No products found.
            </p>
          </div>
        `;

        return;
      }

      container.innerHTML = products
        .map((product) => {
          return `
            <div
              class="bg-white border border-gray-200 p-5 mb-4 flex gap-6 items-center"
            >

              <div class="w-32 h-32 bg-gray-100 flex-shrink-0">
                ${
                  product.image_url
                    ? `
                      <img
                        src="${escapeHTML(product.image_url)}"
                        alt="${escapeHTML(product.name)}"
                        class="w-full h-full object-cover"
                      />
                    `
                    : `
                      <div class="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase">
                        No Image
                      </div>
                    `
                }
              </div>

              <div class="flex-1">

                <h3 class="text-lg font-bold uppercase">
                  ${escapeHTML(product.name)}
                </h3>

                <p class="text-primary font-bold mt-2">
                  ${product.price ?? "N/A"}
                </p>

                <p class="text-xs text-gray-400 mt-2">
                  ${product.createAt || ""}
                </p>

                ${
                  product.description
                    ? `
                      <p class="text-sm text-gray-500 mt-3">
                        ${escapeHTML(product.description)}
                      </p>
                    `
                    : ""
                }

              </div>

              <button
                type="button"
                class="delete-product-button text-red-600 text-sm font-bold uppercase hover:underline"
                data-id="${product.id}"
              >
                Delete
              </button>

            </div>
          `;
        })
        .join("");

      const deleteButtons = document.querySelectorAll(
        ".delete-product-button"
      );

      deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.id;

          if (id) {
            deleteProduct(id);
          }
        });
      });
    } catch (error) {
      console.error(error);

      container.innerHTML = `
        <div class="border border-red-200 bg-red-50 p-6">
          <p class="text-red-600">
            Failed to load products.
          </p>
        </div>
      `;
    }
  }

  // =========================
  // ADD PRODUCT
  // =========================

  function renderAddProduct() {
    main.innerHTML = `
      <div class="p-8">

        <div class="mb-8">

          <button
            id="back-product-button"
            type="button"
            class="text-sm text-gray-500 hover:text-black mb-4"
          >
            ← Back to Products
          </button>

          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            Management
          </p>

          <h1 class="text-3xl font-bold uppercase">
            Add Product
          </h1>

        </div>

        <form
          id="product-form"
          class="bg-white border border-gray-200 p-8 max-w-2xl"
          enctype="multipart/form-data"
        >

          <div class="mb-5">
            <label
              for="product-name"
              class="block text-sm font-bold uppercase mb-2"
            >
              Product Name
            </label>

            <input
              id="product-name"
              name="name"
              type="text"
              required
              class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div class="mb-5">
            <label
              for="product-price"
              class="block text-sm font-bold uppercase mb-2"
            >
              Price
            </label>

            <input
              id="product-price"
              name="price"
              type="number"
              min="0"
              required
              class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div class="mb-5">
            <label
              for="product-category"
              class="block text-sm font-bold uppercase mb-2"
            >
              Category
            </label>

            <select
              id="product-category"
              name="categoryId"
              required
              class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            >
              <option value="">
                Select category
              </option>
            </select>
          </div>

          <div class="mb-5">
            <label
              for="product-description"
              class="block text-sm font-bold uppercase mb-2"
            >
              Description
            </label>

            <textarea
              id="product-description"
              name="description"
              rows="5"
              class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            ></textarea>
          </div>

          <div class="mb-8">
            <label
              for="product-image"
              class="block text-sm font-bold uppercase mb-2"
            >
              Product Image
            </label>

            <input
              id="product-image"
              name="image"
              type="file"
              accept="image/*"
              class="w-full border border-gray-300 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            class="bg-primary text-white px-6 py-3 uppercase text-sm font-bold hover:opacity-90"
          >
            Create Product
          </button>

        </form>

      </div>
    `;

    const backButton = document.getElementById("back-product-button");
    const form = document.getElementById("product-form");

    if (backButton) {
      backButton.addEventListener("click", renderProducts);
    }

    if (form) {
      form.addEventListener("submit", handleProductSubmit);
    }

    loadCategoryOptions();
  }

  async function loadCategoryOptions() {
    const select = document.getElementById("product-category");

    if (!select) return;

    try {
      const response = await fetch(API.categories);

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const categories = await response.json();

      categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        select.appendChild(option);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleProductSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(API.products, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      alert("Product created successfully.");

      renderProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to create product.");
    }
  }

  async function deleteProduct(id) {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API.products}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  }

  // =========================
  // CUSTOMERS
  // =========================

  function renderCustomers() {
    setActiveLink(customersLink);

    main.innerHTML = `
      <div class="p-8">

        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            Management
          </p>

          <h1 class="text-3xl font-bold uppercase">
            Customer Management
          </h1>
        </div>

        <div class="border border-gray-200 bg-white p-8">
          <p class="text-gray-500">
            Customer management has not been connected yet.
          </p>
        </div>

      </div>
    `;
  }

  // =========================
  // EVENT LISTENERS
  // =========================

  if (ordersLink) {
    ordersLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderOrders();
    });
  }

  if (inventoryLink) {
    inventoryLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderProducts();
    });
  }

  if (categoryLink) {
    categoryLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderCategories();
    });
  }

  if (customersLink) {
    customersLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderCustomers();
    });
  }

  // =========================
  // HTML ESCAPE
  // =========================

  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================
  // DEFAULT PAGE
  // =========================

  renderOrders();
});