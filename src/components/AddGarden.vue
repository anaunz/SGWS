<template>
  <div id="add-garden" class="container">
    <h4>Add Garden</h4>
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input v-model="productKey" type="text" class="validate" required>
            <label for="productKey">Product Key</label>
            <blockquote>Example: A-123-456</blockquote>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input v-model="name" type="text" class="validate" required>
            <label for="name">Garden Name</label>
            <blockquote>Example: My Garden</blockquote>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input v-model="address" id="address" type="text" class="validate" @input="autoCompleteAPI()" required>
            <label for="address">Address</label>
            <blockquote>Example: KMUTT, Bangkok, Thailand</blockquote>
          </div>
        </div>
      </form>
    </div>
    <button @click="addGarden" class="btn">Add a garden</button>
  </div>
</template>

<script>
import db from './firebase'
export default {
  name: 'add-garden',
  data () {
    return {
      productKey: null,
      name: null,
      address: null,
      location: null
    }
  },
  methods: {
    addGarden () {
      db.collection('garden').add({
        productKey: this.productKey,
        name: this.name,
        address: this.address,
        location: this.location,
        timeSet: {before: 10, after: 7},
        created: new Date(),
        daily: 0
      }).then(docRef => {
        this.$router.push('/')
      }).catch(error => console.log(err))
    },
    autoCompleteAPI () {
      let input = document.getElementById('address')
      let autocomplete = new google.maps.places.Autocomplete(input)
      let vm = this
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        let place = autocomplete.getPlace()
        vm.address = place.formatted_address
        let lat = place.geometry.location.lat()
        let lng = place.geometry.location.lng()
        vm.location = {lat: lat, long: lng}
      })
    }
  }
}
</script>
