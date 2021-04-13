<template>
  <div class="container position-relative">

    <router-link
      :to="{ name: 'procurer-order', params: { id: orderId } }"
      class="stretched-link"
      v-if='isProcurer'
    ></router-link>

    <router-link
      :to="{ name: 'supplier-order', params: { id: orderId } }"
      class="stretched-link"
      v-if='isSupplier'
    ></router-link>

    <router-link
      :to="{ name: 'courier-order', params: { id: orderId } }"
      class="stretched-link"
      v-if='isCourier'
    ></router-link>

    <div class="order_details">
      <h5>Purchase Order {{ orderId }}</h5>
      <h5 style="margin-left:15px; margin-top: 4px;padding-left:15px; border-left: solid 1px darkgrey; font-size:15px; color: grey" > {{order_msg}} </h5>
      <h5 style="margin-left: auto; color:red"> {{status}} </h5>
    </div>
    <Hr style="margin-top: 0px"></hr>
    <div style="display: flex;">
      <div class="product_description" style="display: flex; margin-top: 0px; width: 70%">
        <div class="product_image">
          <img :src="this.product.imageurl"/>
        </div>
        <div class="product_details" style="margin-left: 15px;">
          <h5 style="margin-bottom: 15px"> {{ productName }} </h5>
          <div style="margin-bottom: 15px;">
            <span style="color: grey">Date Created:  </span> 
            <span> {{dateCreated}} </span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: grey">Supplier:  </span> 
            <span> {{supplierName}} </span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: grey">Procurer:  </span> 
            <span> {{procurerName}} </span>
          </div>
          <div v-if="isSupplier && isInternalApproved" style="margin-bottom: 15px; display:flex; z-index: 2; position: relative;">
            <span style="color: grey; margin-top: 4px;">Courier:  </span>
            <b-form-select size="sm" style="margin-left: 7px;" v-model="courier" :options="couriers"></b-form-select>
          </div>
          <div v-else-if="isSupplierApproved || isDelivering || isCourierAssigned || isDelivered" style="margin-bottom: 15px; display:flex">
            <span style="color: grey;">Courier:  </span>
            <span style="margin-left: 5px"> {{courierName}} </span>
          </div>
        </div>
      </div>
      <div class="subtotal" style="width: 30%; display:inline-block; align-self: flex-end; margin-bottom: 0px;">
        <div style="float: right">
          <span style="color: grey">Order Total:  </span> 
          <span style="font-size: 30px"> {{price}} Tokens</span>
        </div>
      </div>
    </div>
    <div v-if="isProcurer && isFinance && isOrdered" style="float: right;">
      <b-button class="approve" @click="ProcurerApprovePurchaseOrder(orderId)">
        Approve
      </b-button>
      <b-button class="reject" @click="ProcurerRejectPurchaseOrder(orderId)">
        Reject
      </b-button>
    </div>
    <div v-else-if="isSupplier && isInternalApproved" style="float: right; ">
      <b-button class="approve" @click="SupplierApprovePurchaseOrderandAssignCourier(orderId)">
        Approve
      </b-button>
      <b-button class="reject" @click="SupplierRejectPurchaseOrder(orderId)">
        Reject
      </b-button>
    </div>
    <div v-else-if="isCourier && isCourierAssigned" style="float: right;">
      <b-button class="approve" @click="CourierDelivering(orderId)">
        Delivering
      </b-button>
    </div>
    <div v-else-if="isProcurer && !isFinance && isDelivering" style="float: right;">
      <b-button class="approve" @click="ProcurerReceivedOrder(orderId)">
        Received
      </b-button>
    </div>
    <div v-else-if="isProcurer && !isFinance && isDelivered" style="float: right; display:flex">
      <StarRating 
        :read-only='rated'
        v-model="rating"
        v-bind:increment="1"
        v-bind:show-rating="false"
        v-bind:star-size="14"
        v-bind:padding="1"
        v-bind:border-width="7" 
        active-color="gold" 
        border-color="gold"
        inactive-color="#FFF"
        style="margin-top: 10px; z-index: 2; position: relative;">
      </StarRating>
      <b-button v-if='!rated' :disabled='rating == 0' class="approve" @click="ProcurerAddRating(orderId)" style="margin-left: 15px;">
        Rate
      </b-button>
    </div>
    <div v-else-if="isSupplier && isDelivered" style="float: right; display:flex">
        <StarRating 
          :read-only='true'
          v-model="rating"
          v-bind:increment="1"
          v-bind:show-rating="false"
          v-bind:star-size="14"
          v-bind:padding="1"
          v-bind:border-width="7" 
          active-color="gold" 
          border-color="gold"
          inactive-color="#FFF"
          style="margin-top: 10px;">
        </StarRating>
    </div>
  </div> 
