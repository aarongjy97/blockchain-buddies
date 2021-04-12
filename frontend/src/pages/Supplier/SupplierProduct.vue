<template>
<div>
  <Navbar></Navbar>
  <b-container fluid class='pt-5'>

    <span style="text-align: center;"><h3>Product Information</h3></span>

    <b-row class="product align-items-center">
      <b-col cols="5" class='leftside d-flex align-items-center justify-content-center'>
        <b-img :src="this.product.imageurl" fluid></b-img>
      </b-col>

      <b-col class='rightside'>
        <b-row align-h='center' class='p-3'><h4 class='productName'>{{ product.productName }}</h4></b-row>

        <b-row class='p-3'>
          <b-col>
            <div class="d-flex w-100 justify-content-between">
              <span style="color: darkgray">Description</span>
              <span v-b-modal @click='setEditType("description")' class="justify-end text-primary">Edit</span>
            </div>
            <span style="text-align: left">{{ product.description }}</span>
          </b-col>
        </b-row>

        <b-row class='p-3'>
          <b-col>
            <div class="d-flex w-100 justify-content-between">
              <span style="color: darkgray">Quantity</span>
              <span v-b-modal @click='setEditType("quantity")' class="justify-end text-primary">Edit</span>
            </div>
            <span style="text-align: left">{{ product.quantityAvailable }}</span>
          </b-col>
          <b-col>
            <div v-if='product.listed'>
              <div class="d-flex w-100 justify-content-between">
                <span style="color: darkgray">Status</span>
                <span @click='unlist(product.productId)' class="justify-end text-primary list-relist">Unlist</span>
              </div>
              <span style="text-align: left">Listed</span>
            </div>
            <div v-else>
              <div class="d-flex w-100 justify-content-between">
                <span style="color: darkgray">Status</span>
                <span @click='relist(product.productId)' class="justify-end text-primary list-relist">Relist</span>
              </div>
              <span style="text-align: left">Unlisted</span>
            </div>
          </b-col>
        </b-row>

        <b-row class='p-3'>
          <b-col>
            <div class="d-flex w-100 justify-content-between">
              <span style="color: darkgray">Sold</span>
            </div>
            <span style="text-align: left">{{ product.numSold }}</span>
          </b-col>
          <b-col>
            <div>
              <div class="d-flex w-100 justify-content-between pb-2">
                <span style="color: darkgray">Rating</span>
              </div>
              <span v-if='product.rating > 0' style="text-align: left">
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
              </span>
              <span v-else style="text-align: left">Unrated</span>
            </div>
          </b-col>
        </b-row>

        <b-row class='p-3'>
          <b-col class="d-flex flex-column">
            <div class="d-flex w-100 justify-content-between">
              <span style="color: darkgray;">Price</span>
              <span v-b-modal @click='setEditType("price")' class="justify-end text-primary">Edit</span>
            </div>
            <span class="justify-end" style="text-align: right !important; font-size: 30px; font-weight: bold;">{{ product.price }}</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
        
  <b-modal id="p-modal" title="Edit Product Details" v-model='modalShow' @hidden='resetModal' @ok='submitModal(product.productId)'>
    <form>
      <b-form-group v-if="editType.price" label="Price">
        <b-form-input v-model="newPrice"></b-form-input>
      </b-form-group>
      <b-form-group v-if="editType.quantity" label="Quantity">
        <b-form-input v-model="newQuantity"></b-form-input>
      </b-form-group>
      <b-form-group v-if="editType.description" label="Description">
        <b-form-input v-model="description"></b-form-input>
      </b-form-group>
    </form>
  </b-modal>

</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
import StarRating from 'vue-star-rating';

export default {
  name: "SupplierProducts",
  data() {
    return {
      details: {},
      product: {},
      newPrice: null,
      newQuantity: null,
      description: null,
      status: null,
      modalShow: false,
      editType: {
        description: false,
        price: false,
        quantity: false,
      }
    };
  },
  components: {
    Navbar,
    StarRating,
  },
  methods: {
    async loadPage() {
      this.details = this.$store.state.details;
      const result = await Supplier.viewSelfProduct(this.$route.params.productId, this.details.address);
      this.product = result.data;
      this.status = this.product.listed == true ? 'Listed' : 'Not Listed'
    },

    async submitModal(productId) { // TODO: cannot update more than 2 fields at once time
      if (this.newPrice) {
        const result = await Supplier.updateProductPrice(productId, this.newPrice, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
      if (this.newQuantity) {
        const result = await Supplier.updateProductQuantity(productId, this.newQuantity, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
      if (this.description) {
        const result = await Supplier.updateProductDescription(productId, this.description, this.details.address);
        console.log(result.data);
        this.$router.go();
      }
    },

    resetModal() {
      this.newPrice = null;
      this.newQuantity = null;
      this.description = null;
      this.editType = {
        description: false,
        price: false,
        quantity: false,
      };
      this.modalShow = false;
    },

    setEditType(editType) {

      if (editType === 'price') {
        this.editType.price = true;
      } else if (editType === 'description') {
        this.editType.description = true;
      } else if (editType === 'quantity') {
        this.editType.quantity = true;
      }

      this.modalShow = true;
    },

    async unlist(productId) {
      await Supplier.unlistProduct(productId, this.details.address);
      this.$router.go();
    },

    async relist(productId) {
      await Supplier.relistProduct(productId, this.details.address);
      this.$router.go();
    }
  },
  mounted() {
    this.loadPage()
  },
};
</script>

<style scoped>
.productName {
  font-weight: 700;
}

.product {
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  margin: 20px;
  padding: 5px;
}

.list-relist:hover {
  cursor: pointer;
}

#sold {
  font-size: .875rem;
  color: #767676;
}

#price {
  font-size: 1.875rem;
  font-weight: 700;
  color: #d0011b;
}
</style>