<template>
  <div class="card product_item">
    <div class="body">
      <!-- <div class="cp_img">
        <img src="../../assets/dell_computer.jpeg" alt="Product" />
      </div> -->
      <div class="product_details">
        <router-link
          :to="{
            name: 'product',
            params: {
              product_id: product_id,
              product_name: product_name,
              product_price: product_price,
            },
          }"
        >
          {{ product_name }}
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
    product_id: String,
    product_name: String,
    product_price: String,
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

.product_item .product_details .product_price {
  margin: 0;
}
</style>
