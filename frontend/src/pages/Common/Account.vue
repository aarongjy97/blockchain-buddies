<template>
<div>
    <Navbar></Navbar>
    <!-- {{ details }} -->
    {{ details.name }}
    {{ details.company }}
    {{ details.email }}
    {{ details.role }}
    {{ details.employeetype }}
</div>
</template>

<script>
import Navbar from "./AccountNavbar.vue";
export default {
  name: "Account",
  data() {
    return {
      details: {},
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
    }
  },
  components: {
    Navbar,
  },
  mounted() {
    this.viewAll()
  },
};
</script>

<style scoped>

</style>