</template>
 
<script>
import Procurer from "../../api/Procurer";
import Supplier from "../../api/Supplier";
import Courier from "../../api/Courier";
import Market from '../../api/Market';
import StarRating from 'vue-star-rating';

export default {
  components: {
    StarRating,
  },

  props: {
    courierName: String,
    dateCreated: String,
    employeeType: String,
    orderId: String,
    price: String,
    procurerName: String,
    productId: String,
    productName: String,
    quantity: String,
    status: String,
    supplierName: String,
    rating: Number,
    rated: Boolean
  },
  data() {
    return {
      isFinance: this.employeeType == "finance",
      isInternalApproved: this.status == "Internal Approved",
      isOrdered: this.status == "Ordered",
      isSupplierApproved: this.status == "Supplier Approved",
      isSupplierRejected: this.status == "Supplier Rejected",
      isCourierAssigned: this.status == "Courier Assigned",
      isDelivering: this.status == "Delivering",
      isDelivered: this.status == "Delivered",
      isSupplier: "",
      isProcurer: "",
      isCourier: "",
      couriers: [{ value: null, text: 'Select Courier', disabled: true, selected: true}],
      courier: null,
      product: {}
    };
  },
  computed: {
    order_msg: function() {
      if (this.isOrdered) {
        return "Awaiting Approval from Finance Department";
      }
      else if (this.isInternalApproved) {
        return "Awaiting Approval from Supplier";
      }
      else if (this.status == "isInternalRejected") {
        return "Order Rejected, Contact Finance Department"
      }
      else if (this.status == "Supplier Approved") {
        return "Awaiting Approval from Courier";
      }
      else if (this.status == "Supplier Rejected") {
        return "Order Rejected, Contact Supplier"
      }
      else if (this.status == "Courier Assigned") {
        return "Order Ready to be Delivered"
      }
      else if (this.status == "Delivering") {
        return "Order Delivering"
      }
      else if (this.status == "Delivered") {
        return "Order Delivered"
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
    },
    async loadProduct() {
      const result = await Market.viewProduct(this.productId);
      this.product = result.data;
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
        this.$router.go(0);
      }
      catch(e) {
        console.log(e.response.data);
        alert(e.response.data.reason);
      }
    },
    async SupplierFetchCouriers() {
      const result = await Supplier.getCouriers();
      // console.log(this.$store.state.details.role);
      const couriers = [];
      result.data.forEach(x => couriers.push({'text': x['name'], 'value': x['address']}));
      // console.log('couriers', couriers);
      this.couriers = this.couriers.concat(couriers);
    },

    async SupplierAssignCourier(orderId, courier) {
      try {
        const result = await Supplier.assignCourier(orderId, courier, this.$store.state.details.address);
        console.log('assign courier:', result.data);
        alert('Assigned courier');
        this.$router.go(0);
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
        this.$router.go(0);
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
    this.loadProduct();
    if (this.isSupplier) {
      this.SupplierFetchCouriers();
    }
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
  margin-top: 20px;
  transition: all 0.5s;
}

.container:hover {
  box-shadow: 0 4px 6px 0 gray;
}

/* .product_description {
} */

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
  margin-top: 5px;
  z-index: 2;
  position: relative;
}

.approve:hover {
  background-color: #64af3d;
}

.reject {
  display: inline-block;
  color: rgba(255, 0, 0, 0.726);
  background-color: white;
  font-size: 20px;
  padding: 7px 20px;
  transition: all 0.5s;
  border: none;
  width: 125px;
  margin-left: 5px;
  margin-top: 5px;
  z-index: 2;
  position: relative;
}

.reject:hover {
  background-color: red;
  color: white;
}

.product_details {
  width: 50%;
}

.product_image {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
