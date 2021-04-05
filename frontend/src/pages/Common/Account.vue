<template>
<div>
    <Navbar></Navbar>
    <!-- {{ details }} -->
    <b-jumbotron>
      <template #header>{{ details.name }}</template>

      <template #lead>
        <b-row>
          <b-col>Company: {{ details.company }}</b-col>
          <b-col>Email: {{ details.email }}</b-col>
          <b-col>Role: {{ details.role }}</b-col>
          <b-col v-if='details.employeetype'>Employee type: {{ details.employeetype }}</b-col>
        </b-row>
      </template>

      <hr class="my-4">

      <p>
        <b-button v-b-modal.balance>Check account balance</b-button>
        <b-modal id="balance" ok-only>
          <p class="my-4">Account balance: {{ balance }}</p>
        </b-modal>

        <!-- <b-button variant="success" href="#">Do Something</b-button>  -->
      </p>
    </b-jumbotron>
</div>
</template>

<script>
// import Courier from '../../api/Courier';
import Navbar from "./AccountNavbar.vue";
export default {
  name: "Account",
  data() {
    return {
      details: {},
      balance: 100,
    };
  },
  methods: {
    async viewAll() {
      try{
        const details = this.$store.state.details;
        console.log('details:', details);
        this.details = details;
      }
      catch (err) {
        console.log(err)
      }
    },
    // async getTokenBalance() {
    //   try{
    //     const result = await Courier.getTokenBalance(this.details.address);
    //     console.log(result.data);
    //     this.balance = result.data;
    //   }
    //   catch (err) {
    //     console.log(err)
    //   }
    // },
  },
  components: {
    Navbar,
  },
  mounted() {
    this.viewAll();
    // this.getTokenBalance();
  },
};
</script>

<style scoped>

</style>
