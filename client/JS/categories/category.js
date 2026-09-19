window.AdminDashboard = window.AdminDashboard || {};

const adminCategory = window.AdminDashboard;

adminCategory.renderers = adminCategory.renderers || {};

adminCategory.renderers.categories = function () {
  const refs = adminCategory.refs || {};
  const main = refs.main;
  const categoryLink = refs.categoryLink;

  if (!main) return;

  adminCategory.setActiveLink(categoryLink);
  main.innerHTML = `
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Management</p>
          <h1 class="text-3xl font-bold uppercase">Category Management</h1>
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
        <p class="text-gray-500">Loading categories...</p>
      </div>
    </div>
  `;

  const addButton = document.getElementById("add-category-button");
  if (addButton) {
    addButton.addEventListener("click", adminCategory.renderers.addCategory);
  }

  adminCategory.loadCategories();
};

adminCategory.loadCategories = async function () {
  const container = document.getElementById("category-list");
  if (!container) return;

  try {
    const categories = await adminCategory.helpers.requestJson(adminCategory.api.categories);

    if (!Array.isArray(categories) || categories.length === 0) {
      container.innerHTML = `
        <div class="border border-gray-200 bg-white p-8">
          <p class="text-gray-500">No categories found.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = categories
      .map(
        (category) => `
          <div class="bg-white border border-gray-200 p-6 flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold uppercase">${adminCategory.helpers.escapeHTML(category.name)}</h3>
              <p class="text-xs text-gray-400 mt-2 font-mono">${category.createDate || ""}</p>
            </div>

            <button
              type="button"
              class="delete-category-button text-red-600 text-sm font-bold uppercase hover:underline"
              data-id="${category.id}"
            >
              Delete
            </button>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".delete-category-button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        if (id) adminCategory.deleteCategory(id);
      });
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="border border-red-200 bg-red-50 p-6">
        <p class="text-red-600">Failed to load categories.</p>
      </div>
    `;
  }
};

adminCategory.renderers.addCategory = function () {
  const refs = adminCategory.refs || {};
  const main = refs.main;

  if (!main) return;

  main.innerHTML = `
    <div class="p-8">
      <div class="mb-8">
        <button id="back-category-button" type="button" class="text-sm text-gray-500 hover:text-black mb-4">
          ← Back to Categories
        </button>

        <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Management</p>
        <h1 class="text-3xl font-bold uppercase">Add Category</h1>
      </div>

      <form id="category-form" class="bg-white border border-gray-200 p-8 max-w-xl">
        <div class="mb-6">
          <label for="category-name" class="block text-sm font-bold uppercase mb-2">Category Name</label>
          <input id="category-name" name="name" type="text" required class="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black" placeholder="Enter category name" />
        </div>

        <button type="submit" class="bg-primary text-white px-6 py-3 uppercase text-sm font-bold hover:opacity-90">
          Create Category
        </button>
      </form>
    </div>
  `;

  const backButton = document.getElementById("back-category-button");
  const form = document.getElementById("category-form");

  if (backButton) backButton.addEventListener("click", () => adminCategory.renderers.categories());
  if (form) form.addEventListener("submit", adminCategory.handleCategorySubmit);
};

adminCategory.handleCategorySubmit = async function (event) {
  event.preventDefault();
  const form = event.target;
  const name = new FormData(form).get("name");

  if (!name || !String(name).trim()) {
    alert("Please enter a category name.");
    return;
  }

  try {
    await adminCategory.helpers.requestJson(adminCategory.api.categories, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(name).trim() }),
    });

    alert("Category created successfully.");
    adminCategory.renderers.categories();
  } catch (error) {
    console.error(error);
    alert("Failed to create category.");
  }
};

adminCategory.deleteCategory = async function (id) {
  const confirmed = confirm("Are you sure you want to delete this category?");
  if (!confirmed) return;

  try {
    await adminCategory.helpers.requestJson(`${adminCategory.api.categories}/${id}`, {
      method: "DELETE",
    });

    adminCategory.loadCategories();
  } catch (error) {
    console.error(error);
    alert("Failed to delete category.");
  }
};
