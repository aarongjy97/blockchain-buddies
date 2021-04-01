<template>
  <div class="table-wrapper">
    <div class="table-row table-header">
      <div class="col-wrapper order-date-number-po">
        <div class="table-col order-date">Date</div>
        <div class="table-col order-number">Purchase Order #</div>
      </div>

      <div class="col-wrapper order-supplier-product-price">
        <div class="col-wrapper order-supplier-product">
          <div class="table-col order-supplier">Supplier #</div>
          <div class="table-col order-product">Product #</div>
        </div>
        <div class="table-col order-price">Price</div>
      </div>

      <div class="col-wrapper order-status-signed">
        <div class="table-col order-status">Status</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
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

.order-status-signed {
  flex: 0 1;
  width: 100+100px;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    width: 100px;
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
