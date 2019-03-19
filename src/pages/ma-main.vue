<template>
  <div class='ma-main'>
    <!--<keep-alive include="order_list">
      <router-view/>
    </keep-alive>-->
    <router-view/>
    <tab-bar v-model="active"></tab-bar>
  </div>
</template>

<script>
  import tabBar from 'components/tab-bar'
  export default {
    name:'ma_main',
    components:{ tabBar },
    data() {
      return {
        active:0
      };
    },
    watch: {
      $route(n) {
        this.setActive(n.name)
      }
    },
    beforeRouteEnter(to,from,next) {
      // home_page order_list feedback user_center 
      next(vm=>{
        vm.setActive(to.name)
      })
    },
    methods: {
      setActive(name) {
        if(name === 'home_page') {
          this.active = 0
        }
        if(name === 'order_list') {
          this.active = 1
        }
        if(name === 'feedback') {
          this.active = 2
        }
        if(name === 'user_center') {
          this.active = 3
        }
      }
    }
  }
</script>
<style lang='scss'>
.ma-main {
  height:100%;
}
</style>