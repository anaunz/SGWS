<template>
  <div id="select-garden" class="container">
      <h4>Select Garden</h4>
      <div  class="row">
        <div class="col s12 m6 l4" v-for="garden in gardens" v-bind:key="garden.garden_id">
            <div class="card sticky-action large" style="background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255)); opacity: 0.8;" >
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="https://techcrunch.com/wp-content/uploads/2018/04/flower-garden.jpg?w=730&crop=1">
              </div>
              <div class="card-reveal">
                <span class="card-title">
                  {{garden.name}}
                  <i class="fa fa-close right"></i>
                </span>
                <p>Address: {{garden.address}}</p>
              </div>
              <div class="card-content black-text" >
                <span class="card-title activator">
                  {{garden.name}}
                  <i class="fa fa-ellipsis-v right"></i>
                </span>
              </div>
              <router-link class="black-text" v-bind:to="{name: 'view-garden', params: {garden_id: garden.garden_id}}">
                <div class="card-action">VIEW GARDEN</div>
              </router-link>
            </div>
        </div>
        <div class="col s12 m6 l4">
          <router-link  to="/add" class="black-text">
            <div class="card large" style="background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255)); opacity: 0.5;">
              <div class="card-content">
                <span class="card-title vertical-center">
                  Add Garden
                  <i class="fa fa-plus" style="font-size: 20px;"></i>
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
  </div>
</template>

<script>
import db from "./firebase"
import axios from "axios"
export default {
  name: "select-garden",
  data () {
    return {
      gardens: [],
      loading: false
    }
  },
  created () {
    db.collection("garden").orderBy("created", "desc").get().then(querySnapShot => {
      querySnapShot.forEach(doc => {
        const data = {
          "garden_id": doc.id,
          "name": doc.data().name,
          "address": doc.data().address
        }
        this.gardens.push(data)
      })
    })
  }
}
</script>

<style>
.column {
    float: left;
    width: 33.33%;
    padding: 15px;
}

.vertical-center {
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}
</style>


