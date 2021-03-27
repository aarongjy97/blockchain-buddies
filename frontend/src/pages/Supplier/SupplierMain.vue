<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Main Page</h1>
  <br>

  <h2>Products</h2>
  <ul v-if='products.length'>
    <li v-for="product in products" :key="product.name">
      Name: {{ product.name }}
      Price: {{ product.price }}
      Qty: {{ product.quantity }}
      Sold: {{ product.numSold }}
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
        const details = this.$store.state.details;
        console.log('details:', details);

        const result = await Supplier.viewAllSelfProducts(details.address);
        console.log('products:', result.data);

        this.products = result.data.map(p => ({
          name: p.productName,
          price: p.price,
          quantity: p.quantityAvailable,
          numSold: p.numSold,
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