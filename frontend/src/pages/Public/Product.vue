<template>
  <div class="container mt-5">

    <Navbar></Navbar>

    <div class="left-column">
      <div class="product_image">
        <img :src="this.product.imageurl"/>
      </div>
      <div class="product-description">
        <h4>{{ this.product.productName }}</h4>
      <div class="rating-header">
          <StarRating 
            v-bind:rating=this.product.rating
            v-bind:read-only="true"
            v-bind:increment="0.5"
            v-bind:show-rating="false"
            v-bind:star-size="8"
            v-bind:padding="1"
            v-bind:border-width="5" 
            active-color="gold" 
            border-color="gold"
            inactive-color="#FFF">
          </StarRating>
        <span style="border-left: solid 1px darkgrey; margin-left: 10px; padding-left:10px"> {{this.product.ratings}} Ratings </span>
        <span style="border-left: solid 1px darkgrey; margin-left: 10px; padding-left:10px"> {{this.product.numSold}} Sold </span>
      </div>
        <div style="margin-top: 15px">
          <span style="color: grey">Supplier:  </span> 
          <span> {{this.product.supplierName}} </span>
        </div>

        <p style="margin-top: 15px;">
          {{ this.product.description }}
        </p> 
      </div>
    </div>

    <div class="right-column">
      <h4>Prospective Payment</h4>
      <div style="margin-bottom: 15px">
        <span style="color: grey">Courier Fee:  </span> 
        <span style="float:right"> 50 Tokens </span>
      </div>
      <div style="margin-bottom: 15px">
        <span style="color: grey">Item Price:  </span> 
        <span style="float:right"> {{qty*this.product.price}} Tokens </span>
      </div>
      <div style="margin-bottom: 40px">
          <span style="color: grey">Quantity:  </span> 
          <b-form-input style="margin-bottom: 10px; float:right; width: 110px;"
            type="number"
            id="quantity"
            v-model="qty"
            value="1"
            min="1"
          ></b-form-input>
      </div>
      <Hr></hr>
      <div style="margin-bottom: 30px;">
        <span style="color: grey; padding-top: 10px;">Total Payment:  </span> 
        <span style="float:right; font-size: 25px; color: #7dc855"> {{qty*this.product.price + 50}} Tokens </span>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Market from "../../api/Market"
import StarRating from 'vue-star-rating'
export default {
  data() {
    return {
      details: {},
      product: {},
      qty: "1",
    };
  },
  components: {
    Navbar,
    StarRating,
  },
  methods: {
    async loadPage() {
      const result = await Market.viewProduct(this.$route.params.productId);
      this.product = result.data;
    },
  },
  mounted() {
    this.loadPage();
  }
};

</script>

<style scoped>
/* Basic Styling */
.container {
  margin: 0 auto;
  padding: 15px;
  display: flex;
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

.product-description h4{
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

.rating-header{
  display: flex;
}

</style>
