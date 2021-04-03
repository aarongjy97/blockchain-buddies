<template>
  <div>
    <div class="table-wrapper">
      <div class="table-row">
        <div class="col-wrapper order-date-number-po">
          <div class="table-col order-date">{{ po_date }}</div>
          <div class="table-col order-number">{{ po_OrderId }}</div>
        </div>

        <div class="col-wrapper order-supplier-product-price">
          <div class="col-wrapper order-supplier-product">
            <div class="table-col order-supplier">
              {{ supplier_name }}
            </div>
            <div class="table-col order-product">{{ product_name }}</div>
          </div>
          <div class="table-col order-price">{{ product_price }}</div>
        </div>

        <div class="col-wrapper order-status-signed-action">
          <div class="table-col order-status">{{ po_status }}</div>
          <div v-if="isFinance && isOrdered" class="table-col order-status">
            <button class="approve" @click="approvePurchaseOrder">
              Approve
            </button>
            <button class="reject" @click="rejectPurchaseOrder">
              Reject
            </button>
          </div>
          <div
            v-else-if="!isFinance && isDelivering"
            class="table-col order-status"
          >
            <button class="approve" @click="rejectPurchaseOrder">
              Received
            </button>
          </div>
          <div v-else class="table-col order-status">
            -
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Procurer from "../../api/Procurer";

export default {
  props: {
    product_id: String,
    supplier_name: String,
    product_price: String,
    product_quantity: String,
    po_date: String,
    po_status: String,
    po_OrderId: String,
    employeeType: String,
    product_name: String,
  },
  data() {
    return {
      isFinance: this.employeeType == "finance",
      isInternalApproved: this.po_status == "Internal Approved",
      isOrdered: this.po_status == "Ordered",
      isDelivering: this.po_status == "Delivering",
    };
  },
  methods: {
    async approvePurchaseOrder() {
      try {
        await Procurer.approvePurchaseOrder(
          this.po_OrderId,
          this.$store.state.details.address
        );
        alert("Order approved");
        this.$router.go(0);
      } catch (err) {
        console.log(err);
      }
    },
    async rejectPurchaseOrder() {
      try {
        await Procurer.rejectPurchaseOrder(
          this.po_OrderId,
          this.$store.state.details.address
        );
        alert("Order rejected");
        this.$router.go();
      } catch (err) {
        console.log(err);
      }
    },
    async receivedOrder() {
      try {
        await Procurer.deliveredByCourier(
          this.product_id,
          this.$store.state.details.address
        );
        alert("Order received");
        this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.table-wrapper {
  font-family: "Theinhardt", sans-serif;
  font-size: 0.875rem;
  line-height: 1.4;
  max-width: 80%;
  margin: 0 auto;
}

.table-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  padding: 1rem;
}

.table-row:nth-of-type(2n + 1) {
  background: #f1f1f1;
}

.table-header {
  background-color: #33a889 !important;
  color: white;
}

.col-wrapper {
  display: flex;
  /* flex: 1 0; */
  flex-direction: row;
}

.table-col {
  flex: 0 0;
  vertical-align: top;
}

.order-date-number-po {
  flex: 0.5 0;
  width: 100+150+100px;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
}

.order-date {
  width: 100px;
  flex: 0.5 1;
}

.order-number {
  width: 150px;
  flex: 0.5 1;
  font-weight: 500;
}

.order-po {
  width: 100px;
  flex: 0.5 1;
}

.order-supplier-product-price {
  flex: 1 0;
  width: 400+100+100px;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    width: 200px;
    div {
      flex-grow: 0;
    }
  }
}

.order-supplier {
  width: 100px;
  flex: 0.5 1;
  padding-right: 0.5rem;
}

.order-product {
  width: 100px;
  flex: 0.5 1;
}

.order-price {
  width: 200px;
  flex: 2 0;
}

.order-status-signed-action {
  flex: 1 0;
  width: 100px;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    width: 200px;
    div {
      flex-grow: 0;
    }
  }
}

.order-status {
  width: 100px;
  flex: 1 0;
}
.order-signed {
  width: 100px;
  flex: 1 0;
}

.order-actions {
  flex: 0 1;
  width: 100+100px;
}

.order-sign {
  width: 100px;
  flex: 1 0;
}
.order-view {
  width: 100px;
  flex: 1 0;
}

button {
  margin-left: 10px;
  width: 100px;
}

.approve:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

.reject:active {
  background-color: red;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

.approve {
  background: green;
  color: #ffff;
}

.reject {
  background: red;
  color: #ffff;
}
</style>
