import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Gift',
  //   meta: {
  //     title: '礼品列表',
  //   },
  //   children: [
  //     {
  //       path: '/dashboard',
  //       name: 'GiftIndex',
  //       component: () => import('@/views/gift/index'),
  //       meta: { title: '礼品列表', breadcrumb: false }
  //     },
  //     {
  //       path: 'gifts/:id',
  //       name: 'GiftShow',
  //       hidden: true,
  //       component: () => import('@/views/gift/show'),
  //       meta: { title: '礼品详情', activeMenu: '/gift/index' }
  //     }
  //   ]
  // },
  // {
  //   path: '/resource_libraries',
  //   component: Layout,
  //   redirect: '/resource_libraries',
  //   name: 'ResourceLibrary',
  //   meta: {
  //     title: '素材管理'
  //   },
  //   children: [
  //     {
  //       path: '/resource_libraries',
  //       name: 'ResourceLibraryIndex',
  //       component: () => import('@/views/resource_libraries/index'),
  //       meta: { title: '素材管理', breadcrumb: false }
  //     },
  //     {
  //       path: '/resource_recycle',
  //       name: 'ResourceLibraryRecycle',
  //       component: () => import('@/views/resource_libraries/recycle'),
  //       meta: { title: '回收站' }
  //     }
  //   ]
  // },
  // {
  //   path: '/groups',
  //   component: Layout,
  //   redirect: '/groups',
  //   name: 'Group',
  //   meta: {
  //     title: '商品分组'
  //   },
  //   buttons: [
  //     { text: '新建', path: 'addGroup' }
  //   ],
  //   hasButtonPage: 'Groups',
  //   children: [
  //     {
  //       path: '/groups',
  //       name: 'Groups',
  //       component: () => import('@/views/groups/index'),
  //       meta: { title: '商品分组', breadcrumb: false }
  //     },
  //     {
  //       path: '/groups/:id/groupings',
  //       name: 'GroupGrouping',
  //       component: () => import('@/views/groups/groupings'),
  //       meta: { title: '管理组内商品' }
  //     },
  //     {
  //       path: '/groups/new',
  //       name: 'addGroup',
  //       component: () => import('@/views/groups/edit'),
  //       meta: { title: '新建分组' }
  //     },
  //     {
  //       path: '/groups/:id/edit',
  //       name: 'updateGroup',
  //       component: () => import('@/views/groups/edit'),
  //       meta: { title: '编辑分组' }
  //     }
  //   ]
  // },
  // {
  //   path: '/store_goods',
  //   component: Layout,
  //   redirect: '/store_goods',
  //   name: 'StoreGood',
  //   meta: {
  //     title: '商品管理'
  //   },
  //   buttons: [
  //     { text: '新建商品', path: 'listStoreGood' }
  //   ],
  //   hasButtonPage: 'StoreGoodIndex',
  //   children: [
  //     {
  //       path: '/store_goods/new',
  //       name: 'listStoreGood',
  //       component: () => import('@/views/store_goods/new'),
  //       meta: { title: '选择商品类型' }
  //     },
  //     {
  //       path: '/store_goods/:id/show',
  //       name: 'showStoreGood',
  //       component: () => import('@/views/store_goods/show'),
  //       meta: { title: '商品详情' }
  //     },
  //     {
  //       path: '/store_goods/:id/edit',
  //       name: 'updateStoreGood',
  //       component: () => import('@/views/store_goods/new'),
  //       meta: { title: '编辑商品' }
  //     },
  //     {
  //       path: '/store_goods',
  //       name: 'StoreGoodIndex',
  //       component: () => import('@/views/store_goods/index'),
  //       meta: { title: '商品列表' }
  //     }
  //   ]

  // },
  {
    path: '/channels',
    component: Layout,
    redirect: '/channels',
    name: 'Channel',
    meta: {
      title: '渠道管理'
    },
    children: [
      {
        path: 'search',
        name: 'ChannelSearch',
        component: () => import('@/views/channels/search'),
        meta: {
          title: '渠道列表',
          noCache: true,
          buttons: [
            { text: '新建渠道', path: 'ChannelListNew' }
          ]
        }
      },
      {
        path: 'list_new',
        name: 'ChannelListNew',
        component: () => import('@/views/channels/list_new'),
        meta: { title: '选择类型', noCache: false }
      },
      {
        path: 'new',
        name: 'ChannelNew',
        component: () => import('@/views/channels/edit'),
        meta: { title: '新建渠道', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'ChannelEdit',
        component: () => import('@/views/channels/edit'),
        meta: { title: '编辑渠道', noCache: false }
      },
      {
        path: ':id',
        name: 'ChannelShow',
        component: () => import('@/views/channels/show'),
        meta: { title: '渠道详情', noCache: false }
      },
      {
        path: ':id/worker',
        name: 'ChannelWorker',
        component: () => import('@/views/channels/worker'),
        meta: { title: '员工列表', noCache: false }
      }
    ]
  },

  {
    path: '/registers',
    component: Layout,
    redirect: '/registers',
    name: 'Register',
    meta: {
      title: '注册'
    },
    children: [
      {
        path: 'channels',
        name: 'RegisterChannels',
        component: () => import('@/views/registers/channels'),
        meta: { title: '渠道审核列表', noCache: true }
      },
      {
        path: 'channels/:id/edit',
        name: 'RegisterChannelsEdit',
        component: () => import('@/views/registers/channel_edit'),
        meta: { title: '渠道审核', noCache: false }
      },
      {
        path: 'channel_workers',
        name: 'RegisterChannelWorkers',
        component: () => import('@/views/registers/channel_workers'),
        meta: { title: '员工审核列表', noCache: true }
      },
      {
        path: 'channel_workers/:id/edit',
        name: 'RegisterChannelWorkersEdit',
        component: () => import('@/views/registers/worker_edit'),
        meta: { title: '员工审核', noCache: false }
      },
      {
        path: 'channel_invitation',
        name: 'ChannelInvitation',
        component: () => import('@/views/registers/channel_invitation'),
        meta: {
          title: '渠道邀请',
          noCache: true,
          buttons: [
            { text: '新建邀请', path: 'ChannelInvitationNew' }
          ]
        }
      },
      {
        path: 'channel_invitation/:id/edit',
        name: 'ChannelInvitationEdit',
        component: () => import('@/views/registers/channel_invitation_edit'),
        meta: { title: '修改邀请', noCache: false }
      },
      {
        path: 'channel_invitation/new',
        name: 'ChannelInvitationNew',
        component: () => import('@/views/registers/channel_invitation_edit'),
        meta: { title: '新建邀请', noCache: false }
      },
      {
        path: 'worker_invitation',
        name: 'WorkerInvitation',
        component: () => import('@/views/registers/worker_invitation'),
        meta: {
          title: '员工邀请',
          noCache: true,
          buttons: [
            { text: '新建邀请', path: 'WorkerInvitationNew' }
          ]
        }
      },
      {
        path: 'worker_invitation/:id/edit',
        name: 'WorkerInvitationEdit',
        component: () => import('@/views/registers/worker_invitation_edit'),
        meta: { title: '修改邀请', noCache: false }
      },
      {
        path: 'worker_invitation/new',
        name: 'WorkerInvitationNew',
        component: () => import('@/views/registers/worker_invitation_edit'),
        meta: { title: '新建邀请', noCache: false }
      }
    ]
  },
  {
    path: '/register_setting',
    component: Layout,
    redirect: '/register_setting',
    name: 'RegisterSetting',
    meta: {
      title: '注册'
    },
    children: [
      {
        path: 'edit_channel',
        name: 'EditRegisterChannels',
        component: () => import('@/views/register_setting/edit_channel'),
        meta: { title: '基础设置', noCache: false }
      }
    ]
  },
  {
    path: '/stores',
    component: Layout,
    redirect: '/stores',
    name: 'Store',
    meta: {
      title: '商户'
    },
    children: [
      {
        path: 'channel_label_setting',
        name: 'ChannelLabelSetting',
        component: () => import('@/views/stores/channel_label_setting'),
        meta: { title: '渠道类型设置', noCache: false }
      },
      {
        path: 't_unit_batch_fields_edit',
        name: 'TUnitBatchFieldsEdit',
        component: () => import('@/views/stores/t_unit_batch_fields_edit'),
        meta: { title: '生产批次字段设置', noCache: false }
      },
      {
        path: 'channel_fields_edit',
        name: 'ChannelFieldsEdit',
        component: () => import('@/views/stores/channel_fields_edit'),
        meta: { title: '注册字段设置', noCache: false }
      },
      {
        path: 'product_fields_edit',
        name: 'ProductFieldsEdit',
        component: () => import('@/views/stores/product_fields_edit'),
        meta: { title: '产品字段设置', noCache: false }
      }
    ]
  },
  {
    path: '/employees',
    component: Layout,
    redirect: '/employees',
    name: 'Employees',
    meta: {
      title: '员工列表'
    },
    children: [
      {
        path: '/employees',
        name: 'EmployeesIndex',
        component: () => import('@/views/employees/index'),
        meta: { title: '员工列表', noCache: true }
      },
      {
        path: ':id',
        name: 'EmployeesShow',
        component: () => import('@/views/employees/show'),
        meta: { title: '员工详情', noCache: false }
      }
    ]
  },
  {
    path: '/import_channels',
    component: Layout,
    redirect: '/import_channels',
    name: 'ImportChannel',
    meta: {
      title: '批量导入'
    },
    children: [
      {
        path: 'index',
        name: 'ImportChannelIndex',
        component: () => import('@/views/import_channels/index'),
        meta: { title: '渠道导入', noCache: true, buttons: [
          { text: '渠道批量导入', action: 'import' }]
        }
      }
    ]
  },
  {
    path: '/t_channel_in_receipts',
    component: Layout,
    redirect: '/t_channel_in_receipts/index',
    name: 'TChannelInReceipt',
    meta: {
      title: '入库单'
    },
    children: [
      {
        path: 'index',
        name: 'TChannelInReceiptIndex',
        component: () => import('@/views/t_channel_in_receipts/index'),
        meta: { title: '入库单列表', noCache: true, buttons: [
          { text: '新建入库单', path: 'TChannelInReceiptNew' }]
        }
      },
      {
        path: 'new',
        name: 'TChannelInReceiptNew',
        component: () => import('@/views/t_channel_in_receipts/edit'),
        meta: { title: '新建入库单', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'TChannelInReceiptEdit',
        component: () => import('@/views/t_channel_in_receipts/edit'),
        meta: { title: '新建入库单', noCache: false }
      },
      {
        path: ':id',
        name: 'TChannelInReceiptShow',
        component: () => import('@/views/t_channel_in_receipts/show'),
        meta: { title: '入库详情', noCache: false }
      },
      {
        path: ':id/t_units/new',
        name: 'TChannelInReceiptTunitNew',
        component: () => import('@/views/t_channel_in_receipts/tunit_edit'),
        meta: { title: '新建入库', noCache: false }
      },
      {
        path: ':id/t_units/t_unit_batches',
        name: 'TUnitsInTUnitBatches',
        component: () => import('@/views/t_channel_in_receipts/t_unit_batches'),
        meta: { title: '产品批次明细', noCache: false }
      },
      {
        path: ':id/t_units',
        name: 'TUnitsInTUnit',
        component: () => import('@/views/t_channel_in_receipts/t_units'),
        meta: { title: '追溯码详情', noCache: false }
      },
      {
        path: ':id/finished',
        name: 'TUnitsInTUnitFinished',
        component: () => import('@/views/t_channel_in_receipts/finished'),
        meta: { title: '入库完成', noCache: false }
      }
    ]
  },
  {
    path: '/t_channel_out_receipts',
    component: Layout,
    redirect: '/t_channel_out_receipts/index',
    name: 'TChannelOutReceipt',
    meta: {
      title: '出库单'
    },
    children: [
      {
        path: 'index',
        name: 'TChannelOutReceiptIndex',
        component: () => import('@/views/t_channel_out_receipts/index'),
        meta: { title: '出库单列表', noCache: true, buttons: [
          { text: '新建出库单', path: 'TChannelOutReceiptNew' }]
        }
      },
      {
        path: 'new',
        name: 'TChannelOutReceiptNew',
        component: () => import('@/views/t_channel_out_receipts/edit'),
        meta: { title: '新建出库单', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'TChannelOutReceiptEdit',
        component: () => import('@/views/t_channel_out_receipts/edit'),
        meta: { title: '新建出库单', noCache: false }
      },
      {
        path: ':id',
        name: 'TChannelOutReceiptShow',
        component: () => import('@/views/t_channel_out_receipts/show'),
        meta: { title: '出库详情', noCache: false }
      },
      {
        path: ':id/t_units/new',
        name: 'TChannelOutReceiptTunitNew',
        component: () => import('@/views/t_channel_out_receipts/tunit_edit'),
        meta: { title: '新建出库', noCache: false }
      },
      {
        path: ':id/t_units/t_unit_batches',
        name: 'TUnitsOutTUnitBatches',
        component: () => import('@/views/t_channel_out_receipts/t_unit_batches'),
        meta: { title: '产品批次明细', noCache: false }
      },
      {
        path: ':id/t_units',
        name: 'TUnitsOutTUnit',
        component: () => import('@/views/t_channel_out_receipts/t_units'),
        meta: { title: '追溯码详情', noCache: false }
      },
      {
        path: ':id/finished',
        name: 'TUnitsOutTUnitFinished',
        component: () => import('@/views/t_channel_out_receipts/finished'),
        meta: { title: '出库完成', noCache: false }
      }
    ]
  },
  {
    path: '/t_unit_batches',
    component: Layout,
    redirect: '/t_unit_batches/index',
    name: 'TUnitBatches',
    meta: {
      title: '产品批次明细'
    },
    children: [
      {
        path: 'index',
        name: 'TUnitBatchesIndex',
        component: () => import('@/views/t_unit_batches/index'),
        meta: { title: '产品批次明细', noCache: true }
      },
      {
        path: 'new',
        name: 'TUnitBatchesNew',
        component: () => import('@/views/t_unit_batches/edit'),
        meta: { title: '新建生产批次', noCache: false }
      },
      {
        path: ':id',
        name: 'TUnitBatchesShow',
        component: () => import('@/views/t_unit_batches/show'),
        meta: { title: '生产批次详情', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'TUnitBatchesEdit',
        component: () => import('@/views/t_unit_batches/edit'),
        meta: { title: '编辑生产批次', noCache: false }
      },
      {
        path: ':id/t_units/suite',
        name: 'TUnitBatchesTUnitSuite',
        component: () => import('@/views/t_unit_batches/t_units_suite'),
        meta: { title: '已成套', noCache: false }
      },
      {
        path: ':id/t_units/unsuite',
        name: 'TUnitBatchesTUnitUnSuite',
        component: () => import('@/views/t_unit_batches/t_units_unsuite'),
        meta: { title: '未成套', noCache: false }
      }
    ]
  },
  {
    path: '/t_channel_products',
    component: Layout,
    redirect: '/t_channel_products/index',
    name: 'TChannelProducts',
    meta: {
      title: '库存查询'
    },
    children: [
      {
        path: 'index',
        name: 'TChannelProductsIndex',
        component: () => import('@/views/t_channel_products/index'),
        meta: { title: '库存查询', noCache: true }
      },
      {
        path: ':id',
        name: 'TChannelProductShow',
        component: () => import('@/views/t_channel_products/show'),
        meta: { title: '库存详情', noCache: false }
      },
      {
        path: ':id/t_unit_batches',
        name: 'TChannelProductTUnitBatche',
        component: () => import('@/views/t_channel_products/t_unit_batches'),
        meta: { title: '产品批次明细', noCache: false }
      },
      {
        path: ':id/t_units',
        name: 'TChannelProductTUnits',
        component: () => import('@/views/t_channel_products/t_units'),
        meta: { title: '产品详情', noCache: false }
      },
      {
        path: ':id/t_channel_product_changes',
        name: 'TChannelProductTChannelProductChanges',
        component: () => import('@/views/t_channel_products/t_channel_product_changes'),
        meta: { title: '产品详情', noCache: false }
      }
    ]
  },
  {
    path: '/t_units',
    component: Layout,
    redirect: '/t_units/index',
    name: 'TUnits',
    meta: {
      title: '追溯码查询'
    },
    children: [
      {
        path: 'index',
        name: 'TUnitsIndex',
        component: () => import('@/views/t_units/index'),
        meta: { title: '追溯码查询', noCache: true }
      },
      {
        path: ':id',
        name: 'TUnitShow',
        component: () => import('@/views/t_units/show'),
        meta: { title: '追溯码详情', noCache: false }
      },
      {
        path: ':id/relation',
        name: 'TUnitShowRelation',
        component: () => import('@/views/t_units/relation'),
        meta: { title: '关联信息', noCache: false }
      },
      {
        path: ':id/t_channel_receipts',
        name: 'TUnitShowReceipts',
        component: () => import('@/views/t_units/t_channel_receipts'),
        meta: { title: '出入库记录', noCache: false }
      }
    ]
  },
  {
    path: '/wework',
    component: Layout,
    redirect: '/wework/authorize',
    name: 'Wework',
    meta: {
      title: '绑定企业微信'
    },
    children: [
      {
        path: 'authorize',
        name: 'WeworkAuthorize',
        component: () => import('@/views/wework/authorize'),
        meta: { title: '绑定企业微信', noCache: false }
      },
      {
        path: 'info',
        name: 'WeworkInfo',
        component: () => import('@/views/wework/info'),
        meta: { title: '绑定企业微信', noCache: false }
      }
    ]
  },
  {
    path: '/weworks_users',
    component: Layout,
    redirect: '/weworks_users/index',
    name: 'WeworksUsers',
    meta: {
      title: '员工列表'
    },
    children: [
      {
        path: 'index',
        name: 'WeworkUserIndex',
        component: () => import('@/views/weworks_users/index'),
        meta: { title: '员工列表', noCache: true }
      }
    ]
  },
  {
    path: '/products',
    component: Layout,
    redirect: '/products/index',
    name: 'Products',
    meta: {
      title: '产品列表'
    },
    children: [
      {
        path: 'index',
        name: 'ProductIndex',
        component: () => import('@/views/products/index'),
        meta: {
          title: '产品列表',
          noCache: true,
          buttons: [
            { text: '新建产品', path: 'ProductNew' }
          ]
        }
      },
      {
        path: 'new',
        name: 'ProductNew',
        component: () => import('@/views/products/edit'),
        meta: { title: '新建产品', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'ProductEdit',
        component: () => import('@/views/products/edit'),
        meta: { title: '编辑产品', noCache: false }
      },
      {
        path: ':id',
        name: 'ProductShow',
        component: () => import('@/views/products/show'),
        meta: { title: '产品详情', noCache: false }
      },
      {
        path: ':id/product_processes',
        name: 'ProductShowProcesses',
        component: () => import('@/views/products/product_processes'),
        meta: { title: '生产加工流程', noCache: false }
      },
      {
        path: ':id/product_materials',
        name: 'ProductShowMaterials',
        component: () => import('@/views/products/product_materials'),
        meta: { title: '产品原材料', noCache: false }
      },
      {
        path: ':id/product_batches',
        name: 'ProductShowBatches',
        component: () => import('@/views/products/product_batches'),
        meta: { title: '产品原材料', noCache: false }
      },
      {
        path: ':id/t_unit_specs',
        name: 'ProductShowTUnitSpecs',
        component: () => import('@/views/products/t_unit_specs'),
        meta: { title: '包装规格管理', noCache: false }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: '/lmp/portal/admin/',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
