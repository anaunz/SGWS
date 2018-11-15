<template>
  <div id="view-garden" class="container">
    <div v-if="garden_id != null">
      <ul class="collection with-header">
        <li class="collection-header">
          <router-link to="/" class="fa fa-angle-left fa-lg"></router-link>
          <router-link v-if="garden_id != null" v-bind:to="{name: 'statistic', params: {garden_id: garden_id, weather: weather, predict: predict}}" class="secondary-content">Statistic</router-link>
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
      <button @click="immediateWatering" class="btn blue">Immediate Watering</button>
      <button @click="smartWatering" class="btn blue">Smart Watering</button>
      <button @click="removeGarden" class="btn red secondary-content">Remove Garden</button>
    </div>
    <div v-if="garden_id == null" class="center">
      <h5>Sorry, there is no garden id you want to see</h5>
    </div>
  </div>
</template>

<script>
import db from './firebase'
import cal from './calculation'
export default {
  name: 'view-garden',
  data () {
    return {
      garden_id: null,
      name: null,
      location: null,
      address: null,
      watering: null,
      weather: 'N/A',
      predict: null,
      timeSet: null
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('garden').doc(to.params.garden_id).get().then(doc => {
      if(doc.exists){
        next(vm => {
          vm.garden_id = doc.id,
          vm.name = doc.data().name,
          vm.location = doc.data().location,
          vm.address = doc.data().address,
          vm.watering = doc.data().watering,
          vm.timeSet = doc.data().timeSet
          if(doc.data().location != null){
            return $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + vm.location.lat + '&lon=' + vm.location.long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
              vm.weather = data
              vm.predict = cal(vm.weather, vm.timeSet, 95)
            })
          }
        })
      }
      else{
        next(vm => {
          vm.garden_id = null
        })
      }
    })
  },
  methods: {
    smartWatering () {
      if(confirm('Are you sure?')) {
        
      }
    },
    immediateWatering () {
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
