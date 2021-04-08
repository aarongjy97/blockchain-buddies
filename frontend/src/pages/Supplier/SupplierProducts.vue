<template>
<div>
  <Navbar></Navbar>
  <b-container fluid class='pt-5'>
    <b-row style='border:1px solid'>
      <b-col cols="5" class='leftside'>
        <b-img src="https://picsum.photos/600/300/?image=25" fluid></b-img>
      </b-col>

      <b-col class='rightside'>
        <b-row align-h='center' class='p-3'><h3 class='productName'>{{ product.productName }}</h3></b-row>

        <b-row>{{ product.description }}</b-row>

        <b-row class='p-3'>
          <b-col>Rating: {{ product.rating }}/5</b-col>
          <b-col>Quantity: {{ product.quantityAvailable }}</b-col>
          <b-col>Status: {{ status }}</b-col>
          <b-col>{{ product.numSold }} <span id='sold'>Sold</span></b-col>
        </b-row>

        <b-row align-h='center'>
            <span id='price'>{{ product.price }} Tokens</span>
        </b-row>

        <b-row align-h='center' class='pt-3'>
          <b-button v-b-modal="product.productId" class='mr-5 py-3 px-5'>Edit</b-button>
          <b-modal :id=product.productId title="Edit Product Details" @show='resetModal' @hidden='resetModal' @ok='submitModal(product.productId)'>
            <form>
              <b-form-group label="Price">
                <b-form-input v-model="newPrice"></b-form-input>
              </b-form-group>
              <b-form-group label="Quantity">
                <b-form-input v-model="newQuantity"></b-form-input>
              </b-form-group>
              <b-form-group label="Description">
                <b-form-input v-model="description"></b-form-input>
              </b-form-group>
            </form>
            <p>*Edit only detail at a time</p>
          </b-modal>
          <b-button v-if='product.listed' v-on:click='unlist(product.productId)' class='ml-5 py-3 px-5'>Unlist</b-button>
          <b-button v-else v-on:click='relist(product.productId)' class='ml-5 py-3 px-5'>Relist</b-button>
        </b-row>

      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierProducts",
  data() {
    return {
      details: {},
      product: {},
      newPrice: null,
      newQuantity: null,
      description: null,
      status: null,
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async loadPage() {
      this.details = this.$store.state.details;
      // this.product = this.$route.params;
      const result = await Supplier.viewSelfProduct(this.$route.params.productId, this.details.address);
      this.product = result.data;
      console.log(this.product);

      this.status = this.product.listed == true ? 'Listed' : 'Not Listed'
    },
    async submitModal(productId) { // TODO: cannot update more than 2 fields at once time
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
      if (this.description) {
        const result = await Supplier.updateProductDescription(productId, this.description, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
    },
    resetModal() {
      this.newPrice = null;
      this.newQuantity = null;
      this.description = null;
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
  mounted() {
    this.loadPage()
  },
};
</script>

<style>
.productName {
  font-weight: 700;
}

#sold {
  font-size: .875rem;
  color: #767676;
}

#price {
  font-size: 1.875rem;
  font-weight: 700;
  color: #d0011b;
}
</style>