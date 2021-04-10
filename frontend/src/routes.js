import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/Common/Login.vue";
import Account from "./pages/Common/Account.vue";
import ProcurerMain from "./pages/Procurer/ProcurerMain.vue";
import ProcurerProduct from "./pages/Procurer/ProcurerProduct.vue";
import ProcurerOrderStatusPage from "./pages/Procurer/ProcurerOrderStatusPage.vue";
import SupplierMain from "./pages/Supplier/SupplierMain.vue";
import SupplierProduct from "./pages/Supplier/SupplierProduct.vue";
import SupplierListing from "./pages/Supplier/SupplierListing.vue";
import SupplierOrders from "./pages/Supplier/SupplierOrderStatusPage.vue";
import SupplierOrderPage from "./pages/Supplier/SupplierOrderPage.vue";
import CourierMain from "./pages/Courier/CourierMain.vue";
import CourierOrderStatusPage from "./pages/Courier/CourierOrderStatusPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "login", component: Login },
    { path: "/account", name: "account", component: Account },
    { path: "/procurer-main", name: "procurer-main", component: ProcurerMain },
    {
      path: "/procurer-product/:productId-:productName",
      name: "procurer-product",
      component: ProcurerProduct,
    },
    {
      path: "/procurer-orders",
      name: "procurer-orders",
      component: ProcurerOrderStatusPage,
    },
    { path: "/supplier-main", name: "supplier-main", component: SupplierMain },
    {
      path: "/supplier-product/:productId-:productName",
      name: "supplier-product",
      component: SupplierProduct,
    },
    {
      path: "/supplier-listing",
      name: "supplier-listing",
      component: SupplierListing,
    },
    {
      path: "/supplier-orders",
      name: "supplier-orders",
      component: SupplierOrders,
    },
    {
      path: "/supplier-orders/:orderId",
      name: "supplier-order-page",
      component: SupplierOrderPage,
    },
    { path: "/courier-main", name: "courier-main", component: CourierMain },
    {
      path: "/courier-main",
      name: "courier-main",
      component: CourierOrderStatusPage,
    },
  ],
  mode: "history",
});
