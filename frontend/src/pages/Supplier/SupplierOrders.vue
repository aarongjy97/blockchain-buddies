<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Orders</h1>
  <br>
  <b-container v-if='products.length'>
    <b-card-group deck v-for="product in products" :key="product.name">
      <b-card
        :title='"Purchase Order " + product.orderId'
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <!-- <b-card-text></b-card-text> -->
        <b-list-group class='mb-2'>
          <b-list-group-item>Product ID: {{ product.productId }}</b-list-group-item>
          <b-list-group-item>Price: {{ product.price }}</b-list-group-item>
          <b-list-group-item>Qty: {{ product.quantity }}</b-list-group-item>
          <b-list-group-item>Date Created: {{ product.dateCreated }}</b-list-group-item>
          <b-list-group-item>Procurer: {{ product.procurer }}</b-list-group-item>
          <b-list-group-item>Status: {{ product.status }}</b-list-group-item>
        </b-list-group>
        <b-button v-on:click='approve(product.orderId)' variant="success" class='mr-2'>Approve</b-button>
        <b-button v-on:click='reject(product.orderId)' variant="danger" class='ml-2'>Reject</b-button>
      </b-card>
    </b-card-group>
  </b-container>
  
  <div v-else>There are no purchase orders</div>
</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierOrders",
  data() {
    return {
      details: {},
      products: [],
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async viewAll() {
      try{
        const details = this.$store.state.details;
        this.details = details;
        console.log('details:', details);

        const result = await Supplier.viewAllPurchaseOrders(details.address);
        console.log('products:', result.data);

        this.products = result.data.map(p => ({
          productId: p.productId,
          orderId: p.orderId,
          quantity: p.quantity,
          price: p.price,
          dateCreated: p.dateCreated,
          procurer: p.procurer,
          status: p.status,
        }))
      }
      catch (err) {
        console.log(err)
      }
    },
    async approve(orderId) {
      try {
        const result = await Supplier.approvePurchaseOrder(orderId, this.details.address);
        console.log('approve PO:', result.data);
        alert('Approved')
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
      
    },
    async reject(orderId) {
      try {
        const result = await Supplier.rejectPurchaseOrder(orderId, this.details.address);
        console.log('reject PO:', result.data);
        alert('Rejected')
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    }
  },
  mounted() {
    this.viewAll()
  },
};
</script>

<style></style>