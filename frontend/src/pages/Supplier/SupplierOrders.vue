<template>
<div>
  <Navbar></Navbar>
  <h1 style="text-align: center">Supplier Orders</h1>
  <br>

  <b-container v-if='orders.length' fluid>
    <b-row align-h='center'>
      <b-card-group deck v-for="order in orders" :key="order.orderId">
        <!-- <b-card
          :title='"Purchase Order " + product.orderId'
          img-src="https://picsum.photos/600/300/?image=25"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <b-list-group class='mb-2'>
            <b-list-group-item>Product: {{ product.productName }}</b-list-group-item>
            <b-list-group-item>Price: {{ product.price }}</b-list-group-item>
            <b-list-group-item>Qty: {{ product.quantity }}</b-list-group-item>
            <b-list-group-item>Date Created: {{ product.dateCreated }}</b-list-group-item>
            <b-list-group-item>Procurer: {{ product.procurerName }}</b-list-group-item>
            <b-list-group-item v-if='product.courierName'>Courier: {{ product.courierName }}</b-list-group-item>
            <b-list-group-item v-else>Courier: -</b-list-group-item>
            <b-list-group-item>Status: {{ product.status }}</b-list-group-item>          
          </b-list-group>

          <div v-if='product.status=="Internal Approved"'>
            <b-button v-on:click='approve(product.orderId)' variant="success" class='mr-2'>Approve</b-button>
            <b-button v-on:click='reject(product.orderId)' variant="danger" class='ml-2'>Reject</b-button>
          </div>
          
          <div v-if='product.status=="Supplier Approved"'>
            <b-form-group label="Select Courier:">
              <b-form-select v-model="courier" :options="couriers" required></b-form-select>
            </b-form-group>
            <b-button v-on:click='assignCourier(product.orderId, courier)'>Submit</b-button>
          </div>

        </b-card> -->
        <b-card no-body class="overflow-hidden" style="min-width: 75vw">
          <b-row no-gutters>
            <b-col md="4" class='section'>
              <b-card-body  :title='"Purchase Order " + order.orderId'>
                <b-card-text>{{ order.productName }}</b-card-text>
                <b-card-text><span class='price' style="font-weight: bold">{{ order.price }}</span> Tokens</b-card-text>
                <b-card-text><span style="font-weight: bold">{{ order.quantity }}</span> Qty</b-card-text>
              </b-card-body>
            </b-col>
            <b-col md="4" class='section pt-4' align='center'>
              <span class='lightgray'>Procurer</span>
              <br>
              <span>{{ order.procurerName }}</span>
              <br><br>
              <span class='lightgray'>Courier</span>
              <br>
              <span>{{ order.courierName }}</span>
            </b-col>
            <b-col md="4" class='section pt-5' align='center'>
              <span class='lightgray'>Status</span>
              <br>
              <span style="font-size: 2rem; font-weight: bold">{{ order.status }}</span>
            </b-col>
          </b-row>
          <router-link :to="{name: 'supplier-order-page', params: order}" class='stretched-link'></router-link>
        </b-card>
      </b-card-group>
    </b-row>
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
      orders: [],
      couriers: [{text: '-- Select One --', value: null, disabled: true}],
      courier: null, 
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
        console.log('orders:', result.data);

        this.orders = result.data.map(p => ({
          productId: p.productId,
          orderId: p.orderId,
          quantity: p.quantity,
          price: p.price,
          dateCreated: p.dateCreated.substring(0,10),
          procurerName: p.procurerName,
          status: p.status,
          courierName: p.courierName,
          productName: p.productName,
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
        alert('Approved');
        this.$router.go();
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
        alert('Rejected');
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },
    async fetchCouriers() {
      const result = await Supplier.getCouriers();
      
      const couriers = [];
      result.data.forEach(x => couriers.push({'text': x['name'], 'value': x['address']}));
      console.log('couriers', couriers);
      this.couriers = this.couriers.concat(couriers);
    },
    async assignCourier(orderId, courier) {
      try {
        const result = await Supplier.assignCourier(orderId, courier, this.details.address);
        console.log('assign courier:', result.data);
        alert('Assigned courier');
        this.$router.go();
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    }
  },
  mounted() {
    this.viewAll();
    this.fetchCouriers();
  },
};
</script>

<style scoped>
.section {
  border: 1px solid lightgrey;
}

.lightgray {
  color: lightgray;
}

.vl {
  border-left: 2px solid green;
  /* height: 500px; */
}
</style>