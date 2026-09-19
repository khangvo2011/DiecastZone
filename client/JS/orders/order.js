window.AdminDashboard = window.AdminDashboard || {};

const adminOrder = window.AdminDashboard;

adminOrder.renderers = adminOrder.renderers || {};

adminOrder.renderers.orders = function () {
  const refs = adminOrder.refs || {};
  const main = refs.main;
  const ordersLink = refs.ordersLink;

  if (!main) return;

  adminOrder.setActiveLink(ordersLink);
  main.innerHTML = `
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Admin</p>
          <h1 class="text-3xl font-bold uppercase">Order Management</h1>
        </div>
      </div>

      <div class="border border-gray-200 bg-white p-8">
        <p class="text-gray-500">Order management has not been connected yet.</p>
      </div>
    </div>
  `;
};

adminOrder.renderers.customers = function () {
  const refs = adminOrder.refs || {};
  const main = refs.main;
  const customersLink = refs.customersLink;

  if (!main) return;

  adminOrder.setActiveLink(customersLink);
  main.innerHTML = `
    <div class="p-8">
      <div class="mb-8">
        <p class="font-mono text-xs uppercase tracking-widest text-primary mb-2">Management</p>
        <h1 class="text-3xl font-bold uppercase">Customer Management</h1>
      </div>

      <div class="border border-gray-200 bg-white p-8">
        <p class="text-gray-500">Customer management has not been connected yet.</p>
      </div>
    </div>
  `;
};
