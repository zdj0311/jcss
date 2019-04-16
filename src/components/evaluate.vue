<template>
    <div class="evaluation">
      <div class="eva-head">
        <div class="eva-result"><label>工单编号</label><span>{{fData && fData.billData.code}}</span></div>
        <div class="eva-result"><label>工单主题</label><span>{{fData && fData.billData.subject}}</span></div>
        <div class="eva-result"><label>工单结果</label><span>{{fData && fData.billData.billRes}}</span></div>
        <div class="eva-result"><label>工单描述</label><span>{{fData && fData.billData.billPlan}}</span></div>
      </div>
      <div class="eva-content">
        <slot name="rate"></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'evaluation',
  data() {
    return {
    };
  },
  props: {
    fData: {
      type: Object
    }
  },
  methods: {
  }
}
</script>
<style lang='scss'>
.evaluation {
  .eva-head {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    padding: 1rem 0 1.6rem;
    .eva-h {
      display: flex;
      .eva-subject {
        margin-left: 0.71rem;
        font-size: 1.14rem;
        color: #000;
      }
    }
    .eva-result {
      margin: 0 15px;
      color: #666;
      font-size: 1rem;
      border: solid 1px #eee;
      padding: 6px 0.8rem;
      border-bottom: none;
      &:last-child{
        border-bottom: solid 1px #eee;
      }
      label{
        width: 28%;
        display: inline-block;
        border-right: solid 1px #eee;
      }
      span{
        padding-left:0.8rem;
      }
    }
  }
  .eva-status {
    width: 5.32rem;
    height: 1.71rem;
    line-height: 1.71rem;
    border-top-right-radius: 1.79rem;
    border-bottom-right-radius: 1.79rem;
    background: linear-gradient(to right, #4a79df, #7db6ff);
    color: #fff;
    font-size: 1rem;
    padding-left: 1.07rem;
  }
  .eva-content {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    margin-top: 0.8rem;
    .eva-title {
      font-size: 1.14rem;
      color: #000;
      text-align: center;
      line-height: 3.29rem;
      border-bottom: solid 1px #eee;
    }
    .van-rate {
      margin-top: 0.4rem;
      text-align: center;
    }
    .rate-name {
      text-align: center;
      font-size: 1rem;
      color: #ff9c00;
      margin-top: 0.71rem;
    }
    .van-field--min-height .van-field__control {
      background-color: #f5f5f5;
      border: solid 1px #eee;
      margin: 0.71rem 0 2.14rem;
      min-height: 5rem;
      padding: 0.36rem 0.71rem;
      border-radius: 0.36rem;
      font-size: 1rem;
    }
  }
} 
</style>