import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/Common/Login.vue";

Vue.use(Router);

export default new Router({
  routes: [{ path: "/", name: "login", component: Login }],
  //   routes: [{ path: "/signup", name: "signup", component: Login }],
  mode: "history",
});
