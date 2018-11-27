<template>
  <div id="statistic" v-if="weather !== 'N/A'" class="container">
    <div v-if="garden_id != null">
      <ul class="collection with-header">
        <li class="collection-header">
          <router-link v-if="garden_id != null" v-bind:to="{name: 'view-garden', params: {garden_id: garden_id}}" class="fa fa-angle-left fa-lg"></router-link>
        </li>
      </ul>
      <h4>Statistic</h4>
      Weather at "{{weather.name}} {{weather.sys.country}}" from API:<br>
      <table>
        <thead>
          <tr>
              <th>Location</th>
              <th>Weather</th>
              <th>Temperature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Longitude : {{weather.coord.lon}}<br>Latitude : {{weather.coord.lat}}</td>
            <td><div class="col s12 m8 offset-m2 l6 offset-l3">
          <div class="row valign-wrapper">
            <div class="col s2">
              <i class="fas fa-cloud-sun-rain" style="font-size:60px"></i>
            </div>
            <div class="col s10">
              <span class="black-text">
                {{weather.weather[0].main}} <br>Pressure : {{weather.main.pressure}} <br>Humidity : {{weather.main.humidity}}
              </span>            
          </div>
        </div>
      </div></td>
            <td>Now :{{ weather.main.temp}}<br>Max : {{ weather.main.temp_max}}<br>Min : {{ weather.main.temp_min}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="garden_id == null" class="center">
      <h5>Sorry, there is no garden id you want to see</h5>
    </div>
  </div>
</template>

<script>
import db from './firebase'
export default {
  name: 'statistic',
  data () {
    return {
      garden_id: null,
      weather: "N/A",
      timeSet: null
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('garden').doc(to.params.garden_id).get().then(doc => {
      if(doc.exists){
        next(vm => {
          vm.garden_id = doc.id,
          vm.timeSet = doc.data().timeSet
          if(doc.data().location != null){
            return $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + doc.data().location.lat + '&lon=' + doc.data().location.long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
              vm.weather = data
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
  }
}
</script>


