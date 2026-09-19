<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // DOM
  // =========================================================
=======
window.AdminDashboard = window.AdminDashboard || {};
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5

const admin = window.AdminDashboard;

admin.api = {
  baseURL: "http://localhost:3000",
  categories: "http://localhost:3000/api/categories",
  products: "http://localhost:3000/api/products",
};

admin.renderers = admin.renderers || {};
admin.helpers = admin.helpers || {};

admin.helpers.escapeHTML = function (value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

admin.helpers.requestJson = async function (url, options = {}) {
  const headers = new Headers(options.headers || {});
  const currentUser = window.FirebaseAuth?.auth.currentUser;

  if (currentUser) {
    headers.set("Authorization", `Bearer ${await currentUser.getIdToken()}`);
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorPayload = payload && typeof payload === "object" ? payload : { message: String(payload || "Request failed") };
    const message = errorPayload.message || errorPayload.error || JSON.stringify(errorPayload) || "Request failed";
    throw new Error(message);
  }

  return payload;
};

admin.requireAdmin = async function () {
  const firebaseAuth = window.FirebaseAuth;
  if (!firebaseAuth) {
    throw new Error("Firebase authentication is not available.");
  }

  const user = await new Promise((resolve) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      unsubscribe();
      resolve(currentUser);
    });
  });

  const profile = await firebaseAuth.getUserProfile(user);
  if (!profile || Number(profile.role) !== 2) {
    window.location.replace("LoginRegister.html");
    return false;
  }

  return true;
};

