<template>
  <div id="view-garden" class="container">
    <ul class="collection with-header">
      <li class="collection-header">
        <router-link to="/" class="fa fa-angle-left fa-lg"></router-link>
        <router-link v-bind:to="{name: 'statistic', params: {garden_id: garden_id}}" class="secondary-content">Statistic</router-link>
      </li>
    </ul>
    <ul class="collection with-header">
      <li class="collection-header"><h4>{{name}}</h4></li>
      <li class="collection-item">Garden ID#: {{garden_id}}</li>
      <li class="collection-item">Address: {{address}}</li>
      <li class="collection-item">Watering: {{watering}}</li>
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
      watering: null
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
      })
    })
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      db.collection('garden').doc(this.$route.params.garden_id).get().then(doc => {
        this.garden_id = doc.id
        this.name = doc.data().name
        this.location = doc.data().location
        this.address = doc.data().address
        this.watering = doc.data().watering
      })
    },
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
