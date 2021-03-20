import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/Common/Login.vue";
import SupplierMain from "./pages/Supplier/SupplierMain.vue";
import SupplierListing from "./pages/Supplier/SupplierListing.vue";
import SupplierProducts from "./pages/Supplier/SupplierProducts.vue";
import SupplierOrders from "./pages/Supplier/SupplierOrders.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "login", component: Login },
    { path: "/supplier", component: SupplierMain },
    { path: "/supplier-listing", component: SupplierListing },
    { path: "/supplier-products", component: SupplierProducts },
    { path: "/supplier-orders", component: SupplierOrders },
  ],
  mode: "history",
});