<template>
<div>
  <Navbar></Navbar>
  <h1>Courier Main Page</h1>
  <br>

  <h2>Purchase Orders</h2>
  <b-container v-if='orders.length'>
    <b-card-group deck v-for="order in orders" :key="order.orderId">
      <b-card
        :title='order.orderId'
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>
          Price: {{ order.price }}
          Qty: {{ order.quantity }}
          Date Created: {{ order.dateCreated }}
          Procurer: {{ order.procurer }}
          Supplier: {{ order.supplier }}
          Status: {{ order.status }}
        </b-card-text>
        <b-button v-on:click='received(order.orderId)'>Received from supplier</b-button> 
      </b-card> 
    </b-card-group>
  </b-container>
  
  <div v-else>There are no purchase orders</div>

</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Courier from "../../api/Courier";
export default {
  name: "CourierMain",
  data() {
    return {
      details: {},
      orders: []
    };
  },
  methods: {
    async viewAll() {
      try{
        const details = this.$store.state.details;
        this.details = details;
        console.log('details:', details);

        const result = await Courier.viewAllPurchaseOrders(details.address);
        console.log('orders:', result.data);

        this.orders = result.data.map(o => ({
          dateCreated: o.dateCreated,
          orderId: o.orderId,
          price: o.price,
          procurer: o.procurer,
          productId: o.productId,
          quantity: o.quantity,
          status: o.status,
          supplier: o.supplier,
        }))
      }
      catch (err) {
        console.log(err)
      }
    },
    async received(orderId) {
      try {
        const result = await Courier.receivedByCourier(orderId, this.details.address);
        console.log('received: ', result.data);
        alert('Received');
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },
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