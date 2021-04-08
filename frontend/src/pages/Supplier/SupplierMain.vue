<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Product Page</h1>
  <br>

  <h2>Listed Products</h2>

  <b-container v-if='products.length' fluid>
    <b-row align-h='center'>
      <b-card-group deck v-for="product in listedProducts" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3">
        <b-card
          img-src="https://picsum.photos/600/300/?image=25"
          img-alt="Image"
          img-top
          class="mb-4"
        >
          <!-- <template #header>
            <h5 class="mb-0">{{product.productName}}</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col class='text-left'>Price: <span class='price'>{{ product.price }}</span></b-col>
              <b-col class='text-right'>Sold: {{ product.numSold }}</b-col>
            </b-row>
            <b-row>
              <b-col class='text-left'>Qty: {{ product.quantity }}</b-col>
              <b-col class='text-right'>Rating: <span class='rating'>{{ product.rating }}</span>/5 </b-col>
            </b-row>
            <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
          </b-card-text> -->
          <b-card-title>{{ product.productName }}</b-card-title>
          <template #footer>
             <b-row class='mt-n4'>
              <b-col class='text-left' cols='8'>Price: <span class='price'>{{ product.price }}</span> Tokens</b-col>
              <b-col class='text-right'>Sold: {{ product.numSold }}</b-col>
            </b-row>
            <b-row>
              <b-col class='text-left'>Qty: {{ product.quantity }}</b-col>
              <b-col class='text-right'>Rating: <span class='rating'>{{ product.rating }}</span>/5 </b-col>
            </b-row>
            <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
          </template>
        </b-card>
      </b-card-group>
    </b-row>

    <br>
    <h2>Unlisted Products</h2>
    <b-row align-h='center' v-if='notListedProducts.length'>
      <b-card-group deck v-for="product in notListedProducts" :key="product.productId" class="col-md-6 col-lg-4 col-xl-3">
        <b-card
          img-src="https://picsum.photos/600/300/?image=25"
          img-alt="Image"
          img-top
          class="mb-4"
        >
          <b-card-title>{{ product.productName }}</b-card-title>
          <template #footer>
             <b-row class='mt-n4'>
              <b-col class='text-left'>Price: <span class='price'>{{ product.price }}</span></b-col>
              <b-col class='text-right'>Sold: {{ product.numSold }}</b-col>
            </b-row>
            <b-row>
              <b-col class='text-left'>Qty: {{ product.quantity }}</b-col>
              <b-col class='text-right'>Rating: <span class='rating'>{{ product.rating }}</span>/5 </b-col>
            </b-row>
            <router-link :to="{name: 'supplier-product', params: product}" class='stretched-link'></router-link>
          </template>
        </b-card>
      </b-card-group>
    </b-row>
    <div v-else>There are no unlisted products.</div>
    <br>
  </b-container>
  
  <div v-else>There are no products listed.</div>

</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierMain",
  data() {
    return {
      details: {},
      products: [],
      listedProducts: [],
      notListedProducts: [],
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
        }));

        this.products.forEach(x => {
          if (x.listed) {
            this.listedProducts.push(x);
          }
          else if (!x.listed) {
            this.notListedProducts.push(x);
          }
        });
        console.log('notListed',this.notListedProducts);
      }
      catch (err) {
        console.log(err)
      }
    },
  },
  components: {
    Navbar,
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

.rating {
  color: #ffce3d;
}

.card {
  max-width: 20rem
}

.card-footer {
  background: transparent;
  border-top: 0px;
}

.card:hover{
  transform: scale(1);
  box-shadow: 0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
}
</style>