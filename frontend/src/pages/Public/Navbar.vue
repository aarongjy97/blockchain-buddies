<template>
  <div>
    <b-navbar
      toggleable="md"
      type="light"
      variant="light"
      class="navbar fixed-top"
    >
      <b-navbar-brand to="/procurer-main" id="nav">
        Procurement Marketplace
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/">Products</b-nav-item>
          <b-nav-item to="/register">Register</b-nav-item>
          <b-nav-item to="/login">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("clearData");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins&display=swap");
#Header {
  width: 100%;
  box-sizing: border-box;
  padding: 0px 25px 0px 25px;
}
body {
  margin: 0;
}
li,
a,
button {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #000000;
}
header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 30px 10%;
  width: 100%;
}
.logo {
  cursor: pointer;
  margin-right: auto;
  width: 200px;
}
.nav__links {
  list-style: none;
}
.nav__links li {
  display: inline-block;
  padding: 0px 20px;
}
.nav__links li a {
  transition: all 0.3s ease 0s;
}
.nav__links li a:hover {
  color: rgba(108, 122, 137, 1);
}
button {
  margin-left: 20px;
  padding: 12px 30px;
  background-color: rgba(189, 195, 199, 1);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}
button:hover {
  background-color: rgba(189, 195, 199, 0.8);
}
button:focus {
  outline: 0;
}
</style>
