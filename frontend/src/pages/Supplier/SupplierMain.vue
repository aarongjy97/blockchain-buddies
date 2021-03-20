<template>
<b-container>
  <Navbar v-bind:title="msg"></Navbar>
  <h1>Supplier Main Page</h1>
</b-container>
</template>

<script>
import Navbar from "./Navbar.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Navbar,
  },
};
</script>

<style></style>