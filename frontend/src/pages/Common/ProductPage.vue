<template>
  <main class="container">
    <!-- Left Column / Headphones Image -->
    <div class="left-column">
      <img src="../../assets/dell_computer.jpeg" alt="" />
    </div>

    <!-- Right Column -->
    <div class="right-column">
      <!-- Product Description -->
      <div class="product-description">
        <h1>{{ this.$route.params.product_name }}</h1>
        <p>
          {{ this.$route.params.product_desc }}
        </p>
      </div>
      <!-- Product Pricing -->
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
  </main>
</template>

<script>
import Procurer from "../../api/Procurer"
export default {
  data() {
    return {
      qty: '',
    };
  },
  methods: {
    async createPurchaseOrder() {
      try {
        const details = this.$store.state.details;
        console.log('productId', this.$route.params.product_id);
        console.log('quantity:', this.qty);
        console.log('price:', this.$route.params.product_price);
        console.log('details:', details.address);
        const result = await Procurer.createPurchaseOrder(this.$route.params.product_id, this.qty, this.$route.params.product_price*this.qty, details.address)
        console.log(result.data)
        alert("Purchase Order Created")
        this.$router.back();
      }
      catch(e) {
        alert(e.response.data.reason);
      }
    }
  }
};

</script>

<style>
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
}

/* Columns */
.left-column {
  width: 50%;
  position: relative;
}

.right-column {
  width: 50%;
  margin-top: 60px;
}

/* Left Column */
.left-column img {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 1;
  transition: all 0.3s ease;
}

/* Product Description */
.product-description {
  border-bottom: 1px solid #e1e8ee;
  margin-bottom: 20px;
}
.product-description span {
  font-size: 12px;
  color: #358ed7;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
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
 margin: auto;
}
</style>
