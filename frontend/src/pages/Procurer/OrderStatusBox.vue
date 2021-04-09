<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="order_details" style="">
      <h5>Purchase Order {{ po_OrderId }}</h5>
      <h5 style="margin-left:15px; margin-top: 4px;padding-left:15px; border-left: solid 1px darkgrey; font-size:15px; color: grey" > {{order_msg}} </h5>
      <h5 style="margin-left: auto; color:red"> {{po_status}} </h5>
    </div>
    <Hr></hr>
    <div style="display: flex;">
      <div class="product_description" style="display: flex; margin-top: 10px; width: 75%">
        <div class="product_image">
          <img src="https://picsum.photos/600/300/?image=25" alt="" />
        </div>
        <div class="product_details" style="margin-left: 15px;">
          <h5 style="margin-bottom: 15px"> {{ product_name }} </h5>
          <div style="margin-bottom: 15px;">
            <span style="color: grey">Date Created:  </span> 
            <span> {{po_date}} </span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: grey">Supplier:  </span> 
            <span> {{supplier_name}} </span>
          </div>
          <div style="margin-bottom: 15px">
            <span style="color: grey">Courier:  </span> 
            <span> Ninja </span>
          </div>
        </div>
      </div>
      <div class="subtotal" style="width: 25%; display:inline-block; align-self: flex-end; margin-bottom: 5px;">
        <div style="float: right">
          <span style="color: grey">Order Total:  </span> 
          <span style="font-size: 30px"> {{product_price * product_quantity + 7}} Tokens</span>
        </div>
      </div>
    </div>
  <div v-if="isFinance && isOrdered" class="table-col order-status" style="float: right; border: ">
    <button class="approve" @click="approvePurchaseOrder(po_OrderId)">
      Approve
    </button>
    <button class="reject" @click="rejectPurchaseOrder(po_OrderId)">
      Reject
    </button>
  </div>
  <div
    v-else-if="!isFinance && isDelivering"
    class="table-col order-status"
  >
    <button class="approve" @click="receivedOrder(po_OrderId)">
      Received
    </button>
  </div>

    <!-- <div class="right-column">
      <h4> Purchase Order Info </h4>
      <div style="margin-bottom: 15px">
        <span style="color: grey">Commission Fee: </span> 
        <span style="float: right"> 5 Tokens </span>
      </div>
      <div style="margin-bottom: 15px">
        <span style="color: grey">Courier Fee:  </span> 
        <span style="float:right"> 2 Tokens </span>
      </div>
      <div style="margin-bottom: 30px;">
        <span style="color: grey; padding-top: 10px;">Total Payment:  </span> 
        <span style="float:right; font-size: 25px; color: #7dc855"> Tokens </span>
      </div>
      <Hr></hr>
      <div style="margin-bottom: 40px">
          <span style="color: grey">Input Quantity:  </span> 
          <b-form-input style="margin-bottom: 10px; float:right; width: 110px;"
            type="number"
            id="quantity"
            v-model="qty"
            value="1"
          ></b-form-input>
        </div>
      <button style="float:right" v-on:click="createPurchaseOrder" class="cart-btn">Create Order</button>
    </div>-->
  </div> 
</template>
  <!-- <div>
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
            <button class="approve" @click="approvePurchaseOrder(po_OrderId)">
              Approve
            </button>
            <button class="reject" @click="rejectPurchaseOrder(po_OrderId)">
              Reject
            </button>
          </div>
          <div
            v-else-if="!isFinance && isDelivering"
            class="table-col order-status"
          >
            <button class="approve" @click="receivedOrder(po_OrderId)">
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
</template> -->

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
  computed: {
    order_msg: function() {
      if (this.isOrdered) {
        return "Awaiting approval from finance department";
      }
      else if (this.isInternalApproved) {
        return "Awaiting approval from supplier";
      }
      else {
        return "";
      }
    }
  },
  methods: {
    async approvePurchaseOrder(orderId) {
      try {
        await Procurer.approvePurchaseOrder(
          orderId,
          this.$store.state.details.address
        );
        alert("Order approved");
        this.$router.go(0);
      } catch (err) {
        console.log(err);
      }
    },
    async rejectPurchaseOrder(orderId) {
      try {
        await Procurer.rejectPurchaseOrder(
          orderId,
          this.$store.state.details.address
        );
        alert("Order rejected");
        this.$router.go();
      } catch (err) {
        console.log(err);
      }
    },
    async receivedOrder(orderId) {
      try {
        await Procurer.deliveredByCourier(
          orderId,
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
.container {
  margin: 0 auto;
  padding: 15px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  width: auto;
  height: 300px;
}

.product_description {
}

.product_description img {
  width: 200px;
}

.cart-btn {
  display: inline-block;
  background-color: #7dc855;
  font-size: 20px;
  color: #ffffff;
  padding: 10px 20px;
  transition: all 0.5s;
  border: none;
}

.cart-btn:hover {
  background-color: #64af3d;
}

.rating-header{
  display: flex;
}

.order_details {
  display: flex;
}

.approve {
  display: inline-block;
  background-color: #7dc855;
  font-size: 20px;
  color: #ffffff;
  padding: 7px 20px;
  transition: all 0.5s;
  border: none;
  width: 120px;
}

.approve:hover {
  background-color: #64af3d;
}

.reject {
  display: inline-block;
  background-color: red;
  font-size: 20px;
  color: #ffffff;
  padding: 7px 20px;
  transition: all 0.5s;
  border: none;
  width: 120px;
}

.reject:hover {
  background-color: red;
}
</style>
