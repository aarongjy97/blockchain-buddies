<template>
  <div>
    <procurer-header></procurer-header>
    <order-status-header></order-status-header>
    <order-status-box></order-status-box>
  </div>
</template>

<script>
import OrderStatusBox from "./OrderStatusBox.vue";
import OrderStatusHeader from "./OrderStatusHeader.vue";
import Header from "./Header.vue";

export default {
  components: {
    "procurer-header": Header,
    "order-status-box": OrderStatusBox,
    "order-status-header": OrderStatusHeader,
  },
};
</script>

<style></style>
