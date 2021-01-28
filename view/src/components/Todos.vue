<template>
  <div class="todos">
    <div class="novi">
      <input class="text-field" v-model="text" type="text" placeholder="Write a new todo..." maxlength="40">
      <div class="time-field">
        <input class="time" type="text" placeholder="00" maxlength="2" v-model="h">
        :
        <input class="time" type="text" placeholder="00" maxlength="2" v-model="m">
      </div>
      <div class="dodaj" @click="newTodo">
        +
      </div>
    </div>
    <div class="all-todos">
      <Todo v-for="todo in todos" :key="todo.id"  :id="todo.id" :checked="todo.done" :time="todo.time" :text="todo.text" @deleteUpdate="delUpdate" @updateTodos="upTodo"></Todo>
    </div>
  </div>
</template>

<script>
import Todo from '@/components/Todo';
import {mapGetters} from "vuex";
import router from "@/router";
export default {
name: "Todos",
  components: {
    Todo
  },
  data() {
    return {
      text: "",
      h: "",
      m: "",
      todos: []
    }
  },
  computed: {
    ...mapGetters({
      iduser: 'id'
    })
  },
  methods: {
    newTodo: function () {
      if (this.text === "" || this.h === "" || this. m === "") {
        alert("Fill out all the fields!");
        return;
      }
      fetch('http://localhost:3000/todos/novi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: this.text, h:this.h, m:this.m, iduser: this.iduser})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        this.todos = [];
        for(let i = 0; i < jsonData.length; i++) {
          this.todos.push(jsonData[i]);
        }
        this.text = "";
        this.h = "";
        this.m = "";
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    delUpdate( id ) {
      let tmp = -1;
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id)
          tmp = i;
      }
      this.todos.splice(tmp,1);
    },
    upTodo(id, checked) {
      let x = checked? 1: 0;
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id){
          this.todos[i].done = x;
        }
      }
    },
    initialFetch: function () {
      console.log("initfetch" + this.iduser);
      fetch('http://localhost:3000/todos', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
        for(let i = 0; i < jsonData.length; i++) {
          console.log(jsonData[i]);
          this.todos.push(jsonData[i]);
        }
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
  },
  mounted() {
    this.initialFetch();
  },
  watch: {
    '$route':'initialFetch'
  }
}
</script>

<style scoped>
  .todos {
    height: 100vh;
    top: 15vh;
    left: 60%;
    width: 40%;
    background-color: whitesmoke;
    border-top: 2px solid #20391e;
  }

  .novi {
    margin-right: auto;
    margin-left: auto;
    margin-top: 1%;
    width: 70%;
    border: 1px solid burlywood;
    border-radius: 3px;
    height: 7%;
    position: relative;
    background-color: white;
  }

  .text-field {
    position: absolute;
    width: 90%;
    border: none;
    background-color: transparent;
    font-family: "Trebuchet MS";
    font-size: 2vh;
    left: 1%;
    top: 5%;
  }

  .time-field {
    position: absolute;
    bottom: 5%;
    left: 1%;
    width: 50%;
    font-size: 2.4vh;
    justify-content: start;
    text-align: left;
  }

  .time {
    border: none;
    background-color: transparent;
    text-align: center;
    width: 3vh;
    position: relative;
    font-size: 2vh;
  }

  .dodaj {
    width: 1.5vw;
    height: 1.5vw;
    position: absolute;
    right: 0;
    font-weight: bold;
    color: #20391e;
    font-size: 3vh;
    bottom: 0;
    user-select: none;
  }

  .dodaj:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  .all-todos {
    margin-top: 6vh;
    height: 100%;
  }

</style>