<template>
  <div>
    <procurer-header></procurer-header>
    <div class="col-lg-3 col-md-4 col-sm-12">
      <product-box></product-box>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import ProductBox from "../Common/ProductBox.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    "procurer-header": Header,
    "product-box": ProductBox,
  },
};
</script>

<style></style>
