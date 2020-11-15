<template>
  <div class="header">
    <div class="header-container">
      <div id="logo">
        <img alt="Rokovnik logo" src="../assets/logo.png">
      </div>
      <div id="welcome" @click="touser">
        <h1>
            {{ this.name }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex';

export default {
name: "Header",
  computed: {
    ...mapGetters({
      iduser: 'id',
      name: 'username'
    })
  },
  data() {
    return {
      brnotes: 0,
      brtodos: 0
    }
  },
  methods: {
    touser: function () {
      let x = document.querySelectorAll("#preview-text-container");
      let y = document.querySelectorAll(".todo");
      console.log("header send: " + this.iduser)
      this.$router.push({ name: 'Signature', params: { iduser: this.iduser, name: this.name, brnotes: x.length, brtodos: y.length }});
    }
  }
}
</script>

<style scoped>

  .header {
    height:15vh;
  }

  .header-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-bottom: 2px solid #20391e;
  }

  #logo {
    position: relative;
    width: 5vh;
    top: 50%;
    transform: translate(0,-50%);
    user-select: none;
  }
  div > img {
    width: 100%;
  }
  #welcome {
    color: #20391e;
    position: absolute;
    right: 0;
    font-size: 1.5vh;
    top: 50%;
    transform: translate(0,-50%);
    user-select: none;
  }

  #welcome:hover {
    color: darkolivegreen;
    cursor: pointer;
  }

  .todate {
    font-weight: bold;
    font-size: 3vh;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

</style>