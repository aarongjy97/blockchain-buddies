<template>
  <div class="container">
    <h3 style="text-align: center;">Order Details</h3>

    <div id="order" class="container order">
      <div id="stakeholders">
        <div class="container">
          <b-row>
            <b-col class="d-flex flex-column justify-content-center align-items-center">
              <!-- Procurer -->
              <h5>Procurer</h5>
              <span>{{ this.order.procurerName }}</span>
              <span>{{ this.order.procurerLogisticsEmployeeName }}</span>
            </b-col>
            <b-col class="d-flex flex-column justify-content-center align-items-center">
              <!-- -->
              <h5>Supplier</h5>
              <span>{{ this.order.supplierName }}</span>
              <span v-if='this.order.supplierEmployeeName'>{{ this.order.supplierEmployeeName }}</span>
            </b-col>
            <b-col class="d-flex flex-column justify-content-center align-items-center">
              <h5>Courier</h5>
              <div v-if='this.order.courierName' class="d-flex flex-column justify-content-center align-items-center">
                <span>{{ this.order.courierName }}</span>
                <span v-if='this.order.courierEmployeeName'>{{ this.order.courierEmployeeName }}</span>
              </div>
              <div v-else class="d-flex flex-column justify-content-center align-items-center">
                <span>Unassigned</span>
              </div>
            </b-col>
          </b-row>
          <b-row class="d-flex flex-column justify-content-center align-items-center mt-4">
            <h5>Status</h5>
            <span>{{this.order.status}}</span>
          </b-row>
          <b-row class="d-flex flex-column justify-content-center align-items-center mt-4">
            <div v-if="isProcurer && !isFinance && isDelivered" class="d-flex flex-column justify-content-center align-items-center">
              <h5>Rating</h5>
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
                style="margin-top: 10px;">
              </StarRating>
              <b-button v-if='!rated' :disabled='rating == 0' class="approve mt-3" @click="ProcurerAddRating(orderId)">
                Rate
              </b-button>
            </div>
            <div v-else-if="isSupplier && isDelivered" class="d-flex flex-column justify-content-center align-items-center">
                <h5>Rating</h5>
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
          </b-row>
        </div>
      </div>

      <Hr style="margin-top: 20px; width: 100%"></hr>

      <div id="product" class="container d-flex flex-row mt-3">
        <div class="product_image">
          <img :src="this.product.imageurl" alt="" />
        </div>
        <div class="product-description">
          <h4>{{ this.product.productName }}</h4>
          <div class="rating-header">
            <StarRating
              v-bind:rating="this.product.rating"
              v-bind:read-only="true"
              v-bind:increment="0.5"
              v-bind:show-rating="false"
              v-bind:star-size="8"
              v-bind:padding="1"
              v-bind:border-width="5"
              active-color="gold"
              border-color="gold"
              inactive-color="#FFF"
            >
            </StarRating>
            <span
              style="border-left: solid 1px darkgrey; margin-left: 10px; padding-left:10px"
            >
              {{ this.product.ratings }} Ratings
            </span>
            <span
              style="border-left: solid 1px darkgrey; margin-left: 10px; padding-left:10px"
            >
              {{ this.product.numSold }} Sold
            </span>
          </div>
          <div style="margin-top: 15px">
            <span style="color: grey">Supplier: </span>
            <span> {{ this.product.supplierName }} </span>
          </div>

          <p style="margin-top: 15px;">
            {{ this.product.description }}
          </p>
        </div>
      </div>

      <Hr style="margin-top: 20px; width: 100%"></hr>

      <div id="cost">
        <b-row>
          <b-col cols="8" class="d-flex flex-column justify-content-center align-items-center">
            <h5>Summary</h5>
            <!-- Product Price --> 
            <span>
              {{this.order.quantity}} x {{this.product.productName}}
            </span>
            <!-- Courier Fee --> 
            <span>
              Courier Fee
            </span>
            <!-- Total -->
            <h5 class="mt-5">
              Total:
            </h5>
          </b-col>
          <b-col cols="4" class="d-flex flex-column justify-content-center align-items-center">
            <h5>Price</h5>
            <!-- Product Price --> 
            <span>
              {{this.order.quantity * this.product.price}}
            </span>
            <!-- Courier Fee --> 
            <span>
              50
            </span>
            <!-- Total -->
            <!-- Total -->
            <h5 class="mt-5">
              {{ this.order.price }}
            </h5>
          </b-col>
        </b-row>
      </div>

      <div id="action" class="container mt-4">
        <div v-if="isSupplier && isInternalApproved" style="margin-bottom: 15px; display:flex">
          <span style="color: grey; margin-top: 4px;">Courier:  </span>
          <b-form-select size="sm" style="margin-left: 7px;" v-model="courier" :options="couriers"></b-form-select>
        </div>

        <!-- Procurer Finance -->
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
      </div>

    </div>
  </div>
