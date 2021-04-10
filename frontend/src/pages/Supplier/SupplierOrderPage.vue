<template>
<div>
  <Navbar></Navbar>
  <b-container fluid>
    <span style="text-align: center;"><h3>Order Information</h3></span>

    <div v-if='order.status=="Internal Approved"'>
      <b-button v-on:click='approve(order.orderId)' variant="success" class='mr-2'>Approve</b-button>
      <b-button v-on:click='reject(order.orderId)' variant="danger" class='ml-2'>Reject</b-button>
    </div>

    <div v-if='order.status=="Supplier Approved"'>
      <b-form-group label="Select Courier:">
        <b-form-select v-model="courier" :options="couriers" required></b-form-select>
      </b-form-group>
      <b-button v-on:click='assignCourier(order.orderId, courier)'>Submit</b-button>
    </div>
  </b-container>
</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierOrderPage",
  data() {
    return {
      details: {},
      order: {},
      couriers: [{text: '-- Select One --', value: null, disabled: true}],
      courier: null, 
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async loadPage() {
      this.details = this.$store.state.details;
      const result = await Supplier.viewPurchaseOrder(this.$route.params.orderId, this.details.address); // its returning empty string
      this.order = result.data;
      console.log(this.order);
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
    this.loadPage();
    this.fetchCouriers();
  },
};
</script>

<style scoped>

</style>