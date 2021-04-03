<template>
  <div class="body">
    <Navbar></Navbar>
    <div class="row" v-if="products.length">
      <div v-for="p in products" :key="p.product_id">
        <div class="col-lg-4" v-if="p.listed">
          <product-box
            v-bind:product_id="p.product_id"
            v-bind:product_name="p.product_name"
            v-bind:product_price="p.product_price"
            v-bind:supplier_name="p.supplierName"
            v-bind:quantity="p.quantity"
          ></product-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
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
    Navbar,
    "product-box": ProductBox,
  },
  methods: {
    async viewAllProducts() {
      try {
        const result = await Market.viewAllProducts();
        console.log(result.data);
        this.products = result.data.map((p) => ({
          product_name: p.productName,
          product_price: p.price,
          supplier: p.supplier,
          product_id: p.productId,
          listed: p.listed,
          supplierName: p.supplierName,
          quantity: p.quantityAvailable,
        }));
        console.log("product:", this.products);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.viewAllProducts();
  },
};
</script>
<style>
.body {
  margin: 20px 20px 20px 20px;
}
</style>
