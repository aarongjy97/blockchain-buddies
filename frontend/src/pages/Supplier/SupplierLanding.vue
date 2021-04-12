<template>
  <div class="body">
    <Navbar></Navbar>
    
    <b-container v-if="products.length" fluid>
      <h3 align='center'>Products</h3>
      <br />
      <b-row align-h="center">
        <b-card-group
          deck
          v-for="product in listedProducts"
          :key="product.productId"
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <b-card
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Image"
            img-top
            class="mb-4"
          >
            <b-card-title>{{ product.productName }}</b-card-title>
            <template #footer>
              <b-row class="mt-n4">
                <b-col class="text-left"
                  ><span style="font-weight: bold">{{ product.quantity }}</span>
                  Qty</b-col
                >
                <b-col class="text-right"
                  ><span class="price" style="font-weight: bold">{{
                    product.price
                  }}</span>
                  Tokens</b-col
                >
              </b-row>
              <b-row>
                <b-col class="text-left"
                  ><span style="font-weight: bold">{{ product.numSold }}</span>
                  Sold</b-col
                >
                <b-col v-if="product.rating > 0" class="text-right ml-5 pl-5 pt-1">
                  <StarRating 
                    v-model="product.rating"
                    v-bind:increment="1"
                    v-bind:show-rating="false"
                    v-bind:read-only="true"
                    v-bind:star-size="4"
                    v-bind:padding="1"
                    v-bind:border-width="7" 
                    active-color="gold" 
                    border-color="gold"
                    inactive-color="#FFF">
                  </StarRating>
                </b-col>
              </b-row>
              <router-link
                :to="{ name: 'supplier-viewproduct', params: product }"
                class="stretched-link"
              ></router-link>
            </template>
          </b-card>
        </b-card-group>
      </b-row>
    </b-container>
    <div v-else class="d-flex align-items-center justify-content-center flex-column">
      <h3 align='center'>Products</h3>
      <span class="mt-3" align='center'>
          No Products Listed
      </span>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Market from "../../api/Market";
import StarRating from 'vue-star-rating';

export default {
  name: "supplier-landing",
  data() {
    return {
      products: [],
      listedProducts: [],
    };
  },
  components: {
    Navbar,
    StarRating,
  },
  methods: {
    async viewAllProducts() {
      try {
        const result = await Market.viewAllProducts();
        this.products = result.data.map((p) => ({
          description: p.description,
          listed: p.listed,
          numSold: p.numSold,
          price: p.price,
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantityAvailable,
          rating: p.rating,
          supplierName: p.supplierName,
          
        }));
        console.log("product:", this.products);

        this.products.forEach((x) => {
          if (x.listed) {
            this.listedProducts.push(x);
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.viewAllProducts();
  },
};
</script>

<style scoped>
.price {
  color: #ee4d2d;
}

.rating {
  color: #ffce3d;
}

.card {
  max-width: 20rem;
}

.card-footer {
  background: transparent;
  border-top: 0px;
}

.card:hover {
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
}
</style>
