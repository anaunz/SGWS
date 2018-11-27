<template>
  <div id="view-garden" class="container">
    <div v-if="garden_id != null">
        <div class="row">
          <ul class="collection with-header" style="border-style: none">
            <li class="collection-header">
              <router-link to="/" class="fa fa-angle-left fa-lg"></router-link>
              <router-link v-if="garden_id != null" v-bind:to="{name: 'statistic', params: {garden_id: garden_id, weather: weather}}" class="right">Statistic</router-link>
              <span class="right"> | </span>
              <router-link v-if="garden_id != null" v-bind:to="{name: 'edit-garden', params: {garden_id: garden_id}}" class="right">Edit Garden</router-link>
            </li>
          </ul>
          <div class="row">
            <div class="col s4"><h2>{{name}}</h2><p>Garden ID#: {{garden_id}}</p><p>Location: {{address}}</p></div>
            <div class="col s8 right-align">
              <ul class="collapsible right" style="border-style: none; background-color:white;" >
                <li>
                  <div class="collapsible-header" @click="collapse" >Location</div>
                  <div class="collapsible-body white">
                    <div v-if="markers != null">
                      <gmap-map :center="markers.position" :zoom="16" style="width:400px; height: 400px;">
                        <gmap-marker :position="markers.position"></gmap-marker>
                      </gmap-map>
                    </div>
                  </div>
                </li>
              </ul>
              <ul class="collapsible right" style="border-style: none; background-color:white;" >
                <li>
                  <div class="collapsible-header" @click="collapse" v-if="watering != null">History</div>
                  <div class="collapsible-body white">
                    <div v-for="(hist, key) in history" :key="key" class="left-align">
                      Moisture: {{hist.moisture}}<br>
                      Temperature: {{(hist.temp - 272.15).toFixed(1)}} °C<br>
                      Time: {{changeTime(hist.time.seconds).Hour}}:{{changeTime(hist.time.seconds).Min}} | {{changeTime(hist.time.seconds).Day}}-{{changeTime(hist.time.seconds).Month}}-{{changeTime(hist.time.seconds).Year}}<br>
                      Status: {{hist.status}}<br>
                      <hr>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <h5 style="text-align : center">Real Time Status</h5>
          <div class="row">
            <div class="col s5 row offset-s1" v-if="weather != 'N/A'">
              <div class="col s6 center-align">
                <i style="font-size : 108px;" class="fas fa-cloud-sun-rain"></i>
              </div>
              <div class="col s6">
                <p>Weather : {{weather.weather[0].main}}  </p>
                <p>Temperature : {{(weather.main.temp - 272.15).toFixed(1)}} °C</p>
                <p>Humidity : {{weather.main.humidity}} %</p>
                <p>Wind : {{weather.wind.speed}} m/s </p>
              </div>
            </div>
            <div class="col s5">
              <div class="col s6 right-align">
                <p>Soil Moisture: 95%</p>
              </div>
              <div class="col s6 center-align">
                <i style="font-size : 108px;" class="fas fa-tint"></i>
              </div>
            </div>
          </div>
          <div class="row" style="width: 100%">
        <ul class="collapsible col s12 m6" >
            <li class="">
              <div class="collapsible-header" @click="collapse">Immediate Watering</div>
              <div class="collapsible-body">
                <div class="input-field">
                  <input v-model="waterNow" type="text" class="validate" id="timeImmediate">
                  <label class="active" for="first_name2">Set Timer (min)</label>
                  <button v-if="daily == 0" class="btn blue" style='color : black;background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));' @click="immediateWatering">Water It Now!</button>
                  <button v-if="daily == 1" class="btn blue" style='color : #555555;;background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));opacity : 0.7;' @click="immediateWatering" disabled>Water It Now!</button>
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
              <button class="btn blue" @click="smartWatering" style='color : black; background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));'>Set Time</button>
              <button v-if="daily == 0" class="btn blue" @click="skipSmart" style="color : black; background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));"> Skip</button>
              <button v-if="daily == 1" class="btn blue" @click="skipSmart" disabled style='color : #555555;;background-image :linear-gradient(to right, rgb(109,255,111), rgb(0,255,255));opacity : 0.7;'>Skip</button>
            </div>
          </li>
        </ul>
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
  computed: {
    history: function () {
      let output = []
      if(this.watering != null){
        for(let i = this.watering.length - 1; i >= 0 && i >= this.watering.length - 5; i--) output.push(this.watering[i])
        return output
      }
    }
  },
  methods: {
    smartWatering () {
      if(confirm('Are you sure to change time setting?')) {
        return db.collection('garden').doc(this.$route.params.garden_id).update({
          timeSet: {before: this.timeSetBefore, after: this.timeSetAfter}
        }).then(noData => {
          let data = '{"before":'+document.getElementById("timeSetBefore").value+',"after":'+document.getElementById("timeSetAfter").value+'}'
          console.log(data)
          data = JSON.parse(data)
          let XHR = new XMLHttpRequest()
          let urlEncodedData = ""
          let urlEncodedDataPairs = []
          var name
          for(name in data) {
            urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
          }
          urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+')
          XHR.onreadystatechange = function() {
            if (XHR.readyState === 4)
                console.log(XHR.response)
            }
          XHR.open('POST', 'http://35.225.63.230:8000/smartWatering');
          XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
          XHR.send(urlEncodedData)
          this.$router.go()
          return 0
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
          let data = '{"time":'+document.getElementById("timeImmediate").value+'}'
          data = JSON.parse(data)
          let XHR = new XMLHttpRequest()
          let urlEncodedData = ""
          let urlEncodedDataPairs = []
          var name
          for(name in data) {
            urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
          }
          urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+')
          XHR.onreadystatechange = function() {
          if (XHR.readyState === 4)
              console.log(XHR.response)
              return 0
          }
          XHR.open('POST', 'http://35.225.63.230:8000/immediateWatering');
          XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
          XHR.send(urlEncodedData)
        }).then(noData => {
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
    },
    changeTime (time) {
      let timeStamp = new Date(time * 1000)
      let dateFormat = {Year: timeStamp.getFullYear(), Month: timeStamp.getMonth() + 1, Day: timeStamp.getDate(), Hour: timeStamp.getHours(), Min: timeStamp.getMinutes()}
      return dateFormat
    }
  }
}
</script>
