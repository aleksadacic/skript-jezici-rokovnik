import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid:  -1,
    username: ""
  },
  mutations: {
    set_userid: function (state, userid) {
      state.userid = userid;
    },
    set_name: function (state, nm){
      state.username = nm;
    },
    reinit_userid: function (state) {
      state.userid = -1;
    },
    reinit_name: function (state) {
      state.username = "";
    }
  },
  getters: {
    id: state => {
      return state.userid;
    },
    username: state => {
      return state.username;
    }
  },
  actions: {
    login_user: function ({ commit, getters }, vals) {
      fetch('http://localhost:3000/signature/login', 
        {method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: vals.name, password: vals.pass})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
        commit('set_userid', jsonData.id);
        router.push({ name: 'Planner', params: { iduser: jsonData.id, name: vals.name }});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    create_user: function ({commit, getters}, vals) {
      fetch('http://localhost:3000/signature/novi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: vals.name, password: vals.pass})
      }).then((response) => {
        if (!response.ok){
          throw response;
        }
        return response.json();
      }).then(({ jsonData }) => {
        commit('set_userid', jsonData.id);
        router.push({ name: 'Planner', params: { iduser: jsonData.id, name: vals.username }});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert("Minimum for the name is 4 letters or the password is invalid!");
          });
        else
          alert("Try different name or the password is invalid!");
      });
    },
    logout_user: function ({commit, getters}) {
      fetch('http://localhost:3000/signature/load', {method: 'get'}).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({jsonData}) => {
        commit('reinit_userid');
        commit('reinit_name');
        router.push({name: 'Account'});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    load_user: function ({commit}) {
      fetch('http://localhost:3000/signature/load', {method: 'get'}).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
          console.log(jsonData);
          commit('set_userid', jsonData.id);
          commit('set_name', jsonData.username);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }
  },
  modules: {
  }
})
