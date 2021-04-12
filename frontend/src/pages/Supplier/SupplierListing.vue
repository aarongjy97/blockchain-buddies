<template>
  <div class="container">
    <Navbar></Navbar>
    <h3 style="text-align: center;">List Product</h3>

    <div class="container listing mt-2">
      <div class="container d-flex flex-column w-75 pt-4">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="input-group-1"
            label="Product Name"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.name"
              placeholder="Enter Name"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Quantity" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model.number="form.quantity"
              type='number'
              min='1'
              placeholder="Enter Quantity"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Price" label-for="input-3">
            <b-form-input
              id="input-3"
              type='number'
              min='1'
              v-model.number="form.price"
              placeholder="Enter Price"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Description"
            label-for="input-4"
          >
            <b-form-textarea
              id="input-4"
              v-model="form.description"
              placeholder="Enter Description"
              required
            ></b-form-textarea>
          </b-form-group>

          <div class="d-flex flex-row justify-content-center">
            <b-button class='m-2' type="submit" variant="primary">Submit</b-button>
            <b-button class='m-2' type="reset" variant="danger">Reset</b-button>
          </div>

        </b-form>
      </div>
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
        name: "",
        quantity: "",
        price: "",
        description: "",
      },
      show: true,
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const details = this.$store.state.details;
      console.log("details:", details);

      const result = await Supplier.listProduct(
        this.form.name,
        this.form.price,
        this.form.quantity,
        this.form.description,
        details.address
      );
      console.log(result.data);
      alert("Product listed");
      this.$router.go();
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.name = "";
      this.form.quantity = "";
      this.form.price = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style scoped>
.listing {
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  height: 600px;
}
</style>
