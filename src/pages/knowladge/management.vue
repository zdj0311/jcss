<template>
  <div class="management">
    <news-page></news-page>
  </div>
</template>

<script>
  import newsPage from './news-page';
  export default {
    name: 'management',
    components: { newsPage },
    data() {
      return {
        active: 0,
        tabs:[{
            name: '网络安全',
            route: 'netsafe',
          },{
            name: '数据存储',
            route: 'database',
          },{
              name: '终端外设',
              route: 'output',
          },{
              name: '管理制度',
              route: 'management',
          },{
              name: '其他',
              route: 'others',
          }]
      }
    },
    watch: {
      active(val, oldValue) {
        const name = this.tabs[val].route;
        this.$router.push(name);
      }
    },
    methods: {
      change(i) {
        console.log(i)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .management {
    .van-tabs__line {
      background-color: #54a7fe;
    }
  }
</style>