<template>
<div class='page'>
  <Navbar></Navbar>
  <h1>Supplier Main Page</h1>
  <br>

  <h2>Products</h2>
  <ul v-if='products.length'>
    <li v-for="product in products" :key="product.name">
      {{ product.name }}
    </li>
  </ul>
  <div v-else>There are no products listed</div>

</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierMain",
  data() {
    return {
      products: []
    };
  },
  methods: {
    async viewAll() {
      try{
        const result = await Supplier.viewAllSelfProducts(1); // where to get the address?
        console.log(result.data);

        this.products = result.data.map(p => ({
          name: p.productName
        }))
      }
      catch (err) {
        console.log(err)
      }
      
    }
  },
  components: {
    Navbar,
  },
  mounted() {
    this.viewAll()
  },
};
</script>

<style>
/* h1 {
  border: 1px solid red;
} */
</style>