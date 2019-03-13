<template>
    <div class="order-create">
      <order-form :existList="existList" :readonlyList="readonlyList" :pickerList="pickerList" :mode="'create'"></order-form>
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
      existList:[13,14,15,16,17],
      readonlyList:[0,1,2],
      pickerList:[3,4,5,9,10,11,12]
    };
  },
  methods: {
  },
  mounted() {
  }
};
</script>
<style lang='scss'>
</style>