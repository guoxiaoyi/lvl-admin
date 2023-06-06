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
  {
    path: '/groups',
    component: Layout,
    redirect: '/groups',
    name: 'Group',
    meta: {
      title: '商品分组'
    },
    children: [
      {
        path: '/groups',
        name: 'Groups',
        component: () => import('@/views/groups/index'),
        meta: {
          title: '商品分组',
          noCache: true,
          buttons: [
            { text: '新建', action: 'create_group', perms: ['store_good_manage'] }
          ]
        }
      },
      {
        path: '/groups/:id/groupings',
        name: 'GroupGrouping',
        component: () => import('@/views/groups/groupings'),
        meta: {
          title: '管理组内商品',
          buttons: [
            { text: '添加商品', action: 'add_product_in_group', perms: ['store_good_manage'] }
          ],
          activeMenu: '/groups'
        }
      }
    ]
  },
  {
    path: '/store_goods',
    component: Layout,
    redirect: '/store_goods',
    name: 'StoreGood',
    meta: { title: '商品管理' },
    children: [
      {
        path: 'list_new',
        name: 'StoreGoodListNew',
        component: () => import('@/views/store_goods/list_new'),
        meta: {
          title: '选择商品类型'
        }
      },
      {
        path: 'new',
        name: 'StoreGoodNew',
        component: () => import('@/views/store_goods/edit'),
        meta: { title: '新建商品', activeMenu: '/store_goods' }
      },
      {
        path: '/store_goods/stock_quantity_warning',
        name: 'StoreGoodStockQuantityWraning',
        component: () => import('@/views/store_goods/stock_quantity_warning'),
        meta: {
          title: '库存预警',
          noCache: true,
          buttons: [
            { text: '新建商品', path: 'StoreGoodListNew', perms: ['store_good_manage'] }
          ],
          activeMenu: '/store_goods'
        }
      },
      {
        path: ':id',
        name: 'StoreGoodShow',
        component: () => import('@/views/store_goods/show'),
        meta: { title: '商品详情', activeMenu: '/store_goods' }
      },
      {
        path: ':id/edit',
        name: 'StoreGoodEdit',
        component: () => import('@/views/store_goods/edit'),
        meta: { title: '编辑商品', activeMenu: '/store_goods' }
      },
      {
        path: ':id/stock_changes',
        name: 'StoreGoodStockChange',
        component: () => import('@/views/store_goods/stock_changes'),
        meta: { title: '库存管理', activeMenu: '/store_goods' }
      },
      {
        path: ':id/verified_coupons',
        name: 'StoreGoodVerifiedCoupon',
        component: () => import('@/views/store_goods/verified_coupons'),
        meta: { title: '顾客核销卡券记录', activeMenu: '/store_goods' }
      },
      {
        path: ':id/coupons',
        name: 'StoreGoodCoupon',
        component: () => import('@/views/store_goods/coupons'),
        meta: { title: '卡密管理', buttons: [
          { text: '批量导入卡密', path: 'StoreGoodCouponNew', perms: ['store_good_manage'] }
        ], activeMenu: '/store_goods' }
      },
      {
        path: ':id/lfl_coupons',
        name: 'StoreGoodLflCoupon',
        component: () => import('@/views/store_goods/lfl_coupons'),
        meta: { title: '卡券管理', activeMenu: '/store_goods' }
      },
      {
        path: ':id/coupons/new',
        name: 'StoreGoodCouponNew',
        component: () => import('@/views/store_goods/coupons_new'),
        meta: { title: '卡密导入', activeMenu: '/store_goods' }
      },
      {
        path: '/store_goods',
        name: 'StoreGoodIndex',
        component: () => import('@/views/store_goods/index'),
        meta: {
          title: '商品列表',
          noCache: true,
          buttons: [
            { text: '新建商品', path: 'StoreGoodListNew', perms: ['store_good_manage'] }
          ],
          activeMenu: '/store_goods'
        }
      }
    ]
  },
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
            { text: '新建渠道', path: 'ChannelListNew', perms: ['channel_list'] }
          ]
        }
      },
      {
        path: 'list_new',
        name: 'ChannelListNew',
        component: () => import('@/views/channels/list_new'),
        meta: { title: '选择类型', noCache: false, activeMenu: '/channels/search' }
      },
      {
        path: 'new',
        name: 'ChannelNew',
        component: () => import('@/views/channels/edit'),
        meta: { title: '新建渠道', noCache: false, activeMenu: '/channels/search' }
      },
      {
        path: ':id/edit',
        name: 'ChannelEdit',
        component: () => import('@/views/channels/edit'),
        meta: { title: '编辑渠道', noCache: false, activeMenu: '/channels/search' }
      },
      {
        path: ':id',
        name: 'ChannelShow',
        component: () => import('@/views/channels/show'),
        meta: { title: '渠道详情', noCache: false, activeMenu: '/channels/search' }
      },
      {
        path: ':id/worker',
        name: 'ChannelWorker',
        component: () => import('@/views/channels/worker'),
        meta: { title: '员工列表', noCache: false, activeMenu: '/channels/search' }
      },
      {
        path: ':id/coupon_verification_stocks',
        name: 'ChanneCouponVerificationStock',
        component: () => import('@/views/channels/coupon_verification_stocks'),
        meta: { title: '渠道卡券', noCache: false, activeMenu: '/channels/search', buttons: [
          { text: '新建核销', path: 'CouponVerificationAuditsNew', perms: ['coupon_verify_manage'], needParams: true },
          { text: '核销记录', path: 'CouponVerificationAuditsIndex', perms: ['coupon_verify_manage'], needParams: true }
        ] }
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
        meta: { title: '渠道审核列表', noCache: true, activeMenu: '/channels/search' }
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
        meta: { title: '员工审核列表', noCache: true, activeMenu: '/employees' }
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
            { text: '新建邀请', path: 'ChannelInvitationNew', perms: ['channel_setting'] }
          ]
        }
      },
      {
        path: 'channel_invitation/:id/edit',
        name: 'ChannelInvitationEdit',
        component: () => import('@/views/registers/channel_invitation_edit'),
        meta: { title: '修改邀请', noCache: false, activeMenu: '/registers/channel_invitation' }
      },
      {
        path: 'channel_invitation/new',
        name: 'ChannelInvitationNew',
        component: () => import('@/views/registers/channel_invitation_edit'),
        meta: { title: '新建邀请', noCache: false, activeMenu: '/registers/channel_invitation' }
      },
      {
        path: 'worker_invitation',
        name: 'WorkerInvitation',
        component: () => import('@/views/registers/worker_invitation'),
        meta: {
          title: '员工邀请',
          noCache: true,
          buttons: [
            { text: '新建邀请', path: 'WorkerInvitationNew', perms: ['channel_setting'] }
          ],
          activeMenu: '/registers/channel_invitation'
        }
      },
      {
        path: 'worker_invitation/:id/edit',
        name: 'WorkerInvitationEdit',
        component: () => import('@/views/registers/worker_invitation_edit'),
        meta: { title: '修改邀请', noCache: false, activeMenu: '/registers/channel_invitation' }
      },
      {
        path: 'worker_invitation/new',
        name: 'WorkerInvitationNew',
        component: () => import('@/views/registers/worker_invitation_edit'),
        meta: { title: '新建邀请', noCache: false, activeMenu: '/registers/channel_invitation' }
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
    name: 'Stores',
    meta: {
      title: '商户'
    },
    children: [
      {
        path: 'channel_label_setting',
        name: 'ChannelLabelSetting',
        component: () => import('@/views/stores/channel_label_setting'),
        meta: { title: '渠道类型设置', noCache: false, activeMenu: '/register_setting/edit_channel' }
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
        meta: { title: '注册字段设置', noCache: false, activeMenu: '/registers/channel_invitation' }
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
        meta: { title: '员工详情', noCache: false, activeMenu: '/employees' }
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
          { text: '渠道批量导入', action: 'import', perms: ['import_channel'] }]
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
          { text: '新建入库单', path: 'TChannelInReceiptNew', perms: ['t_unit_manage'] }]
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
          { text: '新建出库单', path: 'TChannelOutReceiptNew', perms: ['t_unit_manage'] }]
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
        meta: {
          title: '产品批次明细',
          noCache: true,
          buttons: [
            { text: '新建生产批次', path: 'TUnitBatchesNew', perms: ['t_unit_manage'] }
          ]
        }
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
      },
      {
        path: ':id/t_unit_pack_imports',
        name: 'TUnitBatchesImportUnit',
        component: () => import('@/views/t_unit_batches/t_unit_pack_imports'),
        meta: { title: '导入关联（追溯码）', noCache: false }
      },
      {
        path: ':id/t_unit_suite_imports',
        name: 'TUnitBatchesImportSunit',
        component: () => import('@/views/t_unit_batches/t_unit_suite_imports'),
        meta: { title: '导入关联（套码）', noCache: false }
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
        meta: { title: '绑定企业微信', noCache: false, activeMenu: '/wework/authorize' }
      },
      {
        path: 'group_welcome',
        name: 'WeworkGroupWelcome',
        component: () => import('@/views/wework/wework_group_welcome'),
        meta: {
          title: '入群欢迎语',
          noCache: true,
          activeMenu: '/wework/welcome',
          buttons: [
            { text: '新建入群欢迎语', path: 'WeworkGroupWelcomeNew', perms: ['wework_manage'] }
          ]
        }
      },
      {
        path: 'group_welcome/new',
        name: 'WeworkGroupWelcomeNew',
        component: () => import('@/views/wework/wework_group_welcome_edit'),
        meta: { title: '编辑入群欢迎语', noCache: false, activeMenu: '/wework/welcome' }
      },
      {
        path: 'group_welcome/:id/edit',
        name: 'WeworkGroupWelcomeEdit',
        component: () => import('@/views/wework/wework_group_welcome_edit'),
        meta: { title: '编辑入群欢迎语', noCache: false, activeMenu: '/wework/welcome' }
      },
      {
        path: 'welcome',
        name: 'WeworkWelcome',
        component: () => import('@/views/wework/wework_welcome'),
        meta: {
          title: '好友欢迎语',
          noCache: true,
          activeMenu: '/wework/welcome',
          buttons: [
            { text: '新建好友欢迎语', path: 'WeworkWelcomeNew', perms: ['wework_manage'] }
          ]
        }
      },
      {
        path: 'welcome/new',
        name: 'WeworkWelcomeNew',
        component: () => import('@/views/wework/wework_welcome_edit'),
        meta: { title: '新建好友欢迎语', noCache: false, activeMenu: '/wework/welcome' }
      },
      {
        path: 'welcome/:id/edit',
        name: 'WeworkWelcomeEdit',
        component: () => import('@/views/wework/wework_welcome_edit'),
        meta: { title: '编辑好友欢迎语', noCache: false, activeMenu: '/wework/welcome' }
      }
    ]
  },
  {
    path: '/wework_group_messages',
    component: Layout,
    redirect: '/wework_group_messages/index',
    name: 'WeworkGroupMessage',
    meta: {
      title: '群发消息'
    },
    children: [
      {
        path: '/wework_group_messages',
        name: 'WeworkGroupMessageIndex',
        component: () => import('@/views/wework_group_message/index'),
        meta: {
          title: '群发消息',
          noCache: true,
          buttons: [
            { text: '新建群发消息', path: 'WeworkGroupMessageNew', perms: ['wework_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'WeworkGroupMessageNew',
        component: () => import('@/views/wework_group_message/edit'),
        meta: { title: '群发消息', noCache: false, activeMenu: '/wework_group_messages' }
      },
      {
        path: ':id',
        name: 'WeworkGroupMessageShow',
        component: () => import('@/views/wework_group_message/show'),
        meta: { title: '群发消息', noCache: false, activeMenu: '/wework_group_messages' }
      },
      {
        path: ':id/edit',
        name: 'WeworkGroupMessageEdit',
        component: () => import('@/views/wework_group_message/edit'),
        meta: { title: '群发消息', noCache: false, activeMenu: '/wework_group_messages' }
      },
      {
        path: ':id/copy',
        name: 'WeworkGroupMessageCopy',
        component: () => import('@/views/wework_group_message/edit'),
        meta: { title: '群发消息', noCache: false, activeMenu: '/wework_group_messages' }
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
            { text: '新建产品', path: 'ProductNew', perms: ['product_list'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'ProductNew',
        component: () => import('@/views/products/edit'),
        meta: { title: '新建产品', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: 'import',
        name: 'ProductImport',
        component: () => import('@/views/products/import'),
        meta: { title: '批量导入', noCache: false,
          buttons: [
            { text: '产品批量导入', action: 'import', perms: ['product_list'] }
          ]
        }
      },
      {
        path: ':id',
        name: 'ProductShow',
        component: () => import('@/views/products/show'),
        meta: { title: '产品详情', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: ':id/edit',
        name: 'ProductEdit',
        component: () => import('@/views/products/edit'),
        meta: { title: '编辑产品', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: ':id/product_processes',
        name: 'ProductShowProcesses',
        component: () => import('@/views/products/product_processes'),
        meta: { title: '生产加工流程', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: ':id/product_materials',
        name: 'ProductShowMaterials',
        component: () => import('@/views/products/product_materials'),
        meta: { title: '产品原材料', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: ':id/product_batches',
        name: 'ProductShowBatches',
        component: () => import('@/views/products/product_batches'),
        meta: { title: '产品原材料', noCache: false, activeMenu: '/products/index' }
      },
      {
        path: ':id/t_unit_specs',
        name: 'ProductShowTUnitSpecs',
        component: () => import('@/views/products/t_unit_specs'),
        meta: { title: '包装规格管理', noCache: false, activeMenu: '/products/index' }
      }
    ]
  },
  {
    path: '/verified_coupons/index',
    component: Layout,
    redirect: '/verified_coupons',
    name: 'VerifiedCoupons',
    meta: {
      title: '顾客核销卡券记录'
    },
    children: [
      {
        path: '/verified_coupons',
        name: 'VerifiedCouponIndex',
        component: () => import('@/views/verified_coupons/index'),
        meta: {
          title: '顾客核销卡券记录',
          noCache: false,
          activeMenu: '/verified_coupons/index'
        }
      }
    ]
  },
  {
    path: '/roles',
    component: Layout,
    redirect: '/roles/index',
    name: 'Roles',
    meta: {
      title: '角色列表'
    },
    children: [
      {
        path: 'index',
        name: 'RoleIndex',
        component: () => import('@/views/roles/index'),
        meta: {
          title: '角色列表',
          noCache: true,
          buttons: [
            { text: '新建角色', path: 'RoleNew', perms: ['accounts_enabled'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'RoleNew',
        component: () => import('@/views/roles/edit'),
        meta: {
          title: '新建角色',
          noCache: false
        }
      },
      {
        path: ':id/edit',
        name: 'RoleEdit',
        component: () => import('@/views/roles/edit'),
        meta: {
          title: '编辑角色',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/accounts',
    component: Layout,
    redirect: '/accounts/index',
    name: 'Account',
    meta: {
      title: '管理员管理'
    },
    children: [
      {
        path: 'index',
        name: 'AccountIndex',
        component: () => import('@/views/accounts/index'),
        meta: { title: '管理员管理', noCache: true, buttons: [
          { text: '新增管理员', path: '/admin/accounts/new', type: 'link', perms: ['accounts_enabled'] }
        ] }
      },
      {
        path: ':id/edit',
        name: 'AccountEdit',
        component: () => import('@/views/accounts/edit'),
        meta: { title: '管理员编辑', noCache: false }
      }
    ]
  },
  {
    path: '/coupon_verification_audits',
    component: Layout,
    redirect: '/coupon_verification_audits/index',
    name: 'CouponVerificationAudits',
    meta: {
      title: '渠道核销记录'
    },
    children: [
      {
        path: 'index',
        name: 'CouponVerificationAuditsIndex',
        component: () => import('@/views/coupon_verification_audits/index'),
        meta: {
          title: '渠道核销记录', noCache: true,
          buttons: [
            { text: '新建核销', path: 'CouponVerificationAuditsNew', perms: ['coupon_verify_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'CouponVerificationAuditsNew',
        component: () => import('@/views/coupon_verification_audits/new'),
        meta: { title: '新建批量核销单', noCache: false, activeMenu: '/coupon_verification_audits/index' }
      },
      {
        path: ':id',
        name: 'CouponVerificationAuditsShow',
        component: () => import('@/views/coupon_verification_audits/show'),
        meta: { title: '渠道核销记录', noCache: false, activeMenu: '/coupon_verification_audits/index' }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    redirect: '/store',
    name: 'Store',
    meta: {
      title: '商城装修'
    },
    children: [
      {
        path: 'point_store',
        name: 'StorePointStore',
        component: () => import('@/views/store/point_store'),
        meta: { title: '首页装修', noCache: false, activeMenu: '/store/point_store' }
      },
      {
        path: 'navs_setting',
        name: 'StoreNavsSetting',
        component: () => import('@/views/store/navs_setting'),
        meta: { title: '导航设置', noCache: false, activeMenu: '/store/point_store' }
      },
      {
        path: 'point_store_theme',
        name: 'StorePointStoreTheme',
        component: () => import('@/views/store/point_store_theme'),
        meta: { title: '商场配色', noCache: false, activeMenu: '/store/point_store' }
      },
      {
        path: 'point_setting_edit',
        name: 'StorePointSettingEdit',
        component: () => import('@/views/store/point_setting_edit'),
        meta: { title: '积分设置', noCache: false, activeMenu: '/freight/edit' }
      },
      {
        path: 'point_store_user_tags_edit',
        name: 'StorePointStoreUserTagsEdit',
        component: () => import('@/views/store/point_store_user_tags_edit'),
        meta: { title: '积分设置', noCache: false, activeMenu: '/freight/edit' }
      }
    ]
  },
  {
    path: '/store_orders',
    component: Layout,
    redirect: '/store_orders/all',
    name: 'StoreOrder',
    meta: {
      title: '商城订单'
    },
    children: [
      {
        path: 'all',
        name: 'StoreOrderAll',
        component: () => import('@/views/store_orders/all'),
        meta: { title: '商城订单', noCache: true }
      },
      {
        path: ':id',
        name: 'StoreOrderShow',
        component: () => import('@/views/store_orders/show'),
        meta: { title: '商城订单详情', noCache: false, activeMenu: '/store_orders/all' }
      }
    ]
  },
  {
    path: '/freight',
    component: Layout,
    redirect: '/freight/edit',
    name: 'Freight',
    meta: {
      title: '运费设置'
    },
    children: [
      {
        path: 'edit',
        name: 'FreightEdit',
        component: () => import('@/views/freight/edit'),
        meta: { title: '运费设置', noCache: false }
      }
    ]
  },
  {
    path: '/import_shipments',
    component: Layout,
    redirect: '/import_shipments',
    name: 'ImportShipments',
    meta: {
      title: '批量发货'
    },
    children: [
      {
        path: '/import_shipments',
        name: 'ImportShipmentsIndex',
        component: () => import('@/views/import_shipments/index'),
        meta: {
          title: '批量发货', noCache: false,
          buttons: [
            { text: '批量发货', action: 'import', perms: ['store_order_manage'] }
          ]
        }
      }
    ]
  },
  {
    path: '/account_changes',
    component: Layout,
    redirect: '/account_changes/current_certification',
    name: 'AccountChangesCurrent',
    meta: {
      title: '实名认证'
    },
    children: [
      {
        path: 'current_certification',
        name: 'AccountChangesCurrentCertification',
        component: () => import('@/views/account_changes/current_certification'),
        meta: { title: '实名认证', noCache: false }
      },
      {
        path: 'certification_new',
        name: 'AccountChangesCurrentCertificationNew',
        component: () => import('@/views/account_changes/certification_new'),
        meta: { title: '实名认证', noCache: false, activeMenu: '/account_changes/current_certification' }
      },
      {
        path: 'certification_edit',
        name: 'AccountChangesCurrentCertificationEdit',
        component: () => import('@/views/account_changes/certification_new'),
        meta: { title: '实名认证', noCache: false, activeMenu: '/account_changes/current_certification' }
      },
      {
        path: '/account_changes',
        name: 'AccountChangesCurrentIndex',
        component: () => import('@/views/account_changes/index'),
        meta: { title: '认证记录', noCache: true }
      },
      {
        path: 'current',
        name: 'AccountChangesCurrentCurrent',
        component: () => import('@/views/account_changes/current'),
        meta: { title: '实名认证详情', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'AccountChangesCurrentEdit',
        component: () => import('@/views/account_changes/current_edit'),
        meta: { title: '实名认证详情', noCache: false }
      },
      {
        path: ':id',
        name: 'AccountChangesCurrentShow',
        component: () => import('@/views/account_changes/show'),
        meta: { title: '实名认证详情', noCache: false }
      }

    ]
  },
  {
    path: '/t_receipt_rebater_rules',
    component: Layout,
    redirect: '/t_receipt_rebater_rules',
    name: 'TReceiptRebaterRules',
    meta: {
      title: '返利规则'
    },
    children: [
      {
        path: '/t_receipt_rebater_rules',
        name: 'TReceiptRebaterRulesIndex',
        component: () => import('@/views/t_receipt_rebater_rules/index'),
        meta: { title: '返利规则', noCache: true,
          buttons: [
            { text: '新建返利规则', path: 'TReceiptRebaterRulesNew', perms: ['receipt_rebater_func_enabled'] }
          ]
        }
      },
      {
        path: ':id/edit',
        name: 'TReceiptRebaterRulesEdit',
        component: () => import('@/views/t_receipt_rebater_rules/edit'),
        meta: { title: '返利规则', noCache: false }
      },
      {
        path: 'new',
        name: 'TReceiptRebaterRulesNew',
        component: () => import('@/views/t_receipt_rebater_rules/edit'),
        meta: { title: '返利规则', noCache: false }
      }

    ]
  },
  {
    path: '/vip_setting',
    component: Layout,
    redirect: '/vip_setting',
    name: 'VipSetting',
    meta: {
      title: '会员管理概览'
    },
    children: [
      {
        path: '/vip_setting',
        name: 'VipSettingDashboard',
        component: () => import('@/views/vip_setting/index'),
        meta: { title: '会员管理概览', noCache: false }
      },
      {
        path: '/vip_setting/register',
        name: 'VipSettingEdit',
        component: () => import('@/views/vip_setting/register'),
        meta: { title: '会员注册', noCache: false }
      },
      {
        path: '/vip_setting/edit_register',
        name: 'VipSettingEditRegister',
        component: () => import('@/views/vip_setting/edit_register'),
        meta: { title: '会员注册', noCache: false, activeMenu: '/vip_setting' }
      },
      {
        path: '/vip_setting/edit_tasks',
        name: 'VipSettingEditTask',
        component: () => import('@/views/vip_setting/edit_tasks'),
        meta: { title: '会员注册', noCache: false }
      }
    ]
  },
  {
    path: '/vip_levels',
    component: Layout,
    redirect: '/vip_levels',
    name: 'VipLevels',
    meta: {
      title: '会员等级设置'
    },
    children: [
      {
        path: '/vip_levels',
        name: 'VipLevelsIndex',
        component: () => import('@/views/vip_levels/index'),
        meta: { title: '会员等级设置', noCache: false }
      }
    ]
  },
  {
    path: '/vip_interests',
    component: Layout,
    redirect: '/vip_interests',
    name: 'VipInterests',
    meta: {
      title: '会员权益'
    },
    children: [
      {
        path: '/vip_interests',
        name: 'VipInterestIndex',
        component: () => import('@/views/vip_interests/index'),
        meta: { title: '会员权益', noCache: false,
          buttons: [
            { text: '添加权益', path: 'VipInterestNew', perms: ['vip_interest_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'VipInterestNew',
        component: () => import('@/views/vip_interests/edit'),
        meta: { title: '添加权益', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'VipInterestEdit',
        component: () => import('@/views/vip_interests/edit'),
        meta: { title: '编辑权益', noCache: false }
      }
    ]
  },
  {
    path: '/vip_profiles',
    component: Layout,
    redirect: '/vip_profiles',
    name: 'VipProfiles',
    meta: {
      title: '会员列表'
    },
    children: [
      {
        path: '/vip_profiles',
        name: 'VipProfilesIndex',
        component: () => import('@/views/vip_profiles/index'),
        meta: { title: '会员列表', noCache: true }
      },
      {
        path: ':id',
        name: 'VipProfilesShow',
        component: () => import('@/views/vip_profiles/show'),
        meta: { title: '会员详情', noCache: false, activeMenu: '/vip_profiles' }
      }
    ]
  },
  {
    path: '/vip_registers',
    component: Layout,
    redirect: '/vip_registers',
    name: 'VipRegisters',
    meta: {
      title: '会员列表'
    },
    children: [
      {
        path: '/vip_registers',
        name: 'VipRegistersIndex',
        component: () => import('@/views/vip_registers/index'),
        meta: { title: '会员列表', noCache: true, activeMenu: '/vip_profiles' }
      },
      {
        path: ':id',
        name: 'VipRegistersShow',
        component: () => import('@/views/vip_registers/show'),
        meta: { title: '会员详情', noCache: false, activeMenu: '/vip_profiles' }
      }
    ]
  },
  {
    path: '/vip_pages_decoration',
    component: Layout,
    redirect: '/vip_pages_decoration',
    name: 'VipPagesDecoration',
    meta: { title: '会员小程序装修' },
    children: [
      {
        path: '/vip_pages_decoration',
        name: 'VipPagesDecorationIndex',
        component: () => import('@/views/vip_pages_decoration/edit'),
        meta: { title: '会员小程序装修', noCache: false }
      },
      {
        path: 'nav',
        name: 'VipPagesDecorationNav',
        component: () => import('@/views/vip_pages_decoration/nav'),
        meta: { title: '会员小程序装修', noCache: false }
      },
      {
        path: 'skin',
        name: 'VipPagesDecorationSkin',
        component: () => import('@/views/vip_pages_decoration/skin'),
        meta: { title: '会员小程序装修', noCache: false }
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
