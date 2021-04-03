<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Main Page</h1>
  <br>

  <h2>Products</h2>

  <b-container v-if='products.length'>
    <b-card-group deck v-for="product in products" :key="product.id">
      <b-card
        :title='product.name'
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
        v-if='product.listed'
      >
        <b-card-text>
          Price: {{ product.price }}
          Qty: {{ product.quantity }}
          Sold: {{ product.numSold }}
        </b-card-text>

        <b-button v-b-modal="product.id">Edit</b-button>
        <b-modal :id=product.id title="Edit Product Details" @show='resetModal' @hidden='resetModal' @ok='submitModal(product.id)'>
          <form>
            <b-form-group label="Price">
              <b-form-input v-model="newPrice"></b-form-input>
            </b-form-group>
            <b-form-group label="Quantity">
              <b-form-input v-model="newQuantity"></b-form-input>
            </b-form-group>
          </form>
          <p>*Edit only detail at a time</p>
        </b-modal>

        <b-button v-on:click='unlist(product.id)'>Unlist</b-button>
      </b-card>

      <b-card
        :title='product.name'
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
        v-if='!product.listed'
      >
        <b-card-text>
          Price: {{ product.price }}
          Qty: {{ product.quantity }}
          Sold: {{ product.numSold }}
        </b-card-text>

        <b-button v-b-modal="product.id">Edit</b-button>
        <b-modal :id=product.id title="Edit Product Details" @show='resetModal' @hidden='resetModal' @ok='submitModal(product.id)'>
          <form>
            <b-form-group label="Price">
              <b-form-input v-model="newPrice"></b-form-input>
            </b-form-group>
            <b-form-group label="Quantity">
              <b-form-input v-model="newQuantity"></b-form-input>
            </b-form-group>
          </form>
        </b-modal>

        <b-button v-on:click='relist(product.id)'>Relist</b-button>
      </b-card>
    </b-card-group>
  </b-container>
  
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
      details: {},
      products: [],
      newPrice: null,
      newQuantity: null,
    };
  },
  methods: {
    async viewAll() {
      try{
        const details = this.$store.state.details;
        this.details = details;
        console.log('details:', details);

        const result = await Supplier.viewAllSelfProducts(details.address);
        console.log('products:', result.data);

        this.products = result.data.map(p => ({
          name: p.productName,
          price: p.price,
          quantity: p.quantityAvailable,
          numSold: p.numSold,
          id: p.productId,
          listed: p.listed
        }))
      }
      catch (err) {
        console.log(err)
      }
    },
    resetModal() {
      this.newPrice = null;
      this.newQuantity = null;
    },
    async submitModal(productId) { // TODO: cannot update 2 fields at once time
      if (this.newPrice) {
        const result = await Supplier.updateProductPrice(productId, this.newPrice, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
      if (this.newQuantity) {
        const result = await Supplier.updateProductQuantity(productId, this.newQuantity, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
    },
    async unlist(productId) {
      const result = await Supplier.unlistProduct(productId, this.details.address);
      console.log(result.data);
      this.$router.go();
    },
    async relist(productId) {
      const result = await Supplier.relistProduct(productId, this.details.address);
      console.log(result.data);
      this.$router.go();
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

</style>