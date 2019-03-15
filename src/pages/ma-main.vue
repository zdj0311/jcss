<template>
  <div class='ma-main'>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
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
        console.log(n)
        if(n.name === 'home_page') {
          this.active = 0
        }
        if(n.name === 'order_list') {
          this.active = 1
        }
        if(n.name === 'feedback') {
          this.active = 2
        }
        if(n.name === 'user_center') {
          this.active = 3
        }
      }
    },
    beforeRouteEnter(to,from,next) {
      // home_page order_list feedback user_center 
      console.log(to.name)
      next(vm=>{
        if(to.name === 'home_page') {
          vm.active = 0
        }
        if(to.name === 'order_list') {
          vm.active = 1
        }
        if(to.name === 'feedback') {
          vm.active = 2
        }
        if(to.name === 'user_center') {
          vm.active = 3
        }
      })
    },
  }
</script>
<style lang='scss'>
.ma-main {
  height:100%;
}
</style>