</template>

<script>
import Procurer from "../../api/Procurer";
import Supplier from "../../api/Supplier";
import Courier from "../../api/Courier";
import Market from "../../api/Market";
import StarRating from "vue-star-rating";

export default {
  name: "purchase-order",
  data() {
    return {
      details: {},
      product: {},
      order: {},
      orderId: "",
      rating: 0,
      rated: false,
      isProcurer: false,
      isSupplier: false,
      isCourier: false,
      isFinance: false,
      couriers: [{ value: null, text: 'Select Courier', disabled: true, selected: true}],
      courier: null,
      isInternalApproved: false,
      isOrdered: false,
      isSupplierApproved: false,
      isSupplierRejected: false,
      isCourierAssigned: false,
      isDelivering: false,
      isDelivered: false,
    };
  },
  components: {
    StarRating,
  },
  methods: {
    async loadPage() {
      this.details = this.$store.state.details;

      try {
        if (this.details.role == "procurer") {
          const order = await Procurer.viewPurchaseOrder(
            this.$route.params.id,
            this.details.address
          );
          this.order = order.data;
          this.isProcurer = true;
          if (this.details.employeetype == "finance") {
            this.isFinance = true;
          }
        } else if (this.details.role == "supplier") {
          const order = await Supplier.viewPurchaseOrder(
            this.$route.params.id,
            this.details.address
          );
          this.order = order.data;
          this.isSupplier = true;
          this.SupplierFetchCouriers();
        } else if (this.details.role == "courier") {
          const order = await Courier.viewPurchaseOrder(
            this.$route.params.id,
            this.details.address
          );
          this.order = order.data;
          this.isCourier = true;
        }

        const product = await Market.viewProduct(this.order.productId);
        this.product = product.data;
        this.orderId = this.order.orderId;

        this.isInternalApproved = this.order.status == "Internal Approved";
        this.isOrdered = this.order.status == "Ordered";
        this.isSupplierApproved = this.order.status == "Supplier Approved";
        this.isSupplierRejected = this.order.status == "Supplier Rejected";
        this.isCourierAssigned = this.order.status == "Courier Assigned";
        this.isDelivering = this.order.status == "Delivering";
        this.isDelivered = this.order.status == "Delivered";

        this.rated = this.order.rating > 0;

        if(this.rated) {
          this.rating = this.order.rating;
        }

      } catch (error) {
        console.log(error);
      }
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
      const couriers = [];
      result.data.forEach(x => couriers.push({'text': x['name'], 'value': x['address']}));
      this.couriers = this.couriers.concat(couriers);
      console.log(this.couriers);
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
    this.loadPage();
  },
};
</script>

<style>
.order {
  margin: 0 auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
}

/* Columns */
.left-column {
  width: 72.5%;
  position: relative;
  display: flex;
  border-right: solid 2px lightgrey;
}

.right-column {
  width: 27.5%;
  margin: 0px 0px 0px 20px;
}

.right-column h4 {
  text-align: center;
  margin-bottom: 20px;
}

.product_image {
  margin: auto;
}

.product_image img {
  width: 300px;
}

.product-description {
  margin: 0px 0px 0px 20px;
}

.product-description h4 {
  margin: 0px 0px 10px 0px;
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

.rating-header {
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
}

.reject:hover {
  background-color: red;
  color: white;
}
</style>
