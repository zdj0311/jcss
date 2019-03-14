<template>
</template>
<script>
export default {
  data() {
    return {
 
    };
  },
  methods: {
      getNextNodes(){
        var formData = new FormData();
        formData.append('curNodeId_',this.fData?this.fData.workflowBean.curNodeId_:this.form.curNodeId_)
        formData.append('definitionId_',this.fData?this.fData.workflowBean.definitionId_:this.form.definitionId_)
        formData.append("workflowVar_['wUserType']",this.fData?this.fData.wUserType:this.form.wUserType)
        formData.append("workflowVar_['wCustomerUserId']",this.fData?this.fData.wCustomerUserId:'')
        return getNextNodes.bind(this)(formData)
      },
      get(){
          console.log(1)
      }
  },
}
</script>