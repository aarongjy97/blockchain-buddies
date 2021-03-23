import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/Common/Login.vue";
import ProcurerMain from "./pages/Procurer/ProcurerMain.vue";
import SupplierMain from "./pages/Supplier/SupplierMain.vue";
import CourierMain from "./pages/Courier/CourierMain.vue";
import ProductPage from "./pages/Common/ProductPage.vue";
import OrderStatusPage from "./pages/Procurer/OrderStatusPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "login", component: Login },
    { path: "/procurer-main", name: "procurer-main", component: ProcurerMain },
    { path: "/supplier-main", name: "supplier-main", component: SupplierMain },
    { path: "/courier-main", name: "courier-main", component: CourierMain },
    { path: "/product", name: "product", component: ProductPage },
    {
      path: "/procurer-orders",
      name: "procurer-orders",
      component: OrderStatusPage,
    },
  ],
  mode: "history",
});
