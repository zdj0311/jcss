import Vue from 'vue'
import Router from 'vue-router'
import maMain from '@/pages/ma-main'
import HomePage from '@/pages/home-page'
import OrderList from '@/pages/order-list'
import OrderHistory from '@/pages/order-history'
import Feedback from '@/pages/feedback'
import userCenter from '@/pages/user-center'
import ServiceTrace from '@/pages/service-trace'
import OrderCreate from '@/pages/order-create'
import OrderResolver from '@/pages/order-resolver'
import OrderDetail from '@/pages/order-detail'
import Evaluation from '@/pages/evaluation'
import Auth from '@/pages/auth'
import Edit from '@/pages/edit'
import DailyLog from '@/pages/daily-log'
import visualization from '@/pages/visualization'
import config from 'config'
import surveyList from '@/pages/survey-list'
import surveyDetail from '@/pages/survey-detail'
import suggest from '@/pages/suggest'
import netsafe from '@/pages/knowladge/netsafe'
import management from '@/pages/knowladge/management'
import database from '@/pages/knowladge/database'
import others from '@/pages/knowladge/others'
import output from '@/pages/knowladge/output'
import Knowladge from '@/pages/knowladge'
Vue.use(Router)
export default new Router({
  base:config.route_proxy?'/jcss/jcss_app':'',
  routes: [
    {
      path:'*',
      redirect: {
        name: 'home_page'
      }
    },
    // 主页
    {
      path:'/',
      redirect: '/home-page',
      component:maMain,
      children:[{
      path: '/home-page',
      name: 'home_page',
      component: HomePage,
      meta: {
        keepAlive: false,
        title: '首页'
      }
    },// 我的工单
    {
      path: '/order-list/:_type/:_mode',
      name: 'order_list',
      component: OrderList,
      meta: {
        keepAlive: false,
        title: '我的工单'
      }
    },// 历史工单
    {
      path: '/order-history/:_type/:_mode',
      name: 'order_history',
      component: OrderHistory,
      meta: {
        keepAlive: false,
        title: '历史工单'
      }
    },// 意见反馈
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
      meta: {
        keepAlive: false,
        title: '意见反馈'
      }
    },// 个人中心
    {
      path: '/user-center',
      name: 'user_center',
      component: userCenter,
      meta: {
        keepAlive: false,
        title: '个人中心'
      }
    },]
    },
    // 服务跟踪
    {
      path: '/service-trace',
      name: 'service_trace',
      component: ServiceTrace,
      meta: {
        keepAlive: false,
        title: '服务跟踪'
      }
    },
    // 工单创建
    {
      path: '/order-create',
      name: 'order_create',
      component: OrderCreate,
      meta: {
        keepAlive: false,
        title: '创建工单'
      }
    },
    // 工单处理
    {
      path: '/order-resolver/:_id',
      name: 'order_resolver',
      component: OrderResolver,
      meta: {
        keepAlive: false,
        title: '工单处理'
      }
    },
    // 工单详情
    {
      path: '/order-detail/:_id',
      name: 'order_detail',
      component: OrderDetail,
      meta: {
        keepAlive: false,
        title: '工单详情'
      }
    },
    // 评价
    {
      path: '/evaluation',
      name: 'evaluation',
      component: Evaluation,
      meta: {
        keepAlive: false,
        title: '评价'
      }
    },
    // 身份认证
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: {
        keepAlive: false,
        title: '身份认证'
      }
    },
    // 信息修改
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
      meta: {
        keepAlive: false,
        title: '信息修改'
      }
    },
    // 日报
    {
      path: '/daily-log',
      name: 'daily_log',
      component: DailyLog,
      meta: {
        keepAlive: false,
        title: '报表'
      }
    },
    // 问卷列表
    {
      path: '/survey-list',
      name: 'survey_list',
      component: surveyList,
      meta: {
        keepAlive: false,
        title: '问卷列表'
      }
    },
    // 问卷详细
    {
      path: '/survey-detail/:_id',
      name: 'survey_detail',
      component: surveyDetail,
      meta: {
        keepAlive: false,
        title: '调查问卷'
      }
    },
    // 可视化 综合管理服务平台
    {
      path: '/visualization',
      name: 'visualization',
      component: visualization,
      meta: {
        keepAlive: false,
        title: '报表'
      }
    },
    // 投诉建议
    {
      path: '/suggest',
      name: 'suggest',
      component: suggest,
      meta: {
        keepAlive: false,
        title: '投诉建议'
      }
    },
    // 知识库
    {
      path: '/knowladge',
      name: 'knowladge',
      component: Knowladge,
        children:[{
          path: 'netsafe',
          name: 'netsafe',
          component: netsafe,
          meta: {
            keepAlive: false,
            title: '网络安全'
          }
        },{
          path: 'database',
          name: 'database',
          component: database,
          meta: {
            keepAlive: false,
            title: '数据存储'
          }
        },{
          path: 'output',
          name: 'output',
          component: output,
          meta: {
            keepAlive: false,
            title: '终端外设'
          }
        },{
          path: 'management',
          name: 'management',
          component: management,
          meta: {
            keepAlive: false,
            title: '管理制度'
          }
        },{
          path: 'others',
          name: 'others',
          component: others,
          meta: {
            keepAlive: false,
            title: '其他'
          }
        }],
      meta: {
        keepAlive: false,
        title: '知识库'
      }
    },
    
  ]
})
