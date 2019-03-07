<template>
  <div class="home-page">
    <div class="banner-r"></div>
    <div class="create">
      <div class="create-head">
        <div class="head-a">
          <span class="head-icon icon"></span>
          <span class="head-font">快速创建工单</span>
        </div>
        <div class="head-b">
          <a href="createWork.html">
            <span class="head-font">手动创建</span>
            <span class="head-icon icon-arrow"></span>
          </a>
          </div>
      </div> 
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in assetsArray" :key="index">
          <div class="l-list" v-for="(it, index) in item" :key="index">
            <span class="l-icon"><img :src="addHost(it.iconUrl)"/></span>
            <span class="l-f">{{it.assetsTypeName}}</span>                                
          </div>
        </van-swipe-item>
      </van-swipe> 
    </div>  
    <div class="create work">
      <div class="create-head" ref="create">
        <div class="head-a">
          <span class="head-icon icon-a"></span>
          <span class="head-font">工作统计</span>
        </div>
        <van-tabs v-model="active" @click="selectTab">
          <van-tab v-for="(item,index) in statistics" :key="index">
            <div slot="title">
              <span class="filter-ico"></span>
              <span class="filter-f">{{item.name}}</span>
            </div>
            <ul class="work-con">
              <li>
                <span class="ico c-ico"></span>
                <div class="w-con">
                  <span class="w-num">{{statisticsCount.CREATE}}</span>
                  <span class="w-f">创建工单</span>
                </div>
              </li>
              <li>
                <span class="ico d-ico"></span>
                <div class="w-con">
                  <span class="w-num">{{statisticsCount.UN_END}}</span>
                  <span class="w-f">待办工单</span>
                </div>
              </li>
              <li>
                <span class="ico b-ico"></span>
                <div class="w-con">
                  <span class="w-num">{{statisticsCount.END}}</span>
                  <span class="w-f">办理工单</span>
                </div>
              </li>
            </ul>
          </van-tab>
        </van-tabs>
      </div>
    </div>      
  </div>
</template>

<script> 
  export default {
    name: 'home_page',
    data() {
      return {
        assetsArray:[],
        statistics: [{name:'本日',value:'Day'},{name:'本周',value:'Week'},{name:'本月',value:'Month'}],
        active: 0,
        statisticsCount: {},
        width: ''
      }
    },
    mounted() {
      this.getInfo();
      this.selectTab(this.active);
      this.width == this.$refs.create.offsetWidth;
    },
    methods: {
      getInfo: function() {
        let _this = this;
        this.$get('jcss/api/wk/dic/assetsTypeList.action', {params: {customerId: _this.$store.state.admin.user.orgId}}).then(res=>{
          let copyArr =  res.slice(0,res.length)
          let len = Math.ceil(res.length/4);
          for(var i=0;i<len;i++){
             _this.assetsArray.push(copyArr.splice(0,4))
          }
        })
      },
      selectTab(index) {
        let dateType = this.statistics[index]['value'];
        let _this = this;
        this.$get('jcss/api/wk/statistiscCount.action', {params: {dateType: dateType}}).then(res=>{
          _this.statisticsCount = res;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  body{
    background: #F2F2F2;
  }
  .home-page {  
    .banner-r{
      width: 100%;
      height: 52vw;
      background: url('~@/assets/banner.jpg') no-repeat;
      background-size: 100% 52vw;
    }
    .create{
      background: #fff;
      margin-top: 0.8rem;
      border-top:solid 1px #eee;
      border-bottom:solid 1px #eee;
      padding:0 1.2rem;
      .create-head{
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 0;
        .head-font{
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
          margin-left: 5px;
        }
        .head-icon{
          width: 1.3rem;
          height: 1.3rem;
          background: url('~@/assets/icon-c.png') no-repeat;
          background-size: 1.3rem 1.3rem;
          display: inline-block;
          vertical-align: middle;
          margin-top: -3px;
          &.icon-a{
            background: url('~@/assets/icon-w.png') no-repeat;
            background-size: 1.3rem 1.3rem;
          }
        }
        .head-b{
          .head-font{
            font-size: 1.1rem;
            color: #999;
            margin-right: 5px;
          }
          .icon-arrow{
            width: 0.4rem;
            height: 0.8rem;
            background: url('~@/assets/icon-arrow.png') no-repeat;
            background-size: .4rem .8rem;
          }
        }
        .van-tabs{
          padding-top: 0px;
          margin-top: -1.6rem;
          .van-hairline--top-bottom::after {
            border-width: 0px 0;
          }
          .van-tabs__line{
            background-color: transparent;
          }
          .van-tabs__wrap{
            height: 1.5rem;
            float: right;
            position: relative;
            margin-bottom: 0.8rem;
          }
          .van-tab{
            line-height: 1.5rem;
            .filter-ico{
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              background: #ddd url('~@/assets/duih.png') no-repeat .15rem .25rem;
              background-size: .8rem .5rem;
              display: inline-block;
              margin-right: 5px;
              vertical-align: middle;
              margin-top: -3px;
            }
            .filter-f{
              font-size: 1rem;
              color: #666;
              display: inline-block;
            }
            .filter-f{
              font-size: 1rem;
              color: #666;
              display: inline-block;
            }
          }
          .van-tab--active{
            .filter-ico{
              background: #4a79df url('~@/assets/duih.png') no-repeat .15rem .25rem;
              background-size: .8rem .5rem;
            }
            .filter-f{
              color: #4a79df;
            }
          }
          .van-tabs__content{
            .work-con {
              display: flex;
              width: 100%;
              li{
                width: 32%;
                margin-right: 2%;
                height: 4.8rem;
                background: #f5f5f5;
                border-radius: 5px;
                position: relative;
                &:nth-child(3){
                  margin-right: 0;
                }
                .ico{
                  width: 3.75rem;
                  height: 3.2rem;
                  background: url('~@/assets/work1.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                  display: inline-block;
                }
                .d-ico{
                  background: url('~@/assets/work2.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                }
                .b-ico{
                  background: url('~@/assets/work3.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                }
                .w-num{
                  font-size: 1.7rem;
                  color: #000;
                  display: block;
                  text-align: right;
                }
                .w-f{
                  font-size: 1rem;
                  color: #666;
                }
                .w-con{
                  position: absolute;
                  left: 2.8rem;
                  top: .4rem;
                }
              }
            }
          }
        }
      }
      .van-swipe-item{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1.6rem;
        .l-list{
          margin-bottom: .8rem;
          width: calc(50% - .4rem);
          margin-right: .8rem;
          border-radius: 5px;
          height: 4.46rem;
          line-height: 4.46rem;
          padding-left: .8rem;
          background: linear-gradient(to bottom right, #573bc2 , #9639b4);
          &:nth-child(even){
            margin-right: 0;
          }
          .l-icon{
            width: 3rem;
            height: 3rem;
            display: inline-block;
            vertical-align: middle;
            margin-top: -3px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .l-f{
            font-size: 1rem;
            color: #fff;
            margin-left: .4rem;
          }
        }
      }
      .van-swipe__indicators{
        .van-swipe__indicator{
          background-color: #ddd;
          width: 0.8rem;
          height: 0.8rem;
        }
        .van-swipe__indicator--active{
          background-color: #4a79df;
        }
      }
    }
    .work{
      padding-bottom: 0.2rem;
      .create-head{
        display: block;
      }
    }
  }
</style>