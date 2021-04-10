<template>
  <div>
    <Navbar></Navbar>
    <div v-if="purchaseOrders.length">
      <div v-for="po in purchaseOrders" :key="po.po_id">
        <order-status-box
          v-bind:po_OrderId="po.po_id"
          v-bind:product_id="po.product_id"
          v-bind:supplier_name="po.supplier_name"
          v-bind:product_price="po.price"
          v-bind:product_quantity="po.quantity"
          v-bind:po_status="po.status"
          v-bind:po_date="po.date"
          v-bind:employeeType="employeeType"
          v-bind:product_name="po.product_name"
          v-bind:courier_name="po.courier_name"
          v-bind:procurer_name="po.procurer_name"
        ></order-status-box>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatusBox from "../Common/OrderStatusBox.vue";
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";

export default {
  name: "supplier-orders",
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
        const result = await Supplier.viewAllPurchaseOrders(
          this.$store.state.details.address
        );
        console.log(result.data);
        this.purchaseOrders = result.data.map((po) => ({
          po_id: po.orderId,
          price: po.price,
          quantity: po.quantity,
          date: po.dateCreated.substring(0, 10),
          status: po.status,
          supplier_name: po.supplierName,
          product_id: po.productId,
          product_name: po.productName,
          courier_name: po.courierName,
          procurer_name: po.procurerName,
        }));
        this.purchaseOrders = this.purchaseOrders.filter(
          (po) => (po.status != "Ordered") & (po.status != "Internal Rejected")
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
