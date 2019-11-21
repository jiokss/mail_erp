import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
     {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  //  oms 系统导航
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'editApply',
      name: 'editApply',
      component: () => import('@/views/oms/applyPage/editApply'),
      meta: {title: '新增申请单', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'applyPage',
      name: 'applyPage',
      component: () => import('@/views/oms/applyPage/applyPage'),
      meta: {title: '申请单管理', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'specialItem',
      name: 'specialItem',
      component: () => import('@/views/oms/applyPage/specialItem'),
      meta: {title: '审批管理', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'logistics',
      name: 'logistics',
      component: () => import('@/views/oms/applyPage/logistics'),
      meta: {title: '物流打印', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'bulkOrder',
      name: 'bulkOrder',
      component: () => import('@/views/oms/applyPage/bulkOrder'),
      meta: {title: '批量开单', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'sampleManage',
      name: 'sampleManage',
      component: () => import('@/views/oms/applyPage/sampleManage'),
      meta: {title: '样本管理', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'applyInquiryDel',
      name: 'applyInquiryDel',
      component: () => import('@/views/oms/applyPage/applyInquiryDel'),
      meta: {title: '废弃申请单', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'applyInquiryCw',
      name: 'applyInquiryCw',
      component: () => import('@/views/oms/applyPage/applyInquiryCw'),
      meta: {title: '已退样的协议样本', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    children: [{
      path: 'phoneApply',
      name: 'phoneApply',
      component: () => import('@/views/oms/phoneApply/editApply'),
      meta: {title: '手机端新增', icon: 'product-list'}
    }]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '申请模块', icon: 'order'},
    children: [
      {
        path: 'modifyApply/:id/:req_code',
        name: 'modifyApply',
        component: () => import('@/views/oms/applyPage/editApply'),
        hidden:true
      },
      {
        path: 'phoneApplyPage',
        name: 'phoneApplyPage',
        component: () => import('@/views/oms/applyPage/applyPage'),
        meta: {title: '手机端新增', icon: 'product-list'}
      },

    ],
    hidden: true
  },


  // rms 系统导航
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'medical_task_manage',
      name: 'medical_task_manage',
      component: () => import('@/views/rms/medical_task_manage'),
      meta: {title: '任务管理', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'selectReportNewversion',
      name: 'selectReportNewversion',
      component: () => import('@/views/rms/selectReportNewversion'),
      meta: {title: '任务池', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'selfReportnewVersion',
      name: 'selfReportnewVersion',
      component: () => import('@/views/rms/selfReportnewVersion'),
      meta: {title: '我的任务', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'geneModify',
      name: 'geneModify',
      component: () => import('@/views/rms/geneModify'),
      meta: {title: '疾病基因维护', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'geneReserch',
      name: 'geneReserch',
      component: () => import('@/views/rms/geneReserch'),
      meta: {title: '基因查询', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'reportDelay',
      name: 'reportDelay',
      component: () => import('@/views/rms/reportDelay'),
      meta: {title: '迟发通知', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'dis_information',
      name: 'dis_information',
      component: () => import('@/views/rms/dis_information'),
      meta: {title: '资料缺失记录', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'gene_locking',
      name: 'gene_locking',
      component: () => import('@/views/rms/gene_locking'),
      meta: {title: '人工锁定', icon: 'product-list'}
    }]
  },
  {
    path: '/rms',
    component: Layout,
    children: [{
      path: 'report_special_serach',
      name: 'report_special_serach',
      component: () => import('@/views/rms/report_special_serach'),
      meta: {title: '案例统计', icon: 'product-list'}
    }]
  },
  // {
  //   path: '/rms',
  //   component: Layout,
  //   children: [{
  //     path: 'report_special_serach',
  //     name: 'report_special_serach',
  //     component: () => import('@/views/rms/report_special_serach'),
  //     meta: {title: '退样物流', icon: 'product-list'}
  //   }]
  // },

  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  // mode: 'history',   //哈希打正式包地址报404
  routes: constantRouterMap
})

