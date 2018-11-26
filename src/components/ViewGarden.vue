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
        </div> 
        <div class="row">
          <h2>{{name}}</h2>
        </div>
        <div class="row">
          <p>Garden ID#: {{garden_id}}</p>
        </div>
        <div class="row">
          <ul class="collapsible " style="border-style: none; background-color:white;" >
            <li>
              <div class="collapsible-header" @click="collapse" >Location : {{address}} </div>
              <div class="collapsible-body white">
                <div v-if="markers != null">
                  <gmap-map :center="markers.position" :zoom="16" style="width:100%; height: 400px;">
                    <gmap-marker :position="markers.position"></gmap-marker>
                  </gmap-map>
                </div>
              </div>
            </li>
          </ul>
      </div>
      <div class="row">
        <p style="text-align : center">Real Time Status</p>
      </div>
      <div class="row">
        <div class="col s6" >
            <i style="font-size : 62px; " class="fas fa-cloud-sun-rain center-align"></i>
            <p style="text-align : center">Weather : {{weather.weather[0].main}}  </p>
            <p style="text-align : center">Temperature : {{(weather.main.temp-272.15).toFixed(1)}} °C</p>
            <p style="text-align : center">Humidity : {{weather.main.humidity}} %</p>
            <p style="text-align : center">Wind : {{weather.wind.speed}} m/s </p>
        </div>
        <div class="col s6">
          <i style="font-size : 62px;" class="fas fa-tint"></i>
          <p style="text-align : center">Soil Moisture: {{watering[0].moisture}} %  </p>
          <p style="text-align : center"> Watering Status: {{watering[0].status}} </p>
          <p style="text-align : center"> Watering: {{watering[0].time.seconds}} </p>
        </div>
      </div>
      <div class="row" style="width: 100%">
        <ul class="collapsible col s12 m6" >
            <li class="">
              <div class="collapsible-header" @click="collapse">Immediate Watering</div>
              <div class="collapsible-body">
                <div class="input-field">
                  <input v-model="waterNow" value="1:00" type="text" class="validate">
                  <label class="active" for="first_name2">Set Timer (min)</label>
                  <button v-if="daily == 0" class="btn blue" style='background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));' @click="immediateWatering">Water It Now!</button>
                  <button v-if="daily == 1" class="btn blue"style='color : black;background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));' @click="immediateWatering" disabled>Water It Now!</button>
                </div>
              </div>
            </li>
        </ul>
            <ul class="collapsible col s12 m6" style="max-width:50%">
            <li class="">
              <div class="collapsible-header" @click="collapse">Smart Watering</div>
              <div class="collapsible-body">
                <div class="input-field">
                  <input id="timeSetAfter" value="7" v-model="timeSetAfter" type="text" class="validate">
                  <label class="active" for="first_name2">After (24-hour)</label>
                </div>
                <div class="input-field">
                  <input id="timeSetBefore" value="10" v-model="timeSetBefore" type="text" class="validate">
                  <label class="active" for="first_name2">Before (24-hour)</label>
                </div>
                <button class="btn blue" @click="smartWatering" style='color : #555555; background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));'>Set Time</button>
                <button v-if="daily == 0" class="btn blue" @click="skipSmart" style="color : #555555; background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));"> Skip</button>
                <button v-if="daily == 1" class="btn blue" @click="skipSmart" disabled>Skip</button>
              </div>
            </li>
          </ul>
        
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
              vm.weather = data
              const marker = {
                lat: vm.location.lat,
                lng: vm.location.long
              }
              vm.markers = { position: marker }
              document.getElementById('timeSetBefore').value = vm.timeSetBefore
              document.getElementById('timeSetAfter').value = vm.timeSetAfter
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
    showModal () {
      this.$refs.myModalRef.show()
    },
    hideModal () {
      this.$refs.myModalRef.hide()
    },
    collapse () {
      $('.collapsible').collapsible()
    }
    
  }
}
</script>
