<template>
<div>
  <Navbar></Navbar>
  <h1>Supplier Listing Page</h1>

  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Name:"
        label-for="input-1"
        description="Name of product."
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Quantity:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model.number="form.quantity"
          placeholder="Enter quantity"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Price ($):" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model.number="form.price"
          placeholder="Enter price"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
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

      const result = await Supplier.listProduct(this.form.name, this.form.price, this.form.quantity, details.address); 
      console.log(result.data);
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.quantity = ''
      this.form.price = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
};
</script>

<style></style>