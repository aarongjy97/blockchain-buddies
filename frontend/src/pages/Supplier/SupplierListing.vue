<template>
<b-container>
  <Header v-bind:title="msg"></Header>
  <h1>Supplier Listing Page</h1>
</b-container>
</template>

<script>
import Header from "./Header.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Header,
  },
};
</script>

<style></style>