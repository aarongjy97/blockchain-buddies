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
        v-if='order.orderId!=0'
      >
        <b-list-group class='mb-2'>
          <b-list-group-item>Product: {{ order.productName }}</b-list-group-item>
          <b-list-group-item>Price: {{ order.price }}</b-list-group-item>
          <b-list-group-item>Qty: {{ order.quantity }}</b-list-group-item>
          <b-list-group-item>Date Created: {{ order.dateCreated }}</b-list-group-item>
          <b-list-group-item>Procurer: {{ order.procurerName }}</b-list-group-item>
          <b-list-group-item>Supplier: {{ order.supplierName }}</b-list-group-item>
          <b-list-group-item>Status: {{ order.status }}</b-list-group-item>
        </b-list-group>
        <b-button v-if='order.status=="Supplier Approved"' v-on:click='received(order.orderId)'>Received from supplier</b-button> 
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
          dateCreated: new Date(o.dateCreated*1000).toLocaleString(),
          orderId: o.orderId,
          price: o.price,
          procurerName: o.procurerName,
          productId: o.productId,
          productName: o.productName,
          quantity: o.quantity,
          status: o.status,
          supplierName: o.supplierName,
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
        alert('Received from supplier and is delivering');
        this.$router.go();
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