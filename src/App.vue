<template>
  <div id="app">
    <router-view></router-view>
    <loading :active.sync="isLoading"></loading>
    <alert-message></alert-message>
  </div>
</template>

<script>
import AlertMessage from './components/AlertMessage.vue';
export default {
  name: 'App',
  data() {
    return {
      //isLoading: false
    }
  },
  components: {
    AlertMessage
   
  },
  created(){
    //this.$store.dispatch('alertModules/hideAlertMessage'); 
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
</style>
