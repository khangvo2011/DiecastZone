window.AdminDashboard = window.AdminDashboard || {};

const adminProduct = window.AdminDashboard;

adminProduct.renderers = adminProduct.renderers || {};

adminProduct.renderers.products = function () {
  const refs = adminProduct.refs || {};
  const main = refs.main;
  const inventoryLink = refs.inventoryLink;

  if (!main) return;

  adminProduct.setActiveLink(inventoryLink);
  main.innerHTML = `
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Management</p>
          <h1 class="text-3xl font-bold uppercase">Product Management</h1>
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
        <p class="text-gray-500">Loading products...</p>
      </div>
    </div>
  `;

  const addButton = document.getElementById("add-product-button");
  if (addButton) {
    addButton.addEventListener("click", adminProduct.renderers.addProduct);
  }

  adminProduct.loadProducts();
};

adminProduct.loadProducts = async function () {
  const container = document.getElementById("product-list");
  if (!container) return;

  try {
    const products = await adminProduct.helpers.requestJson(adminProduct.api.products);

    if (!Array.isArray(products) || products.length === 0) {
      container.innerHTML = `
        <div class="border border-gray-200 bg-white p-8">
          <p class="text-gray-500">No products found.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
          <div class="bg-white border border-gray-200 p-5 mb-4 flex gap-6 items-center">
            <div class="w-32 h-32 bg-gray-100 flex-shrink-0">
              ${
                product.image_url
                  ? `<img src="${adminProduct.helpers.escapeHTML(product.image_url)}" alt="${adminProduct.helpers.escapeHTML(product.name)}" class="w-full h-full object-cover" />`
                  : `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase">No Image</div>`
              }
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-bold uppercase">${adminProduct.helpers.escapeHTML(product.name)}</h3>
              <p class="text-primary font-bold mt-2">${product.price ?? "N/A"}</p>
              <p class="text-xs text-gray-400 mt-2">${product.createAt || ""}</p>
              ${
                product.description
                  ? `<p class="text-sm text-gray-500 mt-3">${adminProduct.helpers.escapeHTML(product.description)}</p>`
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
        `
      )
      .join("");

    document.querySelectorAll(".delete-product-button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        if (id) adminProduct.deleteProduct(id);
      });
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="border border-red-200 bg-red-50 p-6">
        <p class="text-red-600">Failed to load products.</p>
      </div>
    `;
  }
};

adminProduct.renderers.addProduct = function () {
  const refs = adminProduct.refs || {};
  const main = refs.main;

  if (!main) return;

  main.innerHTML = `
    <div class="p-8">
      <div class="mb-8">
        <button id="back-product-button" type="button" class="text-sm text-gray-500 hover:text-black mb-4">
          ← Back to Products
        </button>

        <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Management</p>
        <h1 class="text-3xl font-bold uppercase">Add Product</h1>
      </div>

      <form id="product-form" class="bg-white border border-gray-200 p-8 max-w-2xl" enctype="multipart/form-data">
        <div class="mb-5">
          <label for="product-name" class="block text-sm font-bold uppercase mb-2">Product Name</label>
          <input id="product-name" name="name" type="text" required class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black" />
        </div>

        <div class="mb-5">
          <label for="product-price" class="block text-sm font-bold uppercase mb-2">Price</label>
          <input id="product-price" name="price" type="number" min="0" required class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black" />
        </div>

        <div class="mb-5">
          <label for="product-category" class="block text-sm font-bold uppercase mb-2">Category</label>
          <select id="product-category" name="categoryId" required class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black">
            <option value="">Select category</option>
          </select>
        </div>

        <div class="mb-5">
          <label for="product-description" class="block text-sm font-bold uppercase mb-2">Description</label>
          <textarea id="product-description" name="description" rows="5" class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"></textarea>
        </div>

        <div class="mb-8">
          <label for="product-image" class="block text-sm font-bold uppercase mb-2">Product Image</label>
          <input id="product-image" name="image" type="file" accept="image/*" class="w-full border border-gray-300 px-4 py-3" />
        </div>

        <button type="submit" class="bg-primary text-white px-6 py-3 uppercase text-sm font-bold hover:opacity-90">
          Create Product
        </button>
      </form>
    </div>
  `;

  const backButton = document.getElementById("back-product-button");
  const form = document.getElementById("product-form");

  if (backButton) backButton.addEventListener("click", () => adminProduct.renderers.products());
  if (form) form.addEventListener("submit", adminProduct.handleProductSubmit);

  adminProduct.loadCategoryOptions();
};

adminProduct.loadCategoryOptions = async function () {
  const select = document.getElementById("product-category");
  if (!select) return;

  try {
    const categories = await adminProduct.helpers.requestJson(adminProduct.api.categories);
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
};

adminProduct.handleProductSubmit = async function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    await adminProduct.helpers.requestJson(adminProduct.api.products, {
      method: "POST",
      body: formData,
    });

    alert("Product created successfully.");
    adminProduct.renderers.products();
  } catch (error) {
    console.error(error);
    alert("Failed to create product.");
  }
};

adminProduct.deleteProduct = async function (id) {
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  try {
    await adminProduct.helpers.requestJson(`${adminProduct.api.products}/${id}`, {
      method: "DELETE",
    });

    adminProduct.loadProducts();
  } catch (error) {
    console.error(error);
    alert("Failed to delete product.");
  }
};
