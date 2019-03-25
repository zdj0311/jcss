<template>
  <div class="magix-header">
    <van-tabbar v-model="active" @change="change">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">我的工单</van-tabbar-item>
      <van-tabbar-item icon="friends-o">意见反馈</van-tabbar-item>
      <van-tabbar-item icon="setting-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import uri from 'utils/uri'   
  export default {
    name: 'magix_header',
    props:{
      value:Number
    },
    watch: {
      value(n) {
        this.active = n
      }
    },
    data() {
      return {
        active: 0,
        dictionary:['home_page','order_list','feedback','auth']
      }
    },
    computed: {
      onRoute() {
        return this.$route.name
      }
    },
    methods: {
      change(i) {
        this.$emit('input',this.active)
        if(i === 1) {
          this.$router.push({name:this.dictionary[i],params:{
            _type:'Week',
            _mode:'TODO'
          }})
        }else {
          this.$router.push({name:this.dictionary[i]})
        }
        
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .magix-header {
    display:flex;
    padding-top: 1.79rem;
    .options {
      display:flex;
      flex-grow: 1;
      justify-content: flex-end;
      align-items:center;
      color: rgb(255, 255, 255);
      background-color: rgb(64, 158, 255);
    }
    .option-item {
      cursor: pointer;
      padding:0 1.4rem;
    }
    .el-menu {
      padding-left:3rem;
    }
    .el-menu.el-menu--horizontal {
      border-bottom:none;
    }
  }
</style>