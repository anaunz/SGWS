<template>
  <div id="add-garden" class="container">
    <ul class="collection with-header" style="border-style: none">
      <li class="collection-header">
        <router-link v-if="garden_id != null" v-bind:to="{name: 'view-garden', params: {garden_id: garden_id}}" class="fa fa-angle-left fa-lg"></router-link>
      </li>
    </ul>
    <h4>Edit Garden</h4>
    <div class="row">
      <form class="col s2">
        <div class="row">
          <div class="input-field col s12">
           <p>Product Key : </p> 
          </div>
        </div>
      </form>
      <form class="col s10">
        <div class="row">
          <div class="input-field col s12">
            <input id="disabled" v-model="productKey" type="text" class="validate" disabled>
            <label class="active" for="disabled">Product Key</label>
          </div>
        </div>
      </form>
    </div>
    <div class="row">
      <form class="col s2">
        <div class="row">
          <div class="input-field col s12">
           <p>Garden Name : </p> 
          </div>
        </div>
      </form>
      <form class = "col s10">
        <div class="row">
          <div class="input-field col s12">
            <input id="name" v-model="nameChange" type="text" class="validate">
            <label class="active" for="name">Garden Name</label>
            <blockquote>Example: My Garden</blockquote>
          </div>
        </div>
      </form>
    </div>
    <div class="row">
      <form class="col s2">
        <div class="row">
          <div class="input-field col s12">
           <p>Garden Name : </p> 
          </div>
        </div>
      </form>
      <form class = "col s10">
        <div class="row">
          <div class="input-field col s12">
            <input v-model="addressChange" id="address" type="text" class="validate" @input="autoCompleteAPI()">
            <label class="active" for="address">Address</label>
            <blockquote>Example: KMUTT, Bangkok, Thailand</blockquote>
          </div>
        </div>
      </form>
    <button @click="editGarden" class="btn">Edit</button>
  </div>
 </div>
</template>

<script>
import db from './firebase'
export default {
  name: 'add-garden',
  data () {
    return {
      garden_id: null,
      productKey: null,
      name: null,
      address: null,
      location: null,
      nameChange: null,
      addressChange: null,
      locationChange: null
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('garden').doc(to.params.garden_id).get().then(doc => {
      if(doc.exists){
        next(vm => {
          vm.garden_id = doc.id,
          vm.name = vm.nameChange = doc.data().name,
          vm.location = vm.locationChange = doc.data().location,
          vm.address = vm.addressChange = doc.data().address,
          vm.productKey = doc.data().productKey
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
    editGarden () {
      let n = this.nameChange || this.name
      let a = this.addressChange || this.address
      let l = this.locationChange || this.location
      db.collection('garden').doc(this.garden_id).update({
        name: n,
        address: a,
        location: l
      }).then(docRef => {
        this.$router.push('/view/' + this.garden_id)
      }).catch(error => console.log(err))
    },
    autoCompleteAPI () {
      let input = document.getElementById('address')
      let autocomplete = new google.maps.places.Autocomplete(input)
      let vm = this
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        let place = autocomplete.getPlace()
        vm.addressChange = place.formatted_address
        let lat = place.geometry.location.lat()
        let lng = place.geometry.location.lng()
        vm.locationChange = {lat: lat, long: lng}
      })
    }
  }
}
</script>