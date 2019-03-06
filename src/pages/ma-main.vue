<template>
  <div class='ma-main'>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
    <tab-bar></tab-bar>
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
    computed: {},
    watch: {},
    methods: {

    },
    created() {

    },
    mounted() {

    },
  }
</script>
<style lang='scss' scoped>

</style>