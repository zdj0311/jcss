<template>
    <div class="order-resolver">
      <order-form :readonlyList="readonlyList" :mode="'edit'"></order-form>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,loadWorkflow,updateWorkflow,upload}
 from 'controller/order-create'
import orderForm from 'components/order-form'
export default {
  components: {orderForm},
  data() {
    return {
        existList:[2],
        readonlyList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        loadData: {},
    };
  },
  methods: {
  },
  created(){  
  },
  mounted() {
  }
};
</script>
<style lang='scss'>
</style>