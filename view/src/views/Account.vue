<template>
  <div class="account" style="background-color: white; height: 100%;">
    <div class="login">
      <div class="logo">
        <img alt="Rokovnik logo" src="../assets/logo.png">
      </div>
      <input type="text" placeholder="Signature" class="nest" v-model="nameL">
      <input type="password" placeholder="Password" class="nest" v-model="passL">
      <div class="enter-button" @click="loginacc">
        Login
      </div>
      <div class="toggle" @click="toggleAcc">
        Or Create an Account
      </div>
    </div>
    <div class="create">
      <div class="logo">
        <img alt="Rokovnik logo" src="../assets/logo.png">
      </div>
      <input type="text" placeholder="Signature" class="nest" v-model="nameN">
      <input type="password" placeholder="Password" class="nest" v-model="passN">
      <input type="password" placeholder="Repeat password" class="nest" v-model="pass2N">
      <div class="toggle" @click="toggleAcc">
        Or Log in
      </div>
      <div class="enter-button" @click="newacc">
        Create Account
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex';

export default {
name: "Account",
  data() {
    return {
      nameL: "",
      passL: "",
      nameN: "",
      passN: "",
      pass2N: "",
      togg: false
    }
  },
  computed: {
    ...mapGetters({
      iduser: 'id'
    })
  },
  methods: {
    ...mapActions(['login_user', 'create_user']),
    toggleAcc: function () {
      this.togg = !this.togg;
      if (!this.togg){
        document.querySelector(".create").style.display = "none";
        document.querySelector(".login").style.display = "block";
      }
      else {
        document.querySelector(".create").style.display = "block";
        document.querySelector(".login").style.display = "none";
      }
    },
    newacc: function () {
      if (this.passN !== this.pass2N){
        alert("Passwords didn't match!")
        return;
      }
      if (this.passN === "" || this.nameN === "") {
        alert("All fields are required!");
        return;
      }
      let vals = {name: this.nameN, pass: this.passN};
      this.create_user(vals);
    },
    loginacc: function () {
      if (this.passL === "" && this.nameL === ""){
        alert("All fields are required!");
        return;
      }
      console.log(this.nameL + ":" + this.passL);
      let vals = {name: this.nameL, pass: this.passL};
      this.login_user(vals);
    }
  }
}

</script>

<style scoped>
  .login {
    position: absolute;
    width: 20vw;
    height: 50vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: whitesmoke;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 100px #20391e;
  }

  .create {
    position: absolute;
    width: 20vw;
    height: 50vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: whitesmoke;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 100px #20391e;
    display: none;
  }

  .logo {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
    width: 10%;
    user-select: none;
    margin-top: 10%;
    margin-bottom: 10%;
  }

  .logo > img {
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .enter-button {
    background-color: #20391e;
    color: #20391e;
    font-weight: bold;
    background-color: whitesmoke;
    width: 50%;
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translate(-50%,0);
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid goldenrod;
  }
  .enter-button:hover{
    opacity: 0.5;
  }

  .nest {
    width: 50%;
    height: 10%;
    border-radius: 2px;
    border: none;
    margin: auto;
    margin-top: 2%;
    margin-bottom: 1%;
    border-bottom: 1px solid #20391e;
    background-color: whitesmoke;
  }

  .toggle {
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    color: #20391e;
    font-weight: bold;
  }

</style>