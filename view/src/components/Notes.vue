<template>
  <div id="notes">
    <div id="notes-container">
      <div id="notes-header">
        <div id="search-container">
          <div id="lupa">
            <img alt="Rokovnik lupa" src="../assets/lupa.svg" draggable="false">
          </div>
          <input type="text" id="searchbox" placeholder="Search" @keyup="search">
        </div>
      </div>
      <div id="all-notes">
        <textarea class="new-note-container" placeholder="Start writing a new note..." v-model="text"></textarea>
        <div id="dodajNovi" @click="addNew">
          +
        </div>
        <div id="added-notes">
          <Note v-if="notes.length > 0" v-bind:notes="notes" v-bind:iduser="this.iduser" @deleteUpdate="delUpdate"></Note>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Note from '@/components/Note.vue'
import {mapActions, mapState, mapGetters} from 'vuex';
import router from "@/router";

export default {
  name: "Notes",
  components: {
    Note
  },
  data() {
    return {
      text: '',
      notes: [],
    }
  },
  computed: {
    ...mapGetters({
      iduser: 'id'
    })
  },
  methods: {
    search: function (e) {
      let svi = document.querySelectorAll("#notes-text");
      if (e.target.value === "") {
        for (let i = 0; i < svi.length; i++) {
          svi[i].parentElement.parentElement.parentElement.style.display = "block";
        }
      }
      else {
        for (let i = 0; i < svi.length; i++) {
          if (svi[i].textContent.includes(e.target.value)) {
            svi[i].parentElement.parentElement.parentElement.style.display = "block";
          }
          else {
            svi[i].parentElement.parentElement.parentElement.style.display = "none";
          }
        }
      }
    },
    addNew: function () {
      if (this.text === "") {
        alert("Fill out all the fields!");
        return;
      }
      fetch('http://localhost:3000/notes/novi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: this.text, iduser: "" + this.iduser})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        this.notes = [];
        for(let i = 0; i < jsonData.length; i++) {
          this.notes.push(jsonData[i]);
          console.log("note " + jsonData[i].id)
        }
        this.text = "";
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    delUpdate( array ) {
      this.notes = [];
      for (let i = 0; i < array.length; i++) {
        this.notes.push(array[i]);
      }
    },
    initialFetch: function () {
      fetch('http://localhost:3000/notes', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
        for(let i = 0; i < jsonData.length; i++) {
          console.log(jsonData[i]);
          this.notes.push(jsonData[i]);
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
  mounted () {
    console.log("fetch notes");
    this.initialFetch();
  },
  watch: {
    '$route': 'initialFetch'
  },
}
</script>

<style>

  #notes {
    /*position: relative;*/
    height: 100vh;
    width: 60%;
  }

  #notes-container {
    position: relative;
    width: 100%;
    height: 100%;
    /*background-color: #20391e;*/
  }


  #notes-header {
    position: relative;
    left: 1%;
    top: 1%;
    width: 99%;
    height: 3.5%;
  }

  #search-container {
    position: relative;
    width: 60%;
    height: 100%;
    display: flex;
  }

  #searchbox {
    display: flex;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid darkgrey;
    width: 100%;
    text-indent: 10%;
  }

  #lupa {
    display: flex;
    position: absolute;
    height: 100%;
    width: auto;
  }

  #lupa > img {
    height: 100%;
    width: 100%;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  #all-notes {
    position: absolute;
    top: 5%;
    left: 1%;
    width: 99%;
    height: 100%;
  }

  .new-note-container {
    text-align: left;
    font-size: 16px;
    background-color: whitesmoke;
    height: 10%;
    width: 100%;
    border: none;
    resize: vertical;
    font-family: "Trebuchet MS";
  }

  #dodajNovi {
    width: 3vw;
    position: absolute;
    right: 0;
    cursor: pointer;
    font-weight: bold;
    color: burlywood;
    font-size: 4vh;
    top: 0;
    user-select: none;
  }

  #dodajNovi:hover {
    opacity: 0.5;
  }

  #added-notes {
    position: relative;
    top: 5vh;
  }

</style>