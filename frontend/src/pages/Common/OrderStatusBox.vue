<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="order_details" style="">
      <h5>Purchase Order {{ po_OrderId }}</h5>
      <h5 style="margin-left:15px; margin-top: 4px;padding-left:15px; border-left: solid 1px darkgrey; font-size:15px; color: grey" > Details: {{order_msg}} </h5>
      <h5 style="margin-left: auto; color:red"> {{po_status}} </h5>
    </div>
    <Hr style="margin-top: 0px"></hr>
    <div style="display: flex;">
      <div class="product_description" style="display: flex; margin-top: 0px; width: 70%">
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
          <div v-if="isSupplier && isInternalApproved" style="margin-bottom: 15px; display:flex">
            <span style="color: grey; margin-top: 4px;">Courier:  </span>
            <b-form-select size="sm" style="margin-left: 7px;" v-model="courier" :options="couriers" placeholder="Select a courier"></b-form-select>
          </div>
          <div v-else-if="isSupplierApproved || isDelivering || isCourierAssigned || isDelviered" style="margin-bottom: 15px; display:flex">
            <span style="color: grey;">Courier:  </span>
            <span style="margin-left: 5px"> {{courier_name}} </span>
          </div>
        </div>
      </div>
      <div class="subtotal" style="width: 30%; display:inline-block; align-self: flex-end; margin-bottom: 0px;">
        <div style="float: right">
          <span style="color: grey">Order Total:  </span> 
          <span style="font-size: 30px"> {{product_price * product_quantity + 7}} Tokens</span>
        </div>
      </div>
    </div>
    <div v-if="isProcurer && isFinance && isOrdered" class="table-col order-status" style="float: right;">
      <button class="approve" @click="ProcurerApprovePurchaseOrder(po_OrderId)">
        Approve
      </button>
      <button class="reject" @click="ProcurerRejectPurchaseOrder(po_OrderId)">
        Reject
      </button>
    </div>
    <div v-else-if="isSupplier && isInternalApproved" class="table-col order-status" style="float: right; ">
      <button class="approve" @click="SupplierApprovePurchaseOrderandAssignCourier(po_OrderId)">
        Approve
      </button>
      <button class="reject" @click="SupplierRejectPurchaseOrder(po_OrderId)">
        Reject
      </button>
    </div>
    <div v-else-if="isCourier && isCourierAssigned" class="table-col order-status" style="float: right;">
      <button class="approve" @click="CourierDelivering(po_OrderId)">
        Delivering
      </button>
    </div>
    <div v-else-if="isProcurer && !isFinance && isDelivering" class="table-col order-status" style="float: right;">
      <button class="approve" @click="ProcurerReceivedOrder(po_OrderId)">
        Received
      </button>
    </div>
    <div v-else-if="isProcurer && !isFinance && isDelivered" class="table-col order-status" style="float: right; display:flex">
      <StarRating 
        v-model="rating"
        v-bind:increment="1"
        v-bind:show-rating="false"
        v-bind:star-size="14"
        v-bind:padding="1"
        v-bind:border-width="7" 
        active-color="gold" 
        border-color="gold"
        inactive-color="#FFF">
      </StarRating>
      <button class="approve" @click="ProcurerAddRating(po_OrderId)" style="margin-left: 15px;">
        Rate
      </button>
    </div>
  </div> 
</template>
 
<script>
import Procurer from "../../api/Procurer";
import Supplier from "../../api/Supplier";
import Courier from "../../api/Courier";
import StarRating from 'vue-star-rating';

