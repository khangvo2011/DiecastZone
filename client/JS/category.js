
const API_CATEGORIES = "/api/categories";

// =========================
// CATEGORY PAGE
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

// =========================
// LOAD CATEGORIES
// =========================

async function loadCategories() {
  const container = document.getElementById("category-list");

  if (!container) return;

  try {
    const response = await fetch(API_CATEGORIES);

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
      .map(
        (category) => `
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
        `
      )
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

// =========================
// CREATE CATEGORY
// =========================

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
    const response = await fetch(API_CATEGORIES, {
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

// =========================
// DELETE CATEGORY
// =========================

async function deleteCategory(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_CATEGORIES}/${id}`, {
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

