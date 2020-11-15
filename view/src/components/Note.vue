<template>
  <div class="note">
    <div v-for="note in notes" :key="note.id">
      <div id="preview">
        <div id="preview-text-container" @click="clk">
          <div id="del">
            <div @click="del(note)">
              x
            </div>
          </div>
          <p id="preview-text">
            {{ (note.text).length > 20? (note.text).slice(0,20) + "..." : note.text }}
          </p>
          <div id="created-on">
            {{ note.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[0] === new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[0]
            && note.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[1] === new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[1]
            && parseInt(note.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[2]) + 1 === parseInt(new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[2])
              ?
              "Today":(parseInt(note.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[2]) + 1) + "/" + note.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[1] +  "/" + note.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[0]
            }}
          </div>
        </div>
        <div id="notes-text-container" style="display: none">
          <textarea id="notes-text" @keyup="update($event.target.value, note)">
            {{ note.text }}
          </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState} from "vuex";
  import router from "@/router";

  export default {
  name: "Note",
    data() {
      return {
        array: [],
      }
    },
    props: {
      notes:{
        type:Array
      },
    },
    computed: {
      ...mapState(['userid']),
      iduser: function () {
        return this.userid;
      },
    },
    methods: {
      clk: function (e) {
        let cont = e.target;
        let txt = cont.parentElement.parentElement.querySelector("#notes-text-container");
        if (txt === null) //znaci da je sve ovo null i onda ne treba da ulazi uopste u ovu funkciju
          return;
        let day = cont.parentElement.querySelector("#created-on");
        if (txt.style.display === "none") {
          txt.style.display = "block";
          cont.style.fontWeight = "bold";
          cont.parentElement.style.backgroundColor = "burlywood";
        } else {
          txt.style.display = "none";
          cont.style.fontWeight = "normal";
          cont.parentElement.style.backgroundColor = "white";
        }
        day.style.fontWeight = "bold";
      },
      del: function (note) {
        if (note.idnotes === -1) {
          return;
        }
        fetch('http://localhost:3000/notes/delete', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({idnotes: note.idnotes, iduser: this.iduser})
        }).then((response) => {
          if (!response.ok)
            throw response;
          return response.json();
        }).then((jsonData) => {
          this.array = [];
          for(let i = 0; i < jsonData.length; i++) {
              this.array.push(jsonData[i]);
          }
          this.$emit('deleteUpdate', this.array);
        }).catch((error) => {
          if (typeof error.text === 'function')
            error.text().then((errorMessage) => {
              alert(errorMessage);
            });
          else
            alert(error);
        });
      },
      update: function (txt, note) {
        if (note.idnotes === -1) {
          return;
        }
        fetch('http://localhost:3000/notes/update', {
          method: 'post',
              headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text: txt, idnotes: note.idnotes, iduser: this.iduser})
        }).then((response) => {
          if (!response.ok)
            throw response;
          return response.json();
        }).then((jsonData) => {
          this.array = [];
          for(let i = 0; i < jsonData.length; i++) {
              this.array.push(jsonData[i]);
          }
          this.$emit('deleteUpdate', this.array);
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
  }
</script>

<style scoped>

  .note {
    height: auto;
  }
  #preview {
    height: auto;
    border-bottom: 1px solid burlywood;
  }

  #preview-text-container {
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  #preview-text {
    position: relative;
    text-align: left;
    font-family: "Trebuchet MS";
    font-size: 18px;
    left: 2%;
    user-select: none;
    height: 6vh;
    margin: 0;
    margin-top: 2%;
  }

  #notes-text-container {
    position: relative;
    width: 100%;
  }

  #notes-text {
    border: none;
    background-color: whitesmoke;
    resize: vertical;
    width: 99.8%;
    height: 15vh;
    font-family: "Trebuchet MS";
  }

  #created-on {
    position: relative;
    display: flex;
    justify-content: end;
    margin-right: 2%;
    user-select: none;
    color: #555555;
    font-weight: bold;
    padding-bottom: 1%;
  }

  #del {
    display: flex;
    justify-content: flex-end;
    padding-right: 2%;
    margin-bottom: -4%;
    font-weight: bold;
    font-family: cursive;
    z-index: 1000;
    user-select: none;
    color: #555555;
  }

  #del>div:hover {
    opacity: 0.5;
    cursor: pointer;
  }

</style>