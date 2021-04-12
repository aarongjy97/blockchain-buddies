<template>
  <div>
    <Navbar></Navbar>
    <h3 style="text-align: center;">Purchase Orders</h3>
    <div v-if="purchaseOrders.length">
      <div v-for="po in purchaseOrders" :key="po.po_id">
        <order-status-box
          v-bind="po"
          v-bind:employeeType="employeeType"
        ></order-status-box>
      </div>
    </div>
    <div v-else class="d-flex align-items-center justify-content-center flex-column">
      <span class="mt-3" align='center'>
          No Purchase Orders Found
      </span>
    </div>
  </div>
</template>

<script>
import OrderStatusBox from "../Common/OrderStatusBox.vue";
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
  },
  methods: {
    async viewAllPurchaseOrders() {
      try {
        const result = await Procurer.viewAllPurchaseOrders(
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
          rating: parseInt(po.rating),
          rated: parseInt(po.rating) > 0
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

<style scoped></style>
