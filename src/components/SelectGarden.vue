<template>
  <div id="select-garden" class="container">
    <ul class="collection with-header">
      <li class="collection-header"><h4>Select Garden</h4></li>
      <div  class="row">
        <div class="col m3" v-for="garden in gardens" v-bind:key="garden.garden_id">
          <div class="card small" style='background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255)); opacity: 0.8;' >
            <div class="card-content black-text" >
              <span class="card-title">{{garden.name}}</span>
                <p>{{garden.address}}</p>
                <router-link class="secondary-content" v-bind:to="{name: 'view-garden', params: {garden_id: garden.garden_id}}"><i class="fa fa-eye"></i></router-link>
            </div>
          </div>
        </div>
        <div class="col m3">
          <div class="card small " style='background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255)); opacity: 0.6;' @click="$router.push('/add')">
            <div class="card-content">
              <span class="card-title" style='text-align: center; margin-top : 50%; vertical-align: super'>Add Garden</span>
              <!-- <router-link  to="/add" class="fa fa-plus secondary-content"></router-link> -->
            </div>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
import db from './firebase'
import axios from 'axios'
export default {
  name: 'select-garden',
  data () {
    return {
      gardens: [],
      loading: false
    }
  },
  created () {
    db.collection('garden').orderBy("created", "desc").get().then(querySnapShot => {
      querySnapShot.forEach(doc => {
        const data = {
          'garden_id': doc.id,
          'name': doc.data().name,
          'address': doc.data().address
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
</style>


