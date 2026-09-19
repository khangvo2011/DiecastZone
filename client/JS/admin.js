window.AdminDashboard = window.AdminDashboard || {};

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
    console.error("Cannot find #admin-main");
    return;
  }

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

  if (typeof admin.renderers.orders === "function") {
    admin.renderPage("orders");
  }
});