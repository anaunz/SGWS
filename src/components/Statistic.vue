<template>
  <div id="statistic" class="container">
    <div v-if="garden_id != null">
      <ul class="collection with-header">
        <li class="collection-header">
          <router-link v-if="garden_id != null" v-bind:to="{name: 'view-garden', params: {garden_id: garden_id}}" class="fa fa-angle-left fa-lg"></router-link>
        </li>
      </ul>
      <h4>Statistic</h4>
      Weather from API: {{weather}} <br>
      Prediction: {{predict}}
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
  name: 'statistic',
  data () {
    return {
      garden_id: null,
      weather: 'N/A',
      timeSet: null,
      predict: null
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('garden').doc(to.params.garden_id).get().then(doc => {
      if(doc.exists){
        next(vm => {
          vm.garden_id = doc.id,
          vm.timeSet = doc.data().timeSet
          if(doc.data().location != null){
            return $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + doc.data().location._lat + '&lon=' + doc.data().location._long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
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
  }
}
</script>
