<template>
  <div>
    <Navbar></Navbar>
    <div v-if="purchaseOrders.length">
      <div v-for="po in purchaseOrders" :key="po.po_id">
        <order-status-box
          v-bind="po"
          v-bind:employeeType="employeeType"
        ></order-status-box>
      </div>
    </div>
    <div v-else style="text-align: center;">
      <span>
          No Purchase Orders Found
      </span>
    </div>
  </div>
</template>

<script>
import OrderStatusBox from "../Common/OrderStatusBox.vue";
import Navbar from "./Navbar.vue";
import Courier from "../../api/Courier";

export default {
  name: "courier-orders",
  data() {
    return {
      purchaseOrders: [],
      employeeType: "",
    };
  },
  components: {
    Navbar,
    "order-status-box": OrderStatusBox,
  },
  methods: {
    async viewAllPurchaseOrders() {
      try {
        const result = await Courier.viewAllPurchaseOrders(
          this.$store.state.details.address
        );
        console.log("po:", result.data);
        this.purchaseOrders = result.data.map((po) => ({          
          courierName: po.courierName,
          dateCreated: po.dateCreated.substring(0,10),
          orderId: po.orderId,
          price: po.price,
          procurerName: po.procurerName,
          productId: po.productId,
          productName: po.productName,
          quantity: po.quantity,
          status: po.status,
          supplierName: po.supplierName,
        }));
        this.purchaseOrders = this.purchaseOrders.filter(
          (po) =>
            (po.status != "Ordered") &
            (po.status != "Internal Rejected") &
            (po.status != "Supplier Rejected")
        );
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

<style scoped></style>
