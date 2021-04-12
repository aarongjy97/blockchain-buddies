<template>
  <div class="container">
    <Navbar/>
    <po></po>
  </div>
</template>

<script>
  import PurchaseOrder from '../Common/PurchaseOrder';
  import Navbar from './Navbar';
  export default {
    name: "procurer-order",
    components: {
      "po": PurchaseOrder,
      Navbar
    }
  }
</script>

<style>

</style>