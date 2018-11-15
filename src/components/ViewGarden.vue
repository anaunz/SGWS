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
      <div class="row">
        <div class="col s6">
          <ul class="collapsible row">
            <li class="col s6">
              <div class="collapsible-header" @click="smartSetting">Immediate Watering</div>
              <div class="collapsible-body">
                <div class="input-field">
                  <input value="1:00" type="text" class="validate">
                  <label class="active" for="first_name2">Set Timer (min)</label>
                </div>
              </div>
            </li>
            <li class="col s6">
              <div class="collapsible-header" @click="smartSetting">Smart Watering</div>
              <div class="collapsible-body">
                <div class="input-field">
                  <input id="timeSetAfter" value="7" v-model="timeSetAfter" type="text" class="validate">
                  <label class="active" for="first_name2">After (24-hour)</label>
                </div>
                <div class="input-field">
                  <input id="timeSetBefore" value="10" v-model="timeSetBefore" type="text" class="validate">
                  <label class="active" for="first_name2">Before (24-hour)</label>
                </div>
                <button class="btn blue" @click="smartWatering">Set Time</button>
                <button class="btn blue">Skip</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
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
      timeSetBefore: null,
      timeSetAfter: null
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
          vm.timeSetAfter = doc.data().timeSet.after
          if(doc.data().location != null){
            return $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + vm.location.lat + '&lon=' + vm.location.long + '&appid=86eb79574951a234c5a5913b940ca90b', function(data) {
              vm.weather = data
              vm.predict = cal(vm.weather, vm.timeSetBefore, vm.timeSetAfter, 95)
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
        return db.collection('garden').doc(this.$route.params.garden_id).update({
          timeSet: {before: this.timeSetBefore, after: this.timeSetAfter}
        }).catch(function(error) {
          console.error("Error updating document: ", error);
        })
      }
    },
    immediateWatering () {
      if(confirm('Are you sure?')) {
        
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
    smartSetting () {
      $('.collapsible').collapsible()
      let vm = this
      document.getElementById('timeSetBefore').value = vm.timeSetBefore
      document.getElementById('timeSetAfter').value = vm.timeSetAfter
    }
  }
}
</script>
