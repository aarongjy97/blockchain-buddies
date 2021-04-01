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
              {{ "returned address idky need fix" }}
            </div>
            <div class="table-col order-product">{{ product_id }}</div>
          </div>
          <div class="table-col order-price">{{ product_price }}</div>
        </div>

        <div class="col-wrapper order-status-signed-action">
          <div class="table-col order-status">{{ po_status }}</div>
          <div v-if="isFinance" class="table-col order-status">
            <b-button v-if="isNotApproved" v-on:click="approvePurchaseOrder">Approval Required (Click)</b-button>
          </div>
          <div v-else class="table-col order-status">
            Requires Approval from Finance Team
          </div>
        </div>
        <!-- 
        <div class="col-wrapper order-actions">
          <div class="table-col order-actions">hello</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Procurer from "../../api/Procurer";

export default {
  props: {
    product_id: String,
    supplier_id: String,
    product_price: String,
    product_quantity: String,
    po_date: String,
    po_status: String,
    po_OrderId: String,
    employeeType: String,
  },
  data() {
    return {
      isFinance: this.employeeType == "finance" ? true : false,
      isNotApproved: this.po_status == "Internal Approved" ? false : true,
    };
  },
  methods: {
    async approvePurchaseOrder() {
      try {
        await Procurer.approvePurchaseOrder(
          this.product_id,
          this.$store.state.details.address
        );
        alert('Approved');
      } catch (err) {
        console.log(err);
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
</style>
