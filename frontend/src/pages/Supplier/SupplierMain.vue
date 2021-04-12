<template>
<div>
  <Navbar></Navbar>
  <h3 style="text-align: center">Listed Products</h3>

  <b-tabs content-class="mt-4" align="center">

    <b-tab title="All Products" active>
      <b-container v-if='products.length' fluid>
        <b-row align-h='center'>
          <b-card-group deck v-for="product in products" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3 mt-3 mb-3">
            <b-card v-if='product.listed'>
              <b-card-body>
                <div style="min-height: 250px;" class="d-flex justify-content-center align-items-center"> 
                  <img class="w-100" :src="product.imageurl" alt="https://picsum.photos/600/300/?image=25">
                </div>
              </b-card-body>
              <b-card-title>{{ product.productName }}</b-card-title>
              <template #footer>
                <b-row class='mt-n4'>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.quantity }}</span> Qty</b-col>
                  <b-col class='text-right'><span class='price' style="font-weight: bold">{{ product.price }}</span> Tokens</b-col>
                </b-row>
                <b-row>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.numSold }}</span> Sold</b-col>
                  <b-col v-if='product.rating > 0' class="text-right ml-5 pl-5 pt-1">
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
                <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
              </template>
            </b-card>
            <b-card v-if='!product.listed' class="unlistedcard">
              <b-card-body>
                <div style="min-height: 250px;" class="d-flex justify-content-center align-items-center"> 
                  <img class="w-100" :src="product.imageurl" alt="https://picsum.photos/600/300/?image=25">
                </div>
              </b-card-body>
              <b-card-title>{{ product.productName }}</b-card-title>
              <template #footer>
                <b-row class='mt-n4'>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.quantity }}</span> Qty</b-col>
                  <b-col class='text-right'><span class='price' style="font-weight: bold">{{ product.price }}</span> Tokens</b-col>
                </b-row>
                <b-row>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.numSold }}</span> Sold</b-col>
                  <b-col v-if='product.rating > 0' class="text-right ml-5 pl-5 pt-1">
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
                <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
              </template>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <div v-else class="d-flex justify-content-center">
        <span style="text-align: center;">
          No Products Listed
        </span>
      </div>
    </b-tab>

    <b-tab title="Listed Products">
      <b-container v-if='listedProducts.length' fluid>
        <b-row align-h='center'>
          <b-card-group deck v-for="product in listedProducts" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3">
            <b-card>
              <b-card-body>
                <div style="min-height: 250px;" class="d-flex justify-content-center align-items-center"> 
                  <img class="w-100" :src="product.imageurl" alt="https://picsum.photos/600/300/?image=25">
                </div>
              </b-card-body>
              <b-card-title>{{ product.productName }}</b-card-title>
              <template #footer>
                <b-row class='mt-n4'>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.quantity }}</span> Qty</b-col>
                  <b-col class='text-right'><span class='price' style="font-weight: bold">{{ product.price }}</span> Tokens</b-col>
                </b-row>
                <b-row>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.numSold }}</span> Sold</b-col>
                  <b-col v-if='product.rating > 0' class="text-right ml-5 pl-5 pt-1">
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
                <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
              </template>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <div v-else class="d-flex justify-content-center">
        <span style="text-align: center;">
          No Products Listed
        </span>
      </div>
    </b-tab>

    <b-tab title="Unlisted Products">
      <b-container v-if='unlistedProducts.length' fluid>
        <b-row align-h='center'>
          <b-card-group deck v-for="product in unlistedProducts" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3 mt-3 mb-3">
            <b-card v-if='!product.listed' class="unlistedcard">
              <b-card-body>
                <div style="min-height: 250px;" class="d-flex justify-content-center align-items-center"> 
                  <img class="w-100" :src="product.imageurl" alt="https://picsum.photos/600/300/?image=25">
                </div>
              </b-card-body>
              <b-card-title>{{ product.productName }}</b-card-title>
              <template #footer>
                <b-row class='mt-n4'>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.quantity }}</span> Qty</b-col>
                  <b-col class='text-right'><span class='price' style="font-weight: bold">{{ product.price }}</span> Tokens</b-col>
                </b-row>
                <b-row>
                  <b-col class='text-left'><span style="font-weight: bold">{{ product.numSold }}</span> Sold</b-col>
                  <b-col v-if='product.rating > 0' class="text-right ml-5 pl-5 pt-1">
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
                <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
              </template>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <div v-else class="d-flex justify-content-center">
        <span style="text-align: center;">
          No Products Unlisted
        </span>
      </div>
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
import StarRating from 'vue-star-rating';

export default {
  name: "SupplierMain",
  data() {
    return {
      details: {},
      products: [],
      listedProducts: [],
      unlistedProducts: [],
    };
  },
  methods: {
    async viewAll() {
      try{
        const details = this.$store.state.details;
        this.details = details;
        console.log('details:', details);

        const result = await Supplier.viewAllSelfProducts(details.address);
        console.log('products:', result.data);

        this.products = result.data.map(p => ({
          description: p.description,
          listed: p.listed,
          numSold: p.numSold,
          price: p.price,
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantityAvailable,
          rating: p.rating,
          imageurl: p.imageurl
        }));

        this.products.forEach(x => {
          if (x.listed) {
            this.listedProducts.push(x);
          }
          else if (!x.listed) {
            this.unlistedProducts.push(x);
          }
        });
        console.log('notListed',this.unlistedProducts);
      }
      catch (err) {
        console.log(err)
      }
    },
  },
  components: {
    Navbar,
    StarRating,
  },
  mounted() {
    this.viewAll();
  },
};
</script>

<style>
.price {
  /* font-size: 1.05rem; */
  color: #ee4d2d;
}

.tabs .nav-tabs {
  border-bottom: unset !important;
}

.nav-tabs .nav-link {
  border: unset;
  border-bottom-right-radius: .25rem;
  border-bottom-left-radius: .25rem;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  border-color: unset !important;
  color: white;
}

.rating {
  color: #ffce3d;
}

.card {
  max-width: 20rem;
}

.unlistedcard {
  background-color: gainsboro;
}

.card-footer {
  background: transparent;
  border-top: 0px;
}

.card:hover{
  /* transform: scale(1); */
  /* box-shadow: 0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06); */
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
}
</style>