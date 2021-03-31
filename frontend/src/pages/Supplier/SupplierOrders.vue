<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Orders</h1>
  <br>
  <b-container v-if='products.length'>
    <b-card-group deck v-for="product in products" :key="product.name">
      <b-card
        :title='product.productId'
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>
          Price: {{ product.price }}
          Qty: {{ product.quantity }}
          Date Created: {{ product.dateCreated }}
          Procurer: {{ procurer }}
        </b-card-text>
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
        }))
      }
      catch (err) {
        console.log(err)
      }
    },
    async approve(orderId) {
      const result = await Supplier.approvePurchaseOrder(orderId, this.details.address);
      console.log('approve PO:', result.data);
    },
    async reject(orderId) {
      const result = await Supplier.rejectPurchaseOrder(orderId, this.details.address);
      console.log('reject PO:', result.data);
    }
    
  },
  mounted() {
    this.viewAll()
  },
};
</script>

<style></style>