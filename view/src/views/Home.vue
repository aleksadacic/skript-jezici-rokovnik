<template>
  <div class="home">
    <Header></Header>
    <div class="cont">
      <Notes></Notes>
      <Todos></Todos>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
import Notes from "@/components/Notes";
import Account from "@/views/Account";
import {mapState, mapActions} from "vuex";
import Todos from "@/components/Todos";

export default {
  name: 'Home',
  components: {
    Todos,
    Header,
    Notes,
    Account
  },
  computed: {
    ...mapState(['userid']),
    iduser: function () {
      return this.userid;
    },
    ...mapState(['username']),
    name: function () {
      return this.username;
    }
  },
  mounted: function () {
    this.load_user();
  },
  methods: {
    ...mapActions(['load_user'])
  }
}
</script>

<style scoped>
  .home {
    height: 80vh;
  }

  .cont {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
