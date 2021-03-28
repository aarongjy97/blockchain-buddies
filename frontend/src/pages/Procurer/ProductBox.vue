<template>
  <div class="card product_item">
    <div class="body">
      <div class="cp_img">
        <img src="../../assets/dell_computer.jpeg" alt="Product" />
      </div>
      <div class="product_details">
        <router-link
          :to="{ name: 'product', params: { product_id: product_id } }"
        >
          {{ product_price }}
        </router-link>
        <!-- <a href="product">
          <h5>{{ product_price }}</h5>
        </a> -->
        <ul class="product_price list-unstyled">
          <li class="old_price">${{ product_price }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    supplier_id: String,
    product_id: Number,
    product_name: String,
    product_price: Number,
  },
  data() {
    return {};
  },
};
</script>

<style>
body {
  margin-top: 20px;
  background-color: #f4f7f6;
}

.product_item .cp_img {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%);
  -webkit-transform: translate(-50%);
  -ms-transform: translate(-50%);
  -moz-transform: translate(-50%);
  -o-transform: translate(-50%);
  -khtml-transform: translate(-50%);
  width: 100%;
  height: 20px;
  transition: all 0.2s ease-in-out;
}

.product_item .cp_img img {
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
}

.product_item .cp_img .hover {
  display: none;
  text-align: center;
  margin-top: 10px;
}

.product_item .product_details {
  padding-top: 70%;
  text-align: center;
}

.product_item .product_details h5 {
  margin-bottom: 5px;
}

.product_item .product_details h5 a {
  font-size: 16px;
  color: #444;
}

.product_item .product_details h5 a:hover {
  text-decoration: none;
}

.product_item .product_details .product_price {
  margin: 0;
}

.product_item .product_details .product_price li {
  display: inline-block;
  padding: 0 10px;
}

.product_item .product_details .product_price .new_price {
  font-weight: 600;
  color: #ff4136;
}

.card {
  background: #fff;
  margin-bottom: 30px;
  transition: 0.5s;
  border: 0;
  border-radius: 0.55rem;
  position: relative;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.card .body {
  font-size: 14px;
  color: #424242;
  padding: 20px;
  font-weight: 400;
}
</style>
