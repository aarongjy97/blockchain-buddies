<template>
<div>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <Navbar></Navbar>
  <h1 id="title">Supplier Listing Page</h1>

  <div class="form">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Product:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Quantity:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model.number="form.quantity"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Price:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model.number="form.price"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Description:" label-for="input-4">
        <b-form-textarea
          id="input-4"
          v-model="form.description"
          placeholder="Describe what you are selling and include any details a buyer might be interested in."
          rows="4"
          maxrows="6"
          required
        ></b-form-textarea>
      </b-form-group>

      <div id="bottompart">
        <md-icon v-on:click="reset" class="fa fa-refresh" id="refresh"></md-icon>
        <b-button id="button-1" type="submit" variant="primary">List Now</b-button>
      </div>
      
      <!--<b-button id="button-2" type="reset" variant="danger">Reset</b-button>-->
    </b-form>    
  </div>
  

</div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Supplier from "../../api/Supplier";
export default {
  name: "SupplierListing",
  data() {
    return {
      form: {
          name: '',
          quantity: '',
          price: '',
          description: '',
        },
        show: true
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const details = this.$store.state.details;
      console.log('details:', details);

      const result = await Supplier.listProduct(this.form.name, this.form.price, this.form.quantity, this.form.description, details.address); 
      console.log(result.data);
      alert('Product listed');
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.quantity = ''
      this.form.price = ''
      this.form.description = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    reset: function () {
      this.form.name = ''
      this.form.quantity = ''
      this.form.price = ''
      this.form.description = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
};
</script>

<style scoped>
.form {
  border: 2px solid #ededed; 
  border-radius: 10px;
  max-width: 50%;
  position: relative;
  left:25%;
  box-shadow: 3px 8px #d3d3d3;
}

#input-group-1 {
  margin: 15px;
}

#input-group-2 {
  margin: 15px;
}

#input-group-3 {
  margin: 15px;
}

#button-1 {
  width: 150px;
  font-weight: bold;
  background-color: #008F79;
  border-color:#008F79;
}

#bottompart {
  margin: 15px;
  position: relative;
  left:77.8%;
}

#refresh {
  padding:10px;
  color:#d3d3d3;
  cursor: pointer;
}

#title {
  position: relative;
  left:40%;
  padding-bottom: 20px;
}
</style>