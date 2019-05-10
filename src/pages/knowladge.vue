<template>
  <div class="knowladge">
    <van-tabs class="tab-container" v-model="active" @change="change">
      <van-tab title="网络安全"></van-tab>
      <van-tab title="数据存储"></van-tab>
      <van-tab title="终端外设"></van-tab>
      <van-tab title="管理制度"></van-tab>
      <van-tab title="其他"></van-tab>
      <router-view></router-view>
    </van-tabs>
  </div>
</template>

<script>
  export default {
    name: 'knowladge',
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
              route: 'out_put',
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
        this.$router.replace({name: name});
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
  .knowladge {
    .van-tabs__wrap {
      position:fixed;
      top:0;
    }
    .van-tabs__line {
      background-color: #54a7fe;
    }
  }
</style>