<template>
  <main class="container">
    <Navbar></Navbar>

    <div class="left-column">
      <div class= "product_image">
      <img src="../../assets/dell_computer.jpeg" alt="" />
      </div>
      <div class="product-description">
        <h1>{{ this.product.productName }}</h1>
        <p>
          {{ this.$route.params.product_desc }}
        </p> 
        <span> {{this.$route.params.product_price}} Tokens </span>
        <div class="product-price">
          <b-form-input
            id="quantity"
            v-model="qty"
            placeholder="Enter Quantity"
          ></b-form-input>
          <Br></br>
          <span>${{ this.$route.params.product_price }}</span>
          <button v-on:click="createPurchaseOrder" class="cart-btn">Add to cart</button>
        </div>
      </div>
    </div>

    <div class="right-column">
      <h1> Purchase Order Info </h1>
      <div>
        <span>Total Price: {{this.$route.params.product_price}} Tokens x </span> 
      </div>
      <span>Comission: 10 Tokens </span> 
    </div>
  </main>
</template>

<script>
import Navbar from "./Navbar.vue";
import Market from "../../api/Market"
import Procurer from "../../api/Procurer";
export default {
  data() {
    return {
      details: {},
      product: {},
      qty: '',
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async loadPage() {
      this.details = this.$store.state.details;
      const result = await Market.viewProduct(this.$route.params.productId);
      this.product = result.data;
      console.log(this.product);
    },
    async createPurchaseOrder() {
      const courierFee = 50;
      try {
        const result = await Procurer.createPurchaseOrder(this.product.productId, this.qty, this.product.price * this.qty + courierFee, this.details.address)
        console.log(result.data)
        alert("Purchase Order Created")
        this.$router.back();
      }
      catch(e) {
        alert(e.response.data.reason);
      }
    },
  },
  mounted() {
    this.loadPage();
  }
};

</script>

<style scoped>
/* Basic Styling */
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: "Roboto", sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  display: flex;
  border: solid black;
}

/* Columns */
.left-column {
  width: 70%;
  position: relative;
  border: solid black;
  display: flex;
}

.right-column {
  width: 30%;
  margin: 0px 0px 0px 15px;
  padding-top: 5px;
  border: solid black;
}

.right-column h1 {
  font-weight: 300;
  font-size: 30px;
  color: #43484d;
  letter-spacing: -2px;
  text-align: center;
  text-decoration: underline;
}

/* Left Column */
.left-column img {
  /* width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 1;
  transition: all 0.3s ease; */
}

/* Product Description */
.product-description {
  border-bottom: 1px solid #e1e8ee;
  margin: 20px 0px 0px 20px;
  text-align: left;
}

.product-description span {
  color: red;
  font-size: 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 800px;
}

.product-description h1 {
  font-weight: 300;
  font-size: 52px;
  color: #43484d;
  letter-spacing: -2px;
}
.product-description p {
  font-size: 16px;
  font-weight: 300;
  color: #86939e;
  line-height: 24px;
}

/* Product Price */
.product-price {
  align-items: center;
}

.product-price span {
  font-size: 26px;
  font-weight: 300;
  color: #43474d;
  margin-right: 20px;
}

.cart-btn {
  display: inline-block;
  background-color: #7dc855;
  border-radius: 6px;
  font-size: 16px;
  color: #ffffff;
  text-decoration: none;
  padding: 12px 30px;
  transition: all 0.5s;
}
.cart-btn:hover {
  background-color: #64af3d;
}

#quantity {
 width: 50%;

}

</style>
