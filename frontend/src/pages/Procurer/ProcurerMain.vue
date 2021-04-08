<template>
<div>
  <Navbar></Navbar>
  <h1>Procurer Product Page</h1>
  <br>
    <b-container v-if='products.length' fluid>
      <b-row align-h='center'>
        <b-card-group deck v-for="product in listedProducts" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3">
          <b-card
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Image"
            img-top
            class="mb-4"
          >
            <b-card-title>{{ product.productName }}</b-card-title>
            <template #footer>
              <b-row class='mt-n4'>
                <b-col class='text-left'><span style="font-weight: bold">{{ product.quantity }}</span> Qty</b-col>
                <b-col class='text-right'><span class='price' style="font-weight: bold">{{ product.price }}</span> Tokens</b-col>
              </b-row>
              <b-row>
                <b-col class='text-left'><span style="font-weight: bold">{{ product.numSold }}</span> Sold</b-col>
                <b-col v-if='product.rating > 0' class='text-right'><span class='rating'>{{ product.rating }}</span>/5 </b-col>
              </b-row>
              <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
            </template>
          </b-card>
        </b-card-group>
      </b-row>
    </b-container>
    <div v-else>There are no products listed.</div>
</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Market from "../../api/Market";

export default {
  name: "ProcurerMain",
  data() {
    return {
      products: [],
      listedProducts: [],
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async viewAllProducts() {
      try {
        const result = await Market.viewAllProducts();
        console.log(result.data);
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

        this.products.forEach(x => {
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

.unlistedcard {
  background-color: #D3D3D3;
}

.card-footer {
  background: transparent;
  border-top: 0px;
}

.card:hover{
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
}
</style>
