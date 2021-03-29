<template>
  <div>
    <Navbar></Navbar>
    <order-status-header></order-status-header>
    <order-status-box></order-status-box>
  </div>
</template>

<script>
import OrderStatusBox from "./OrderStatusBox.vue";
import OrderStatusHeader from "./OrderStatusHeader.vue";
import Navbar from "./Navbar.vue";

export default {
  components: {
    Navbar,
    "order-status-box": OrderStatusBox,
    "order-status-header": OrderStatusHeader,
  },
};
</script>

<style></style>
