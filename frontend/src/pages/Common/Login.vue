<template>
  <div class="signinpage">
    <div class="container">
      <div class="wrapper">
        <div class="login-section">
          <div class="signinbox">
            <div class="login-box-header">
              <h2>Welcome</h2>
            </div>

            <div class="box-content">
              <form @submit.prevent="login" id="loginForm" class="form-login">
                <input
                  type="email"
                  name="email"
                  id="un"
                  class="form-control"
                  placeholder="Email"
                  v-model="email"
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  class="form-control"
                  placeholder="Password"
                  v-model="password"
                />

                <button id="signin-btn" class="btn btn-primary btn-sm">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="sideimg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const login = {
        email: this.email,
        password: this.password,
      };
      await axios
        .get("http://localhost:5000/api/login/procureremployee", login)
        .then((res) => {
          if (res.status == 200) {
            // let data = res.json();
            this.$router.push("procurer-home");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins&display=swap");

.signinpage {
  font-family: Poppins, sans-serif;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  background: #f2f2f2;
}

.container {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #f2f2f2;
}

.wrapper {
  width: 1170px;
  background: #fff;
  overflow: hidden;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-direction: row-reverse;
}

.sideimg {
  background-image: url(../../assets/signin.jpg);
  width: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
}

.sideimg::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}

.intro {
  padding-top: 50px;
}

.login-section {
  width: 50%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  padding: 170px 65px 170px 65px;
  margin: 0 auto;
}

.signinbox {
  margin: 0 auto;
}

.login-section h2 {
  font-size: 36px;
  z-index: 2;
}

.login-section h4 {
  font-size: 20px;
  z-index: 4;
}

.login-box-header {
  padding: 10px;
  margin: 10px;
}

.form-login input {
  border: 3px solid #ba9977;
  padding: 10px;
  height: 40px;
  width: 300px;
  margin: 20px auto;
  font-size: 18px;
}

.form-login button {
  font-size: 15px;
  height: 40px;
  width: 100px;
  text-align: center;
  background-color: #ba9977;
  border: solid white;
  radius: 3px;
}

.signup-wrap {
  margin: 20px;
  font-size: 20px;
}

#signup-link {
  color: #c9b8a7;
}

button:active {
  -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
  -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
  box-shadow: inset 0px 0px 5px #c1c1c1;
  outline: none;
}

button:hover {
  transform: scale(1.1);
}
</style>
