<template>
  <div>
    <Navbar></Navbar>
    <!-- {{ details }} -->
    <!-- Need to align text -->
    <b-jumbotron
      header="Account Details"
      header-level="4"
      class="pb-4"
      bg-variant="default"
    >
      <hr class="my-4" />
      <b-card-group deck class="pb-3">
        <b-card
          v-for="(item, key) in info"
          v-bind:key="key"
          :header="key"
          bg-variant="light"
          border-variant="info"
        >
          <b-card-text>
            {{ item }}
          </b-card-text>
        </b-card>
      </b-card-group>

      <b-contianer class="Information">
        <b-row>
          <b-col>Name: {{ details.name }}</b-col>
        </b-row>
        <b-row>
          <b-col>Company: {{ details.company }}</b-col>
        </b-row>
        <b-row>
          <b-col>Role: {{ details.role }}</b-col>
        </b-row>
        <b-row>
          <b-col v-if="details.employeetype">
            Employee type: {{ details.employeetype }}</b-col
          >
        </b-row>
      </b-contianer>
    </b-jumbotron>
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
      test: {
        key1: "fake1",
        key2: "fake2",
      },
    };
  },
  methods: {
    async viewAll() {
      try {
        const details = this.$store.state.details;
        console.log("details:", details);
        this.details = details;
        console.log(this.info);

        if (this.details.role == "courier") {
          const result = await Courier.courierStatistics(this.details.address);
          const balance = await Courier.getTokenBalance(this.details.address);
          console.log("Stats:", result.data);
          console.log("Balance", balance.data);

          this.info = result.data;

          this.info["Total Earned"] = this.info["totalEarned"];
          delete this.info["totalEarned"];
          this.info["Orders Delivered"] = this.info["ordersDelivered"];
          delete this.info["ordersDelivered"];
          this.info["Balance"] = balance.data;
        } else if (this.details.role == "supplier") {
          const result = await Supplier.supplierStatistics(details.address);
          const balance = await Supplier.getTokenBalance(this.details.address);
          console.log("Stats", result.data);

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
          console.log("Stats", result.data);

          this.info = result.data;

          this.info["Total Spent"] = this.info["totalSpent"];
          delete this.info["totalSpent"];
          this.info["Products Bought"] = this.info["productsBought"];
          delete this.info["productsBought"];
          this.info["Orders Accepted"] = this.info["successfulOrdersMade"];
          delete this.info["successfulOrdersMade"];
          this.info["Balance"] = balance.data;
        }

        console.log("Stats:", this.info);
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
