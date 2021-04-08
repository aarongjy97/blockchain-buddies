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
        <ul class="product_price list-unstyled">
          <li class="old_price">Supplier: {{ supplier_name }}</li>
          <li class="old_price">Price: {{ product_price }} Tokens</li>
          <li class="old_price">Quantity: {{ quantity }}</li>
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
    supplier_name: String,
    quantity: String,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
body {
  background-color: #f4f7f6;
}

.product_item .product_details .product_price {
  margin: 5px;
}

.body {
  margin: 20px;
}

.product_item {
  width: 300px;
  margin-top: 10px;
}
</style>
