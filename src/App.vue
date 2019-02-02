<template>
  <div id="app">
    <Navbar />
    <div class="center" style="color:red"><h5>*** The server of this demo has been shut down since 19th December 2018 ***</h5>
    There won't be any information on Smart Watering History after that, but Immediate Watering is still functional</div>
    <div id="main">
      <router-view/>
    </div>
    <br>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  #main {
    flex: 1 0 auto;
  }
</style>
