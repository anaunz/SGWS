<template>
  <div id="select-garden" class="container">
    <ul class="collection with-header">
      <li class="collection-header"><h4>Select Garden</h4></li>
      <li v-for="garden in gardens" v-bind:key="garden.garden_id" class="collection-item">
        {{garden.name}},
        {{garden.address}}
        <router-link class="secondary-content" v-bind:to="{name: 'view-garden', params: {garden_id: garden.garden_id}}"><i class="fa fa-eye"></i></router-link>
      </li>
      <li class="collection-item">
        Add Garden
        <router-link  to="/add" class="fa fa-plus secondary-content"></router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import db from './firebase'

export default {
  name: 'select-garden',
  data () {
    return {
      gardens: []
    }
  },
  created () {
    db.collection('garden').get().then(querySnapShot => {
      querySnapShot.forEach(doc => {
        const data = {
          'garden_id': doc.id,
          'name': doc.data().name,
          'location': doc.data().location
        }
        this.gardens.push(data)
      });
    })
  }
}
</script>
