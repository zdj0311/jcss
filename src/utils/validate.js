import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN';//引入中文文件

Vue.use(VeeValidate)
// 配置中文
Validator.localize('zh', zh);

