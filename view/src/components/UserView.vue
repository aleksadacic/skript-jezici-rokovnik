<template>
  <div class="user-view" style="height: 100%;">
    <div class="info-container">
      <div class="field">
        Signature: {{ this.name }}
      </div>
      <div class="field">
        Number of notes: {{ this.brnotes }}
      </div>
      <div class="field">
        Number of todos: {{ this.brtodos }}
      </div>
      <div class="logout" @click="logout">
        Log out
      </div>
        <div class="back" @click="vrati">
          Return back
        </div>
      <div class="logo">
        <img alt="Rokovnik logo" src="../assets/logo.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
name: "UserView",
  props: {
    iduser: Number,
    name: String,
    brnotes: Number,
    brtodos: Number
  },
  data() {
    return {
      idcpy: -1
    }
  },
  methods: {
    ...mapActions(["logout_user"]),
    vrati: function () {
      console.log("cpy:" + this.idcpy);
      this.$router.push({ name: 'Planner', params: { iduser: this.idcpy, name: this.name }});
    },
    logout: function () {
      this.logout_user();
    }
  },
  created() {
    console.log(this.iduser);
    this.idcpy = this.iduser;
  }
}
</script>

<style scoped>
  .info-container {
    height: 50%;
    width: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: whitesmoke;
    border-radius: 8px;
    border: 2px solid #20391e;
    box-shadow: 0 0 100px darkgoldenrod;
    display: flex;
    flex-direction: column;
  }

  .field {
    font-weight: bold;
    font-family: "Trebuchet MS";
    text-align: left;
    padding-left: 5%;
    padding-top: 2%;
    color: #20391e;
    font-size: 2vw;
  }

  .back {
    font-weight: bold;
    width: 12%;
    font-size: 0.8vw;
    border-radius: 5px;
    border: 1px solid goldenrod;
    margin-left: 5%;
    color: #20391e;
    position: absolute;
    bottom: 5%;
    cursor: pointer;
  }

  .logout {
    font-weight: bold;
    width: 12%;
    font-size: 0.8vw;
    border-radius: 5px;
    border: 1px solid goldenrod;
    margin-left: 5%;
    color: #20391e;
    position: absolute;
    bottom: 5%;
    right: 5%;
    cursor: pointer;
  }

  .logout:hover {
    opacity: 0.5;
  }

  .back:hover {
    opacity: 0.5;
  }

  .logo {
    position: absolute;
    right: 10%;
    width: 10%;
    user-select: none;
    top: 50%;
    transform: translate(0,-50%);
  }

  .logo > img {
    width: 100%;
    height: 100%;
  }

</style>