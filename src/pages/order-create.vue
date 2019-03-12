<template>
    <div class="order-create">
      <order-form :existList="existList" :readonlyList="readonlyList" :pickerList="pickerList"></order-form>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,loadWorkflow,updateWorkflow,upload}
 from 'controller/order-create'
import orderForm from 'components/order-form'
import form from 'utils/form-all'
export default {
  components: {orderForm},
  data() {
    return {
      existList:[12,13,14,15,16],
      readonlyList:[0,1,2],
      pickerList:[3,4,5,9,10,11]
    };
  },
  methods: {
  },
  mounted() {
    console.log(form)
  }
};
</script>
<style lang='scss'>
</style>