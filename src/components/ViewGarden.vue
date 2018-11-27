<template>
  <div id="view-garden" class="container">
    <div v-if="garden_id != null">
        <div class="row">
          <ul class="collection with-header" style="border-style: none">
            <li class="collection-header">
              <router-link to="/" class="fa fa-angle-left fa-lg"></router-link>
              <router-link v-if="garden_id != null" v-bind:to="{name: 'statistic', params: {garden_id: garden_id, weather: weather}}" class="right"> Statistic</router-link>
            </li>
          </ul>
          <h2>{{name}}</h2>
          <p>Garden ID#: {{garden_id}}</p>
          <ul class="collapsible " style="border-style: none; background-color:white;" >
            <li>
              <div class="collapsible-header" @click="collapse" >Location : {{address}}</div>
              <div class="collapsible-body white">
                <div v-if="markers != null">
                  <gmap-map :center="markers.position" :zoom="16" style="width:100%; height: 400px;">
                    <gmap-marker :position="markers.position"></gmap-marker>
                  </gmap-map>
                </div>
              </div>
            </li>
          </ul>
          <p style="text-align : center">Real Time Status</p>
          <div class="row">
            <div class="col s6" v-if="weather != null">
              <i style="font-size : 62px; " class="fas fa-cloud-sun-rain center-align"></i>
              <p style="text-align : center">Weather : {{weather.weather[0].main}}  </p>
              <p style="text-align : center">Temperature : {{(weather.main.temp-272.15).toFixed(1)}} °C</p>
              <p style="text-align : center">Humidity : {{weather.main.humidity}} %</p>
              <p style="text-align : center">Wind : {{weather.wind.speed}} m/s </p>
            </div>
            <div class="col s6" v-if="weather != null">
              <i style="font-size : 62px;" class="fas fa-tint"></i>
              <p style="text-align : center">Soil Moisture: {{watering[0].moisture}} %  </p>
              <p style="text-align : center"> Watering Status: {{watering[0].status}} </p>
              <p style="text-align : center"> Watering: {{watering[0].time.seconds}} </p>
            </div>
          </div>
        </div>
        <button @click="removeGarden" class="btn red right">Remove Garden</button>
    </div>
    <div v-if="garden_id == null" class="center">
      <h5>Sorry, there is no garden id you want to see</h5>
    </div>
  </div>
</template>

<script>
import db from './firebase'
import firebase from 'firebase'
export default {
  name: 'view-garden',
  components: {
    Map
  },
  data () {
    return {
      garden_id: null,
      name: null,
      location: null,
      address: null,
      watering: null,
      weather: 'N/A',
      daily: null,
      timeSetBefore: null,
      timeSetAfter: null,
      markers: null,
      waterNow: 1
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
          vm.timeSetBefore = doc.data().timeSet.before,
          vm.timeSetAfter = doc.data().timeSet.after,
          vm.daily = doc.data().daily
          if(doc.data().location != null){
            return $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + vm.location.lat + '&lon=' + vm.location.long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
              console.log(vm.garden_id)
              vm.weather = data
              const marker = {
                lat: vm.location.lat,
                lng: vm.location.long
              }
              vm.markers = { position: marker }
              /*document.getElementById('timeSetBefore').value = vm.timeSetBefore
              document.getElementById('timeSetAfter').value = vm.timeSetAfter*/
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
      if(confirm('Are you sure to change time setting?')) {
        return db.collection('garden').doc(this.$route.params.garden_id).update({
          timeSet: {before: this.timeSetBefore, after: this.timeSetAfter}
        }).then(noData => {
          this.$router.go()
        }).catch(function(error) {
          console.error("Error updating document: ", error);
        })
      }
    },
    skipSmart () {
      if(confirm('Are you sure to skip the next smart watering?')) {
        return db.collection('garden').doc(this.$route.params.garden_id).update({
          watering: firebase.firestore.FieldValue.arrayUnion({time: new Date(), temp: this.weather.main.temp, moisture: 95, status: 'Smart Skip'}),
          daily: 1
        }).then().then(noData => {
          this.$router.go()
        }).catch(function(error) {
          console.error("Error updating document: ", error);
        })
      }
    },
    immediateWatering () {
      if(confirm('Are you sure?')) {
        return db.collection('garden').doc(this.$route.params.garden_id).update({
          watering: firebase.firestore.FieldValue.arrayUnion({time: new Date(), temp: this.weather.main.temp, moisture: 95, status: 'Immediate Watering'}),
          daily: 1
        }).then(noData => {
          let xhr = new XMLHttpRequest()
          xhr.open('POST', 'http://35.225.63.230:8000/immediateWatering', true)
          xhr.send('time=1')
          this.$router.go()
        }).catch(function(error) {
          console.error("Error updating document: ", error);
        })
      }
    },
    removeGarden () {
      if(confirm('Are you sure?')) {
        if(confirm(this.name + ' won\'t be able to get back. Are you sure?')) {
          return db.collection('garden').doc(this.$route.params.garden_id).get().then(doc => {
            doc.ref.delete()
            this.$router.push('/')
          }).catch(function(error) {
            console.error("Error updating document: ", error);
          })
        }
      }
    },
    collapse () {
      $('.collapsible').collapsible()
    }
  }
}
</script>
