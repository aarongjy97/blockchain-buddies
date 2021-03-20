<template>
  <header v-bind:title="msg"></header>
</template>

<script>
import Header from "header.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    header: Header,
  },
};
</script>

<style></style>
