<template>
    <div class="order-resolver">
      <order-form :readonlyList="readonlyList" :create=false :fData="loadData.billData" v-if="loadData.billData"></order-form>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,loadWorkflow,updateWorkflow,upload}
 from 'controller/order-create'
import orderForm from 'components/order-form'
import tool from 'utils/tool'
export default {
  components: {orderForm},
  data() {
    return {
        readonlyList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        loadData: {},
    };
  },
  methods: {
    /**
     * @desc 工作流初始化
    */
    loadWorkflow(){
      loadWorkflow.bind(this)(tool.getQueryString('id')?tool.getQueryString('id'):276).then(res=>{
        this.loadData = res;
      }) 
    }
  },
  created(){
    this.loadWorkflow();
    
  },
  mounted() {
  }
};
</script>
<style lang='scss'>
</style>