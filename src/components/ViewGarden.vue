<template>
  <div id="view-garden" class="container">
    <ul class="collection with-header">
      <li class="collection-header">
        <router-link to="/" class="fa fa-angle-left fa-lg"></router-link>
        <router-link v-if="garden_id != null" v-bind:to="{name: 'statistic', params: {garden_id: garden_id, weather: weather}}" class="secondary-content">Statistic</router-link>
      </li>
    </ul>
    <ul class="collection with-header">
      <li class="collection-header"><h4>{{name}}</h4></li>
      <li class="collection-item">Garden ID#: {{garden_id}}</li>
      <li class="collection-item">Address: {{address}}</li>
      <li class="collection-item">Watering: {{watering}}</li>
      <li class="collection-item">Location: {{location}}</li>
      <li class="collection-item">Weather: {{weather}}</li>
    </ul>
    <button @click="smartWatering" class="btn blue">Smart Watering</button>
    <button @click="removeGarden" class="btn red">Remove Garden</button>
  </div>
</template>

<script>
import db from './firebase'
export default {
  name: 'view-garden',
  data () {
    return {
      garden_id: null,
      name: null,
      location: null,
      address: null,
      watering: null,
      weather: 'N/A'
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('garden').doc(to.params.garden_id).get().then(doc => {
      next(vm => {
        vm.garden_id = doc.id,
        vm.name = doc.data().name,
        vm.location = doc.data().location,
        vm.address = doc.data().address,
        vm.watering = doc.data().watering
        if(doc.data().location != null){
          return $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + doc.data().location._lat + '&lon=' + doc.data().location._long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
            vm.weather = data.main
          })
        }
      })
    })
  },
  methods: {
    smartWatering () {
      if(confirm('Are you sure?')) {
        
      }
    },
    removeGarden () {
      if(confirm('Are you sure?')) {
        if(confirm(this.name + ' won\'t be able to get back. Are you sure?')) {
          db.collection('garden').doc(this.$route.params.garden_id).get().then(doc => {
            doc.ref.delete()
            this.$router.push('/')
          })
        }
        
      }
    }
  }
}
</script>
