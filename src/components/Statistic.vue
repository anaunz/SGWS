<template>
  <div id="statistic" class="container">
    <h4>Statistic</h4>
    Weather from API: {{weather}}
  </div>
</template>

<script>
import db from './firebase'
export default {
  name: 'statistic',
  data () {
    return {
      garden_id: null,
      weather: 'N/A'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.garden_id = to.params.garden_id
      vm.weather = to.params.weather
    })
  }
}
</script>
