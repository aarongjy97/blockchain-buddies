<template>
  <div>
    <Navbar></Navbar>
    <div v-if="products.length">
      <div v-for="p in products" :key="p.product_id">
        <div class="box col-lg-3 col-md-4" v-if='p.listed'>
          <product-box
            v-bind:product_id="p.product_id"
            v-bind:product_name="p.product_name"
            v-bind:product_price="p.product_price"
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
        this.products = result.data.map((p) => ({
          product_name: p.productName,
          product_price: p.price,
          supplier: p.supplier,
          product_id: p.productId,
          listed: p.listed,
          supplierName: p.supplierName,
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
<style></style>
