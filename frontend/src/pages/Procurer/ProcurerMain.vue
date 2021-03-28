<template>
  <div>
    <procurer-header></procurer-header>
    <ul v-if="products.length">
      <li v-for="p in products" :key="p.product_name">
        <div class="col-lg-3 col-md-4 col-sm-12">
          <product-box
            v-bind:supplier_id="p.supplier_id"
            v-bind:product_name="p.product_name"
            v-bind:product_price="p.product_price"
            v-bind:product_id="p.product_id"
          ></product-box>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Header from "./Header.vue";
import ProductBox from "./ProductBox.vue";
import Market from "../../api/Market";

export default {
  name: "ProcurerMain",
  data() {
    return {
      products: [],
    };
  },
  components: {
    "procurer-header": Header,
    "product-box": ProductBox,
  },
  methods: {
    async viewAllProducts() {
      try {
        const result = await Market.viewAllProducts();
        this.products = result.data.map((p) => ({
          product_name: p.productName,
          product_price: p.price,
          supplier: p.supplier,
          product_id: p.id,
        }));
      } catch (e) {
        console.log(e);
      }
    },
  },
  async mounted() {
    this.viewAllProducts();
  },
};
</script>
<style></style>