admin.setActiveLink = function (activeLink) {
  const refs = admin.refs || {};
  const links = [
    refs.ordersLink,
    refs.inventoryLink,
    refs.categoryLink,
    refs.customersLink,
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
};

admin.renderPage = function (pageName) {
  const render = admin.renderers[pageName];
  if (typeof render === "function") {
    render();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("admin-main");
  const ordersLink = document.getElementById("orders-link");
  const inventoryLink = document.getElementById("inventory-link");
  const categoryLink = document.getElementById("category-link");
  const customersLink = document.getElementById("customers-link");

  admin.refs = { main, ordersLink, inventoryLink, categoryLink, customersLink };

  if (!main) {
    console.error("admin.js: Cannot find #admin-main");
    return;
  }

<<<<<<< HEAD
  // =========================================================
  // API
  // =========================================================

  const API = {
    categories: "/api/categories",
    products: "/api/products",
  };

  // =========================================================
  // HELPER
  // =========================================================

  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(value) {
    if (!value) {
      return "N/A";
    }

    try {
      // Firestore Timestamp trả về object có seconds
      if (value.seconds) {
        return new Date(value.seconds * 1000).toLocaleString();
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleString();
    } catch (error) {
      return String(value);
    }
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === "") {
      return "N/A";
    }

    return Number(price).toLocaleString("en-US");
  }

  async function request(url, options = {}) {
    const response = await fetch(url, options);

    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || `Request failed: ${response.status}`,
      );
    }

    return data;
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  function setActiveLink(activeLink) {
    const links = [ordersLink, inventoryLink, categoryLink, customersLink];

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

  // =========================================================
  // ORDERS
  // =========================================================

  function renderOrders() {
    setActiveLink(ordersLink);

    main.innerHTML = `
      <div class="p-8">

        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            Admin
          </p>

          <h1 class="text-3xl font-bold uppercase">
            Order Management
          </h1>
        </div>

        <div class="border border-gray-200 bg-white p-8">
          <p class="text-gray-500">
            Order management has not been connected yet.
          </p>
        </div>

      </div>
    `;
  }

  // =========================================================
  // CATEGORY
  // =========================================================

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
            class="bg-primary text-white px-5 py-3 uppercase text-sm font-bold hover:opacity-90"
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

    document
      .getElementById("add-category-button")
      ?.addEventListener("click", renderAddCategory);

    loadCategories();
  }

  async function loadCategories() {
    const container = document.getElementById("category-list");

    if (!container) {
      return;
    }

    try {
      const categories = await request(API.categories);

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
              class="bg-white border border-gray-200 p-6 mb-4 flex items-center justify-between"
            >

              <div>
                <h3 class="text-lg font-bold uppercase">
                  ${escapeHTML(category.name)}
                </h3>

                <p class="text-xs text-gray-400 mt-2 font-mono">
                  Created:
                  ${formatDate(category.createDate)}
                </p>
              </div>

              <button
                type="button"
                class="delete-category-button text-red-600 text-sm font-bold uppercase hover:underline"
                data-id="${escapeHTML(category.id)}"
              >
                Delete
              </button>

            </div>
          `;
        })
        .join("");

      // Event delegation
      container.addEventListener("click", handleCategoryClick);
    } catch (error) {
      console.error("loadCategories:", error);

      container.innerHTML = `
        <div class="border border-red-200 bg-red-50 p-6">
          <p class="text-red-600">
            ${escapeHTML(error.message)}
          </p>
        </div>
      `;
    }
  }

  function handleCategoryClick(event) {
    const button = event.target.closest(".delete-category-button");

    if (!button) {
      return;
    }

    const id = button.dataset.id;

    if (id) {
      deleteCategory(id);
    }
  }

  // =========================================================
  // ADD CATEGORY
  // =========================================================

  function renderAddCategory() {
    setActiveLink(categoryLink);

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

    document
      .getElementById("back-category-button")
      ?.addEventListener("click", renderCategories);

    document
      .getElementById("category-form")
      ?.addEventListener("submit", handleCategorySubmit);
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const nameInput = form.elements.name;

    const name = nameInput.value.trim();

    if (!name) {
      alert("Please enter a category name.");
      return;
    }

    try {
      await request(API.categories, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
        }),
      });

      alert("Category created successfully.");

      renderCategories();
    } catch (error) {
      console.error("create category:", error);

      alert(`Failed to create category.\n${error.message}`);
    }
  }

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  async function deleteCategory(id) {
    const confirmed = confirm("Are you sure you want to delete this category?");

    if (!confirmed) {
      return;
    }

    try {
      await request(`${API.categories}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      alert("Category deleted successfully.");

      loadCategories();
    } catch (error) {
      console.error("delete category:", error);

      alert(`Failed to delete category.\n${error.message}`);
    }
  }

  // =========================================================
  // PRODUCT
  // =========================================================

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
            class="bg-primary text-white px-5 py-3 uppercase text-sm font-bold hover:opacity-90"
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

    document
      .getElementById("add-product-button")
      ?.addEventListener("click", renderAddProduct);

    loadProducts();
  }

  async function loadProducts() {
    const container = document.getElementById("product-list");

    if (!container) {
      return;
    }

    try {
      const products = await request(API.products);

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
          const image = product.image_url
            ? `
              <img
                src="${escapeHTML(product.image_url)}"
                alt="${escapeHTML(product.name)}"
                class="w-full h-full object-cover"
              >
            `
            : `
              <div class="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase">
                No Image
              </div>
            `;

          return `
            <div
              class="bg-white border border-gray-200 p-5 mb-4 flex gap-6 items-center"
            >

              <div class="w-32 h-32 bg-gray-100 flex-shrink-0">
                ${image}
              </div>

              <div class="flex-1">

                <h3 class="text-lg font-bold uppercase">
                  ${escapeHTML(product.name)}
                </h3>

                <p class="text-primary font-bold mt-2">
                  ${formatPrice(product.price)}
                </p>

                <p class="text-xs text-gray-400 mt-2">
                  Created:
                  ${formatDate(product.createAt)}
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
                data-id="${escapeHTML(product.id)}"
              >
                Delete
              </button>

            </div>
          `;
        })
        .join("");

      container.addEventListener("click", handleProductClick);
    } catch (error) {
      console.error("loadProducts:", error);

      container.innerHTML = `
        <div class="border border-red-200 bg-red-50 p-6">
          <p class="text-red-600">
            ${escapeHTML(error.message)}
          </p>
        </div>
      `;
    }
  }

  function handleProductClick(event) {
    const button = event.target.closest(".delete-product-button");

    if (!button) {
      return;
    }

    const id = button.dataset.id;

    if (id) {
      deleteProduct(id);
    }
  }

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  function renderAddProduct() {
    setActiveLink(inventoryLink);

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

    document
      .getElementById("back-product-button")
      ?.addEventListener("click", renderProducts);

    document
      .getElementById("product-form")
      ?.addEventListener("submit", handleProductSubmit);

    loadCategoryOptions();
  }

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================

  async function loadCategoryOptions() {
    const select = document.getElementById("product-category");

    if (!select) {
      return;
    }

    try {
      const categories = await request(API.categories);

      if (!Array.isArray(categories)) {
        return;
      }

      categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        select.appendChild(option);
      });
    } catch (error) {
      console.error("loadCategoryOptions:", error);

      select.innerHTML = `
        <option value="">
          Failed to load categories
        </option>
      `;
    }
  }

  // =========================================================
  // CREATE PRODUCT
  // =========================================================

  async function handleProductSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim();

    const price = formData.get("price");

    const categoryId = formData.get("categoryId");

    if (!name) {
      alert("Please enter product name.");
      return;
    }

    if (price === null || price === "" || Number(price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    try {
      await request(API.products, {
        method: "POST",
        body: formData,
      });

      alert("Product created successfully.");

      renderProducts();
    } catch (error) {
      console.error("create product:", error);

      alert(`Failed to create product.\n${error.message}`);
    }
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function deleteProduct(id) {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      await request(`${API.products}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      alert("Product deleted successfully.");

      loadProducts();
    } catch (error) {
      console.error("delete product:", error);

      alert(`Failed to delete product.\n${error.message}`);
    }
  }

  // =========================================================
  // CUSTOMERS
  // =========================================================

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

  // =========================================================
  // SIDEBAR EVENTS
  // =========================================================
  if (!(await admin.requireAdmin())) return;


  if (ordersLink) {
    ordersLink.addEventListener("click", (event) => {
      event.preventDefault();
      admin.renderPage("orders");
    });
  }

  if (inventoryLink) {
    inventoryLink.addEventListener("click", (event) => {
      event.preventDefault();
      admin.renderPage("products");
    });
  }

  if (categoryLink) {
    categoryLink.addEventListener("click", (event) => {
      event.preventDefault();
      admin.renderPage("categories");
    });
  }

  if (customersLink) {
    customersLink.addEventListener("click", (event) => {
      event.preventDefault();
      admin.renderPage("customers");
    });
  }

 HEAD
  // =========================================================
  // DEFAULT
  // =========================================================

  renderOrders();
});

  if (typeof admin.renderers.orders === "function") {
    admin.renderPage("orders");
  }
});
