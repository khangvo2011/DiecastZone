document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "diecastzone_cart";

  const cartList = document.getElementById("cart-list");
  const cartEmpty = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function calculateTotal(cart) {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }

  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      if (cartEmpty) {
        cartEmpty.classList.remove("hidden");
      }

      if (cartContent) {
        cartContent.classList.add("hidden");
      }

      return;
    }

    if (cartEmpty) {
      cartEmpty.classList.add("hidden");
    }

    if (cartContent) {
      cartContent.classList.remove("hidden");
    }

    if (cartList) {
      cartList.innerHTML = cart
        .map(
          (item, index) => `
            <div
              class="cart-item"
              data-index="${index}"
            >
              <img
                src="${escapeHTML(item.image || "")}"
                alt="${escapeHTML(item.title || "Product")}"
              />

              <div>
                <h3>
                  ${escapeHTML(item.title || "Product")}
                </h3>

                <p>
                  ${escapeHTML(item.scale || "")}
                </p>

                <p>
                  ${formatPrice(item.price)}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  data-action="decrease"
                  data-index="${index}"
                >
                  −
                </button>

                <span>
                  ${Number(item.quantity || 1)}
                </span>

                <button
                  type="button"
                  data-action="increase"
                  data-index="${index}"
                >
                  +
                </button>
              </div>

              <div>
                ${formatPrice(
                  Number(item.price || 0) * Number(item.quantity || 1),
                )}
              </div>

              <button
                type="button"
                data-action="remove"
                data-index="${index}"
              >
                Remove
              </button>
            </div>
          `,
        )
        .join("");
    }

    const total = calculateTotal(cart);

    if (cartSubtotal) {
      cartSubtotal.textContent = formatPrice(total);
    }

    if (cartTotal) {
      cartTotal.textContent = formatPrice(total);
    }
  }

  cartList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    const cart = getCart();

    if (!cart[index]) return;

    if (action === "increase") {
      cart[index].quantity = Number(cart[index].quantity || 1) + 1;
    }

    if (action === "decrease") {
      cart[index].quantity = Number(cart[index].quantity || 1) - 1;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }

    if (action === "remove") {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });

  checkoutButton?.addEventListener("click", () => {
    const cart = getCart();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "checkout.html";
  });

  renderCart();
});
