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
            <input v-model="address" type="text" class="validate" required>
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
      address: null
    }
  },
  methods: {
    addGarden () {
      db.collection('garden').add({
        productKey: this.productKey,
        name: this.name,
        address: this.address,
        timeSet: {before: 10, after: 7}
      }).then(docRef => {
        this.$router.push('/')
      }).catch(error => console.log(err))
    }
  }
}
</script>
