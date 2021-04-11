<template>
  <div class="container">
    <Navbar></Navbar>

    <h3 style="text-align: center;">Account Details</h3>

    <div class="container mt-5">
      <div class="d-flex align-items-center justify-content-center flex-column">
        <h5>Company Account Details</h5>
      </div>
      <b-row class="mt-3">
        <b-col v-for="(item, key) in info" v-bind:key="key">
          <b-card :header="key">
            <b-card-text>
              <h3>{{ item }}</h3>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <b-container class="Information mt-5">
      <div class="d-flex align-items-center justify-content-center flex-column">
        <h5>Employee Account Details</h5>
      </div>
      <b-row class="mt-3">
        <b-col>
          <b-card header="Name">
            <b-card-text>
              <h3>{{ details.name }}</h3>
            </b-card-text>
          </b-card>
        </b-col>
      
        <b-col>
          <b-card header="Company ID">
            <b-card-text>
              <h3>{{ details.company }}</h3>
            </b-card-text>
          </b-card>
        </b-col>
      
        <b-col>
          <b-card header="Role">
            <b-card-text>
              <h3>{{ details.role }}</h3>
            </b-card-text>
          </b-card>
        </b-col>
     
        <b-col v-if="details.employeetype">
          <b-card header="Employee Type">
            <b-card-text>
              <h3>{{ details.employeetype }}</h3>
            </b-card-text>
          </b-card>
          </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Courier from "../../api/Courier";
import Procurer from "../../api/Procurer";
import Supplier from "../../api/Supplier";
import Navbar from "./AccountNavbar.vue";
export default {
  name: "Account",
  data() {
    return {
      details: {},
      info: {},
    };
  },
  methods: {
    async viewAll() {
      try {
        const details = this.$store.state.details;
        this.details = details;

        if (this.details.role == "courier") {
          const result = await Courier.courierStatistics(this.details.address);
          const balance = await Courier.getTokenBalance(this.details.address);

          this.info = result.data;

          this.info["Total Tokens Earned"] = this.info["totalEarned"];
          delete this.info["totalEarned"];
          this.info["Orders Delivered"] = this.info["ordersDelivered"];
          delete this.info["ordersDelivered"];
          this.info["Tokens Balance"] = balance.data;
        } else if (this.details.role == "supplier") {
          const result = await Supplier.supplierStatistics(details.address);
          const balance = await Supplier.getTokenBalance(this.details.address);
          this.info = result.data;
          this.info["Total Earned"] = this.info["totalEarned"];
          delete this.info["totalEarned"];
          this.info["Products Sold"] = this.info["productsSold"];
          delete this.info["productsSold"];
          this.info["Average Rating"] = this.info["avgRating"];
          delete this.info["avgRating"];
          this.info["Balance"] = balance.data;
        } else if (this.details.role == "procurer") {
          const result = await Procurer.procurerStatistics(details.address);
          const balance = await Procurer.getTokenBalance(this.details.address);

          this.info = result.data;

          this.info["Total Spent"] = this.info["totalSpent"];
          delete this.info["totalSpent"];
          this.info["Products Bought"] = this.info["productsBought"];
          delete this.info["productsBought"];
          this.info["Orders Accepted"] = this.info["successfulOrdersMade"];
          delete this.info["successfulOrdersMade"];
          this.info["Balance"] = balance.data;
        }

      } catch (err) {
        console.log(err);
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

<style scoped></style>
