<template>
  <div>
    <Navbar></Navbar>
    <order-status-header></order-status-header>
    <order-status-box></order-status-box>
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
          po_price: po.price,
          po_quantity: po.quantity,
          po_date: po.dateCreated,
          po_status: po.status,
          po_supplier: po.supplier,
        }));
        console.log("purchaseOrders:", this.purchaseOrders);
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.viewAllPurchaseOrders();
  },
};
</script>

<style></style>
