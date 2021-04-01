<template>
  <div>
    <Navbar></Navbar>
    <order-status-header></order-status-header>
    <div v-if="purchaseOrders.length">
      <div v-for="po in purchaseOrders" :key="po.po_id">
        <order-status-box
          v-bind:po_OrderId="po.po_id"
          v-bind:product_id="po.product_id"
          v-bind:supplier_id="po.supplier"
          v-bind:product_price="po.price"
          v-bind:product_quantity="po.quantity"
          v-bind:po_status="po.status"
          v-bind:po_date="po.date"
          v-bind:employeeType="employeeType"
        ></order-status-box>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatusBox from "./OrderStatusBox.vue";
import OrderStatusHeader from "./OrderStatusHeader.vue";
import Navbar from "./Navbar.vue";
import Procurer from "../../api/Procurer";

export default {
  name: "procurer-orders",
  data() {
    return {
      purchaseOrders: [],
      employeeType: "",
    };
  },
  components: {
    Navbar,
    "order-status-box": OrderStatusBox,
    "order-status-header": OrderStatusHeader,
  },
  methods: {
    async viewAllPurchaseOrders() {
      try {
        const result = await Procurer.viewAllPurchaseOrders(
          this.$store.state.details.address
        );
        this.purchaseOrders = result.data.map((po) => ({
          po_id: po.orderId,
          price: po.price,
          quantity: po.quantity,
          date: po.dateCreated,
          status: po.status,
          supplier: po.supplier,
          product_id: po.productId,
        }));
        console.log("purchaseOrders:", this.purchaseOrders);
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.viewAllPurchaseOrders();
    this.employeeType = this.$store.state.details.employeetype;
  },
};
</script>

<style></style>