export default {
  components: {
    StarRating,
  },

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
    courier_name: String
  },
  data() {
    return {
      isFinance: this.employeeType == "finance",
      isInternalApproved: this.po_status == "Internal Approved",
      isOrdered: this.po_status == "Ordered",
      isSupplierRejected: this.po_status == "Supplier Rejected",
      isCourierAssigned: this.po_status == "Courier Assigned",
      isDelivering: this.po_status == "Delivering",
      isDelivered: this.po_status == "Delivered",
      isSupplier: "",
      isProcurer: "",
      isCourier: "",
      couriers: [{ value: null, text: 'Please select a courier', disabled: true, selected: true}],
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
      else if (this.po_status == "isInternalRejected") {
        return "Order rejected, contact finance department"
      }
      else if (this.po_status == "Supplier Approved") {
        return "Awaiting approval from courier";
      }
      else if (this.po_status == "Supplier Rejected") {
        return "Order rejected, contact supplier"
      }
      else if (this.po_status == "Courier Assigned") {
        return "Item packed and ready to be delivered"
      }
      else if (this.po_status == "Delivering") {
        return "Item is out for delivery"
      }
      else if (this.po_status == "Delivered") {
        return "Item has been delivered"
      }
      else {
        return "" 
      }
    },
  },
  methods: {
    assignRoles() {
      var role = this.$store.state.details.role;
      this.isSupplier = role == "supplier" ? true : false;
      this.isProcurer = role == "procurer" ? true : false;
      this.isCourier = role == "courier" ? true: false;
      console.log(this.isProcurer);
    },

    async ProcurerApprovePurchaseOrder(orderId) {
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
    async ProcurerRejectPurchaseOrder(orderId) {
      try {
        await Procurer.rejectPurchaseOrder(
          orderId,
          this.$store.state.details.address
        );
        alert("Order rejected");
        this.$router.go(0);
      } catch (err) {
        console.log(err);
      }
    },
    async ProcurerReceivedOrder(orderId) {
      try {
        await Procurer.deliveredByCourier(
          orderId,
          this.$store.state.details.address
        );
        alert("Order received. Tokens have been transferred to the supplier.");
        this.$router.go(0);
      } catch (e) {
        console.log(e);
      }
    },

    async SupplierApprovePurchaseOrderandAssignCourier(orderId) {
      try {
        if (this.courier == null) {
          alert("Please assign a courier");
          return false;
        }
        const result = await Supplier.approvePurchaseOrder(orderId, this.$store.state.details.address);
        console.log('approve PO:', result.data);
        alert('Approved');
        this.$router.go();
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }

      try {
        await this.SupplierAssignCourier(orderId, this.courier);
      } catch (e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
        return false;
      }
    },

    async SupplierRejectPurchaseOrder(orderId) {
      try {
        const result = await Supplier.rejectPurchaseOrder(orderId, this.$store.state.details.address);
        console.log('reject PO:', result.data);
        alert('Rejected');
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },
    async SupplierFetchCouriers() {
      const result = await Supplier.getCouriers();
      console.log(this.$store.state.details.role);
      const couriers = [];
      result.data.forEach(x => couriers.push({'text': x['name'], 'value': x['address']}));
      console.log('couriers', couriers);
      this.couriers = this.couriers.concat(couriers);
    },

    async SupplierAssignCourier(orderId, courier) {
      try {
        const result = await Supplier.assignCourier(orderId, courier, this.$store.state.details.address);
        console.log('assign courier:', result.data);
        alert('Assigned courier');
        this.$router.go();
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },

    async CourierDelivering(orderId) {
      try {
        const result = await Courier.receivedByCourier(orderId, this.$store.state.details.address);
        console.log('courier delivering:', result.data);
        alert('Item packed and on delivery');
        this.$router.go();
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },

    async ProcurerAddRating(orderId) {
      try {
        const result = await Procurer.addRating(this.$store.state.details.address, orderId, this.rating);
        console.log('add rating:', result.data);
        alert('Rated! Thank you!');
        this.$router.go();
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    }
  },
  mounted() {
    this.assignRoles();
    this.SupplierFetchCouriers();
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 15px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  width: auto;
  height: auto;
  overflow: hidden;
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
  width: 125px;
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
  width: 125px;
}

.reject:hover {
  background-color: red;
}
</style>
