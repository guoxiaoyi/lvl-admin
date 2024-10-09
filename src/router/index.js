import Vue from 'vue'
import Router from 'vue-router'

import { activityBeforeEnter } from './beforeEnter/activity'
import { userTagBeforeEnter } from './beforeEnter/userTag'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Devices from '@/layout/devices/index.vue'
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
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboards',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', breadcrumb: false, activeMenu: '/dashboard' }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide',
    name: 'Guide',
    meta: {
      title: '新手入门'
    },
    children: [
      {
        path: '/guide',
        name: 'Guides',
        component: () => import('@/views/dashboard/guide'),
        meta: { title: '新手入门', breadcrumb: false }

      }
    ]
  },
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
    path: '/goods',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Goods',
    meta: { title: '礼品列表' },
    children: [
      {
        path: '/goods',
        name: 'GoodsIndex',
        component: () => import('@/views/goods/index.vue'),
        meta: { title: '礼品列表', noCache: true,
          buttons: [
            { text: '新建礼品', path: 'GoodsListNew', perms: ['good_create'] }
          ]
        }
      },
      {
        path: '/goods/list_new',
        name: 'GoodsListNew',
        component: () => import('@/views/goods/list_new.vue'),
        meta: { title: '新建礼品', noCache: false, activeMenu: '/goods' }
      },
      {
        path: 'new',
        name: 'GoodsNew',
        component: () => import('@/views/goods/edit.vue'),
        meta: { title: '新建礼品', noCache: false, activeMenu: '/goods' }
      },
      {
        path: '/goods/stock_quantity_warning',
        name: 'GoodsStockQuantityWraning',
        component: () => import('@/views/goods/stock_quantity_warning'),
        meta: {
          title: '库存预警',
          noCache: true,
          buttons: [
            { text: '新建礼品', path: 'GoodsListNew', perms: ['good_create'] }
          ],
          activeMenu: '/goods'
        }
      },
      {
        path: ':goodsId',
        name: 'GoodsShow',
        component: () => import('@/views/goods/show.vue'),
        meta: { title: '礼品详情', noCache: false, activeMenu: '/goods' }
      },
      {
        path: ':goodsId/stock_changes',
        name: 'GoodsStockChange',
        component: () => import('@/views/goods/stock_changes'),
        meta: { title: '库存管理', activeMenu: '/goods' }
      },
      {
        path: ':goodsId/verified_coupons',
        name: 'GoodsVerifiedCoupon',
        component: () => import('@/views/goods/verified_coupons'),
        meta: { title: '门店核销记录', activeMenu: '/goods' }
      },
      {
        path: ':goodsId/coupons',
        name: 'GoodsCoupon',
        component: () => import('@/views/goods/coupons'),
        meta: { title: '卡密管理', buttons: [
          { text: '批量导入卡密', path: 'GoodCouponNew', perms: ['good_update'] }
        ], activeMenu: '/goods' }
      },
      {
        path: ':goodsId/coupons/new',
        name: 'GoodCouponNew',
        component: () => import('@/views/goods/coupons_new'),
        meta: { title: '卡密导入', activeMenu: '/goods' }
      },
      {
        path: ':goodsId/lfl_coupons',
        name: 'GoodsLflCoupon',
        component: () => import('@/views/goods/lfl_coupons'),
        meta: { title: '卡券管理', activeMenu: '/goods' }
      },
      {
        path: ':goodsId/edit',
        name: 'GoodsEdit',
        component: () => import('@/views/goods/edit.vue'),
        meta: { title: '编辑礼品', noCache: false, activeMenu: '/goods' }
      }
    ]
  },
  {
    path: '/goods_setting',
    component: Layout,
    redirect: '/goods_setting/cash_good_limit',
    name: 'GoodsSetting',
    meta: { title: '礼品设置' },
    children: [
      {
        path: 'cash_good_limit',
        name: 'GoodsSettingCashGoodLimit',
        component: () => import('@/views/goods_setting/cash_good_limit'),
        meta: { title: '礼品设置', noCache: false }
      },
      {
        path: 'stock_notice',
        name: 'GoodsSettingStockNotice',
        component: () => import('@/views/goods_setting/stock_notice'),
        meta: { title: '礼品设置', noCache: false, activeMenu: '/goods_setting/cash_good_limit' }
      },
      {
        path: 'stock',
        name: 'GoodsSettingStock',
        component: () => import('@/views/goods_setting/stock'),
        meta: { title: '礼品设置', noCache: false, activeMenu: '/goods_setting/cash_good_limit' }
      }
    ]
  },
  {
    path: '/suite_cards',
    component: Layout,
    redirect: 'noRedirect',
    name: 'SuiteCard',
    meta: { title: '礼品列表' },
    children: [
      {
        path: '/suite_cards',
        name: 'SuiteCardIndex',
        component: () => import('@/views/suite_cards/index.vue'),
        meta: { title: '礼品列表', noCache: true, buttons: [
          { text: '新建套卡', path: 'SuiteCardNew', perms: ['suite_card_manage'] }
        ], activeMenu: '/goods' }
      },
      {
        path: 'new',
        name: 'SuiteCardNew',
        component: () => import('@/views/suite_cards/edit.vue'),
        meta: { title: '新建套卡', noCache: false, activeMenu: '/goods' }
      },
      {
        path: ':id',
        name: 'SuiteCardShow',
        component: () => import('@/views/suite_cards/show.vue'),
        meta: { title: '套卡详情', noCache: false, activeMenu: '/goods' }
      },
      {
        path: ':id/edit',
        name: 'SuiteCardEdit',
        component: () => import('@/views/suite_cards/edit.vue'),
        meta: { title: '编辑套卡', noCache: false, activeMenu: '/goods' }
      },
      {
        path: ':id/child_card_goods',
        name: 'SuiteCardChildGoods',
        component: () => import('@/views/suite_cards/child_card_goods.vue'),
        meta: { title: '卡片管理', noCache: false, activeMenu: '/goods' }
      },
      {
        path: ':id/child_card_goods/new',
        name: 'SuiteCardChildGoodsNew',
        component: () => import('@/views/goods/edit.vue'),
        meta: { title: '新建卡片', noCache: false, activeMenu: '/goods' }
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
          title: '选择商品类型', activeMenu: '/store_goods'
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
        meta: { title: '门店核销记录', activeMenu: '/store_goods' }
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
          { text: '新建核销', path: 'CouponVerificationAuditsNew', perms: ['coupon_verify_manage'], needParams: true }
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
        meta: { title: '渠道类型设置', noCache: false }
      },
      {
        path: 'nearby_terminal_shops',
        name: 'NearbyTerminalShops',
        component: () => import('@/views/stores/nearby_terminal_shops'),
        meta: { title: '附近门店', noCache: false, activeMenu: '/stores/channel_label_setting' }
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
      },
      {
        path: ':id/rebate_child_users',
        name: 'RebateChildUser',
        component: () => import('@/views/employees/rebate_child_users'),
        meta: { title: '关联用户', noCache: false, activeMenu: '/employees' }
      },
      {
        path: ':id/unit_scan',
        name: 'RebateUnitScan',
        component: () => import('@/views/employees/unit_scan'),
        meta: { title: '关联产品', noCache: false, activeMenu: '/employees' }
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
        meta: { title: '新建入库单', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id/edit',
        name: 'TChannelInReceiptEdit',
        component: () => import('@/views/t_channel_in_receipts/edit'),
        meta: { title: '新建入库单', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id',
        name: 'TChannelInReceiptShow',
        component: () => import('@/views/t_channel_in_receipts/show'),
        meta: { title: '入库详情', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id/t_units/new',
        name: 'TChannelInReceiptTunitNew',
        component: () => import('@/views/t_channel_in_receipts/tunit_edit'),
        meta: { title: '新建入库', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id/t_units/t_unit_batches',
        name: 'TUnitsInTUnitBatches',
        component: () => import('@/views/t_channel_in_receipts/t_unit_batches'),
        meta: { title: '产品批次明细', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id/t_units',
        name: 'TUnitsInTUnit',
        component: () => import('@/views/t_channel_in_receipts/t_units'),
        meta: { title: '追溯码详情', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
      },
      {
        path: ':id/finished',
        name: 'TUnitsInTUnitFinished',
        component: () => import('@/views/t_channel_in_receipts/finished'),
        meta: { title: '入库完成', noCache: false, activeMenu: '/t_channel_in_receipts/index' }
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
        meta: { title: '新建出库单', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      },
      {
        path: ':id',
        name: 'TChannelOutReceiptShow',
        component: () => import('@/views/t_channel_out_receipts/show'),
        meta: { title: '出库详情', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      },
      {
        path: ':id/t_units/new',
        name: 'TChannelOutReceiptTunitNew',
        component: () => import('@/views/t_channel_out_receipts/tunit_edit'),
        meta: { title: '新建出库', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      },
      {
        path: ':id/t_units/t_unit_batches',
        name: 'TUnitsOutTUnitBatches',
        component: () => import('@/views/t_channel_out_receipts/t_unit_batches'),
        meta: { title: '产品批次明细', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      },
      {
        path: ':id/t_units',
        name: 'TUnitsOutTUnit',
        component: () => import('@/views/t_channel_out_receipts/t_units'),
        meta: { title: '追溯码详情', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      },
      {
        path: ':id/finished',
        name: 'TUnitsOutTUnitFinished',
        component: () => import('@/views/t_channel_out_receipts/finished'),
        meta: { title: '出库完成', noCache: false, activeMenu: '/t_channel_out_receipts/index' }
      }
    ]
  },
  {
    path: '/t_unit_batches',
    component: Layout,
    redirect: '/t_unit_batches',
    name: 'TUnitBatches',
    meta: {
      title: '产品批次明细'
    },
    children: [
      {
        path: '/t_unit_batches',
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
        meta: { title: '生产批次详情', noCache: false, activeMenu: '/t_unit_batches' }
      },
      {
        path: ':id/edit',
        name: 'TUnitBatchesEdit',
        component: () => import('@/views/t_unit_batches/edit'),
        meta: { title: '编辑生产批次', noCache: false, activeMenu: '/t_unit_batches' }
      },
      {
        path: ':id/t_units/suite',
        name: 'TUnitBatchesTUnitSuite',
        component: () => import('@/views/t_unit_batches/t_units_suite'),
        meta: { title: '已成套', noCache: false, activeMenu: '/t_unit_batches' }
      },
      {
        path: ':id/t_units/unsuite',
        name: 'TUnitBatchesTUnitUnSuite',
        component: () => import('@/views/t_unit_batches/t_units_unsuite'),
        meta: { title: '未成套', noCache: false, activeMenu: '/t_unit_batches' }
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
    redirect: 'noRedirect',
    name: 'TUnits',
    meta: {
      title: '追溯码查询'
    },
    children: [
      {
        path: '/t_units',
        name: 'TUnitsIndex',
        component: () => import('@/views/t_units/index'),
        meta: { title: '追溯码查询', noCache: false }
      },
      {
        path: 'slice',
        name: 'TUnitsSliceIndex',
        component: () => import('@/views/t_units/slice'),
        meta: { title: '追溯码查询', noCache: false }
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
        meta: { title: '绑定企业微信', noCache: false, activeMenu: '/wework/info' }
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
    redirect: 'noRedirect',
    name: 'Products',
    meta: {
      title: '产品列表'
    },
    children: [
      {
        path: '/products',
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
        meta: { title: '新建产品', noCache: false, activeMenu: '/products' }
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
        component: () => import('@/views/products/layout'),
        meta: { title: '产品详情', noCache: false, activeMenu: '/products' }
      },
      {
        path: ':id/edit',
        name: 'ProductEdit',
        component: () => import('@/views/products/edit'),
        meta: { title: '编辑产品', noCache: false, activeMenu: '/products' }
      },
      {
        path: ':id/source',
        name: 'ProductSource',
        component: () => import('@/views/products/layout'),
        meta: { title: '产品溯源', noCache: false, activeMenu: '/products' }
      },
      // 已经挪到产品溯源中了
      // {
      //   path: ':id/product_processes',
      //   name: 'ProductShowProcesses',
      //   component: () => import('@/views/products/product_processes'),
      //   meta: { title: '生产加工流程', noCache: false, activeMenu: '/products' }
      // },
      // {
      //   path: ':id/product_materials',
      //   name: 'ProductShowMaterials',
      //   component: () => import('@/views/products/product_materials'),
      //   meta: { title: '产品原材料', noCache: false, activeMenu: '/products' }
      // },
      // {
      //   path: ':id/product_batches',
      //   name: 'ProductShowBatches',
      //   component: () => import('@/views/products/product_batches'),
      //   meta: { title: '产品原材料', noCache: false, activeMenu: '/products' }
      // },
      {
        path: ':id/t_unit_specs',
        name: 'ProductShowTUnitSpecs',
        component: () => import('@/views/products/t_unit_specs'),
        meta: { title: '包装规格管理', noCache: false, activeMenu: '/products' }
      }
    ]
  },
  {
    path: '/packaging_specs',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PackagingSpecs',
    meta: {
      title: '产品列表'
    },
    children: [
      {
        path: '/packaging_specs',
        name: 'ProductPackagingSpecs',
        component: () => import('@/views/packaging_specs/index.vue'),
        meta: { title: '包装比例管理', noCache: false, activeMenu: '/packaging_specs', buttons: [
          { text: '新建包装比例', path: 'ProductPackagingSpecsShow', perms: ['t_unit_manage'] }
        ] }
      },
      {
        path: 'new',
        name: 'ProductPackagingSpecsShow',
        component: () => import('@/views/packaging_specs/edit.vue'),
        meta: { title: '包装比例管理', noCache: false, activeMenu: '/packaging_specs' }
      }
    ]
  },
  {
    path: '/verified_coupons',
    component: Layout,
    redirect: '/verified_coupons',
    name: 'VerifiedCoupons',
    meta: {
      title: '门店核销记录'
    },
    children: [
      {
        path: '/verified_coupons',
        name: 'VerifiedCouponIndex',
        component: () => import('@/views/verified_coupons/index'),
        meta: {
          title: '门店核销记录',
          noCache: false,
          activeMenu: '/verified_coupons'
        }
      },
      {
        path: '/verified_coupons/rules',
        name: 'VerifiedCouponRuleIndex',
        component: () => import('@/views/verified_coupons/rules/index'),
        meta: {
          title: '门店核销奖励',
          noCache: true,
          buttons: [
            { text: '新建奖励规则', path: 'VerifiedCouponRuleNew', perms: ['verification_reward_manage'] }
          ]
        }
      },
      {
        path: '/verified_coupons/rules/new',
        name: 'VerifiedCouponRuleNew',
        component: () => import('@/views/verified_coupons/rules/edit'),
        meta: {
          title: '新建奖励规则',
          noCache: false,
          activeMenu: '/verified_coupons/rules'
        }
      },
      {
        path: '/verified_coupons/:id',
        name: 'VerifiedCouponShow',
        component: () => import('@/views/verified_coupons/show'),
        meta: {
          title: '门店核销详情',
          noCache: false,
          activeMenu: '/verified_coupons'
        }
      },
      {
        path: '/verified_coupons/rules/:id/edit',
        name: 'VerifiedCouponRuleEdit',
        component: () => import('@/views/verified_coupons/rules/edit'),
        meta: {
          title: '编辑奖励规则',
          noCache: false,
          activeMenu: '/verified_coupons/rules'
        }
      }
    ]
  },
  {
    path: '/coupons',
    component: Layout,
    redirect: '/coupons',
    name: 'Coupons',
    meta: {
      title: '卡券核销记录'
    },
    children: [
      {
        path: '/coupons',
        name: 'CouponsIndex',
        component: () => import('@/views/coupons/index.vue'),
        meta: {
          title: '卡券核销记录',
          noCache: true
        }
      },
      {
        path: ':id',
        name: 'CouponsShow',
        component: () => import('@/views/coupons/show.vue'),
        meta: {
          title: '卡券核销详情',
          noCache: false,
          activeMenu: '/coupons'
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
            { text: '新建角色', path: 'RoleNew', perms: ['accounts_enabled', 'main_account'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'RoleNew',
        component: () => import('@/views/roles/edit'),
        meta: { title: '新建角色', noCache: false, activeMenu: '/roles/index' }
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
          { text: '新增管理员', path: 'AccountNew', perms: ['accounts_enabled', 'main_account'] }
        ] }
      },
      {
        path: 'new',
        name: 'AccountNew',
        component: () => import('@/views/accounts/new'),
        meta: { title: '新增管理员' }
      },
      {
        path: 'current_edit',
        name: 'AccountCurrentEdit',
        component: () => import('@/views/accounts/current_edit'),
        meta: {
          title: '修改管理员', noCache: false
        }
      },
      {
        path: 'current_edit_password',
        name: 'AccountCurrentEditPassword',
        component: () => import('@/views/accounts/current_edit_password'),
        meta: {
          title: '修改密码', noCache: false
        }
      },
      {
        path: ':id/edit',
        name: 'AccountEdit',
        component: () => import('@/views/accounts/edit'),
        meta: { title: '管理员编辑', noCache: false }
      },
      {
        path: ':id/edit_password',
        name: 'AccountEditPassword',
        component: () => import('@/views/accounts/edit_password'),
        meta: {
          title: '修改密码',
          noCache: false
        }
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
    path: '/company',
    component: Layout,
    redirect: '/company',
    name: 'Company',
    meta: { title: '企业信息管理' },
    children: [
      {
        path: 'edit',
        name: 'CompanyEdit',
        component: () => import('@/views/company/edit'),
        meta: { title: '企业信息管理', noCache: false, activeMenu: '/store/edit' }
      }
    ]
  },
  {
    path: '/addresses',
    component: Layout,
    redirect: '/addresses',
    name: 'Address',
    meta: { title: '收货地址管理' },
    children: [
      {
        path: '/addresses',
        name: 'AddressIndex',
        component: () => import('@/views/addresses/index'),
        meta: { title: '收货地址管理', noCache: false, buttons: [
          { text: '添加收货地址', action: 'add_address', perms: ['main_account'] }
        ] }
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
        path: '/store',
        name: 'StoreShow',
        component: () => import('@/views/stores/show'),
        meta: { title: '我的账户', noCache: false }
      },
      {
        path: 'edit',
        name: 'StoreEdit',
        component: () => import('@/views/stores/edit'),
        meta: { title: '账户设置', noCache: false }
      },
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
        meta: { title: '商城配色', noCache: false, activeMenu: '/store/point_store' }
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
      },
      {
        path: 'security_setting',
        name: 'StoreSecuritySetting',
        component: () => import('@/views/store/security_setting'),
        meta: { title: '安全设置', noCache: false }
      },
      {
        path: 'app_edit',
        name: 'AppEdit',
        component: () => import('@/views/store/app_edit'),
        meta: { title: 'Api设置', noCache: false }
      },
      {
        path: 'order_setting',
        name: 'StoreOrderSetting',
        component: () => import('@/views/store/order_setting'),
        meta: { title: '订单设置', noCache: false }
      },
      {
        path: '/backend_jobs',
        name: 'BackendJobs',
        component: () => import('@/views/store/backend_jobs'),
        meta: { title: '任务管理', noCache: false }
      },
      {
        path: 'attendable_edit',
        name: 'StoreAttendableEdit',
        component: () => import('@/views/store/attendable_edit'),
        meta: { title: '活动设置' }
      },
      {
        path: 'rebate_edit',
        name: 'StoreRebateEdit',
        component: () => import('@/views/store/rebate_edit'),
        meta: { title: '活动设置', activeMenu: '/store/attendable_edit' }
      },
      {
        path: 'data_report_setting_edit',
        name: 'DataReportSettingEdit',
        component: () => import('@/views/store/data_report_setting_edit.vue'),
        meta: { title: '推送设置' }
      },
      {
        path: 'wx_servicer_setting_edit',
        name: 'WxServicerSettingEdit',
        component: () => import('@/views/store/wx_servicer_setting_edit.vue'),
        meta: { title: '客服设置' }
      },
      {
        path: 'coupon_preview',
        name: 'CouponPreview',
        component: () => import('@/views/store/coupon_preview'),
        meta: { title: '卡券功能概览', noCache: false }
      },
      {
        path: 't_unit_preview',
        name: 'TUnitPreview',
        component: () => import('@/views/store/t_unit_preview'),
        meta: { title: '追溯功能概览', noCache: false }
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
      },
      {
        path: '/import_order_shipments',
        name: 'ImportOrderShipmentsIndex',
        component: () => import('@/views/import_order_shipments/index.vue'),
        meta: {
          title: '批量发货', noCache: false,
          buttons: [
            { text: '批量发货', action: 'import_order', perms: ['award_order_manage'] }
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
        meta: { title: '认证记录', noCache: true, activeMenu: '/account_changes/current_certification' }
      },
      {
        path: 'current',
        name: 'AccountChangesCurrentCurrent',
        component: () => import('@/views/account_changes/current'),
        meta: { title: '实名认证详情', noCache: false, activeMenu: '/account_changes/current_certification' }
      },
      {
        path: ':id/edit',
        name: 'AccountChangesCurrentEdit',
        component: () => import('@/views/account_changes/current_edit'),
        meta: { title: '实名认证详情', noCache: false, activeMenu: '/account_changes/current_certification' }
      },
      {
        path: ':id',
        name: 'AccountChangesCurrentShow',
        component: () => import('@/views/account_changes/show'),
        meta: { title: '实名认证详情', noCache: false, activeMenu: '/account_changes/current_certification' }
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
        meta: { title: '返利规则', noCache: false, activeMenu: '/t_receipt_rebater_rules' }
      },
      {
        path: 'new',
        name: 'TReceiptRebaterRulesNew',
        component: () => import('@/views/t_receipt_rebater_rules/edit'),
        meta: { title: '返利规则', noCache: false, activeMenu: '/t_receipt_rebater_rules' }
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
    path: '/vip_stats',
    component: Layout,
    redirect: '',
    name: 'VipStats',
    meta: { title: '会员数据统计' },
    children: [
      {
        path: '/vip_stats',
        name: 'VipStatsDashboard',
        component: () => import('@/views/vip_stats/dashboard'),
        meta: { title: '会员数据统计', noCache: false, activeMenu: '/vip_stats' }
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
  {
    path: '/users',
    component: Layout,
    redirect: '/users',
    name: 'Users',
    meta: { title: '用户管理' },
    children: [
      {
        path: '/users',
        name: 'UserIndex',
        component: () => import('@/views/users/index'),
        meta: { title: '用户管理', noCache: true, activeMenu: '/users' }
      },
      {
        path: 'blocked',
        name: 'UserBlocked',
        component: () => import('@/views/users/blocked'),
        meta: { title: '黑名单', noCache: true }
      },
      {
        path: ':userId',
        name: 'UserShow',
        component: () => import('@/views/users/show'),
        meta: { title: '用户管理', noCache: false, activeMenu: '/users' }
      },
      {
        path: ':userId/edit',
        name: 'UserEdit',
        component: () => import('@/views/users/edit'),
        meta: { title: '编辑用户', noCache: false, activeMenu: '/users' }
      },
      {
        path: '/blocked_phones',
        name: 'UserBlockedPhones',
        component: () => import('@/views/users/blocked_phones/index.vue'),
        meta: { title: '黑名单', noCache: true, buttons: [
          { text: '添加黑名单手机号', action: 'add_blacked_phone', perms: ['user_blocked'] }
        ], activeMenu: '/users/blocked' }
      },
      {
        path: '/whitelist_phones',
        name: 'UserWhitelistPhones',
        component: () => import('@/views/users/whitelist_phones/index.vue'),
        meta: { title: '白名单', noCache: true, buttons: [
          { text: '添加白名单手机号', action: 'add_whiteList_phone', perms: ['whitelist_phone_blocked', 'vip_whitelist_phone_blocked', 'register_whitelist_phone_blocked'] }
        ], activeMenu: '/whitelist_phones' }
      },
      {
        path: '/blocked_phones/file_new',
        name: 'UserBlockedPhoneFileNew',
        component: () => import('@/views/users/blocked_phones/file_new'),
        meta: { title: '黑名单', noCache: false, activeMenu: '/users/blocked' }
      },
      {
        path: '/store/edit_blocked_setting',
        name: 'StoreEditBlockedSetting',
        component: () => import('@/views/store/edit_blocked_setting'),
        meta: { title: '黑名单', noCache: false, activeMenu: '/users/blocked' }
      },
      {
        path: '/whitelist_phones/file_new',
        name: 'UserWhiteListPhoneFileNew',
        component: () => import('@/views/users/whitelist_phones/file_new'),
        meta: { title: '白名单', noCache: false, activeMenu: '/whitelist_phones' }
      },
      {
        path: '/user_tags',
        name: 'UserTags',
        component: () => import('@/views/user_tags/index.vue'),
        meta: { title: '用户标签', noCache: true, buttons: [
          { text: '新建标签', action: 'add_user_tag', perms: ['tag_manage', 'vip_user_tag'] }
        ] }
      },
      {
        path: '/import_external_users',
        name: 'ImportExternalUsers',
        component: () => import('@/views/users/import_external_users'),
        meta: {
          title: '用户导入', noCache: false, buttons: [
            { text: '导入任务', action: 'add_import_user', perms: ['user_list'] }
          ]
        }
      },
      {
        path: '/external_users',
        name: 'ExternalUsers',
        component: () => import('@/views/users/external_users'),
        meta: {
          title: '已导入用户', noCache: false
        }
      },
      {
        path: ':userId/points_trans',
        name: 'PointsPrans',
        component: () => import('@/views/users/points_trans'),
        meta: {
          title: '积分记录', noCache: false
        }
      },
      {
        path: ':userId/cash_balance',
        name: 'CashBalance',
        component: () => import('@/views/users/cash_balance'),
        meta: {
          title: '零钱明细', noCache: false
        }
      }
    ]
  },
  {
    path: '/user_auto_tags',
    name: 'UserAutoTags',
    component: Layout,
    meta: { title: '用户标签', noCache: true },
    children: [
      {
        path: '/user_auto_tags',
        name: 'UserAutoTagIndex',
        component: () => import('@/views/user_tags/auto/index.vue'),
        meta: { title: '新建标签', noCache: true, buttons: [
          { text: '智能打标签', action: 'add_user_auto_tag', perms: ['tag_manage'] }
        ], activeMenu: '/user_tags' }
      },
      {
        path: 'new',
        name: 'UserAutoTagNew',
        component: () => import('@/views/user_tags/auto/edit.vue'),
        meta: { title: '新建标签', noCache: false, activeMenu: '/user_tags' },
        beforeEnter(to, from, next) {
          // 检查当前query是否满足条件
          if (to.query.type === 'compound') {
            to.meta.buttons = [{ text: '添加规则', action: 'add_user_tag_rule', perms: ['intelligent_tag'] }]
          } else {
            to.meta.buttons = []
          }
          next()
        }
      },
      {
        path: ':id/edit',
        name: 'UserAutoTagEdit',
        component: () => import('@/views/user_tags/auto/edit.vue'),
        meta: { title: '编辑标签', noCache: false, buttons: [], activeMenu: '/user_tags' },
        beforeEnter(to, from, next) {
          // 检查当前query是否满足条件
          if (to.query.type === 'compound') {
            to.meta.buttons = [{ text: '添加规则', action: 'add_user_tag_rule', perms: ['intelligent_tag'] }]
          } else {
            to.meta.buttons = []
          }
          userTagBeforeEnter(to, from, next)
        }
      }
    ]
  },
  {
    path: '/wechat_menus',
    component: Layout,
    redirect: '/wechat_menus',
    name: 'WechatMenus',
    meta: { title: '公众号菜单管理' },
    children: [
      {
        path: '/wechat_menus',
        name: 'WechatMenuIndex',
        component: () => import('@/views/wechat_menus/index.vue'),
        meta: { title: '公众号菜单管理', noCatch: false }
      }
    ]
  },
  {
    path: '/cash_trans',
    component: Layout,
    redirect: '/cash_trans',
    name: 'CashTran',
    meta: { title: '用户管理' },
    children: [
      {
        path: '/cash_trans',
        name: 'CashTrans',
        component: () => import('@/views/cash_trans/index'),
        meta: {
          title: '账户概况', noCache: false
        }
      }
    ]
  },
  {
    path: '/wx_replies',
    component: Layout,
    redirect: '/wx_replies',
    name: 'WxReply',
    meta: { title: '自动回复管理' },
    children: [
      {
        path: '/wx_replies',
        name: 'WxReplyIndex',
        component: () => import('@/views/wx_replies/index.vue'),
        meta: { title: '自动回复', noCatch: false, buttons: [
          { text: '添加自动回复', path: 'WxReplyNew', perms: ['wx_reply_manage'] }
        ] }
      },
      {
        path: 'new',
        name: 'WxReplyNew',
        component: () => import('@/views/wx_replies/edit.vue'),
        meta: { title: '自动回复', noCatch: false }
      },
      {
        path: ':id',
        name: 'WxReplyShow',
        component: () => import('@/views/wx_replies/show.vue'),
        meta: { title: '自动回复', noCatch: false }
      },
      {
        path: '/wx_replies/:id/edit',
        name: 'WxReplyEdit',
        component: () => import('@/views/wx_replies/edit.vue'),
        meta: { title: '编辑自动回复', noCatch: false }
      }
    ]
  },
  {
    path: '/recharges',
    component: Layout,
    redirect: '/recharges',
    name: 'Recharge',
    meta: { title: '资金充值' },
    children: [
      {
        path: '/recharges',
        name: 'Recharges',
        component: () => import('@/views/recharges/index.vue'),
        meta: { title: '资金充值', noCache: false, activeMenu: '/recharges/new' }
      },
      {
        path: 'new',
        name: 'RechargeNew',
        component: () => import('@/views/recharges/new'),
        meta: { title: '资金充值', noCache: false }
      },
      {
        path: ':id',
        name: 'RechargeShow',
        component: () => import('@/views/recharges/show'),
        meta: { title: '充值信息', noCache: false, activeMenu: '/recharges/new' }
      }
    ]
  },
  {
    path: '/wechat_authorization',
    component: Layout,
    redirect: '/wechat_authorization/authorize',
    name: 'WechatAuthorization',
    meta: { title: '绑定微信公众号' },
    children: [
      {
        path: 'authorize',
        name: 'WechatAuthorizationAuthorize',
        component: () => import('@/views/wechat_authorization/authorize'),
        meta: { title: '绑定微信公众号', noCatch: false }
      },
      {
        path: 'info',
        name: 'WechatAuthorizationInfo',
        component: () => import('@/views/wechat_authorization/info'),
        meta: { title: '微信公众号概览', noCatch: false }
      },
      {
        path: 'callback',
        name: 'WechatAuthorizationCallback',
        component: () => import('@/views/wechat_authorization/callback'),
        meta: { title: '微信公众号概览', noCatch: false }
      }
    ]
  },
  {
    path: '/actual_cash_trans',
    component: Layout,
    redirect: '/actual_cash_trans',
    name: 'ActualCashTran',
    meta: { title: '红包发放明细' },
    children: [
      {
        path: '/actual_cash_trans',
        name: 'ActualCashTranIndex',
        component: () => import('@/views/actual_cash_trans/index'),
        meta: { title: '红包发放明细', noCache: false }
      }
    ]
  },
  {
    path: '/payment_channel',
    component: Layout,
    redirect: '/payment_channel',
    name: 'PaymentChannel',
    meta: { title: '微信支付设置' },
    children: [
      {
        path: '/payment_channel',
        name: 'PaymentChannelShow',
        component: () => import('@/views/payment_channel/index'),
        meta: { title: '微信支付设置', noCache: false }
      },
      {
        path: '/payment_channel/new',
        name: 'PaymentChannelNew',
        component: () => import('@/views/payment_channel/edit'),
        meta: { title: '微信支付设置', noCache: false }
      },
      {
        path: '/payment_channel/edit',
        name: 'PaymentChannelEditPreview',
        component: () => import('@/views/payment_channel/edit_preview'),
        meta: { title: '微信支付设置', noCache: false }
      },
      {
        path: '/payment_channel/reset',
        name: 'PaymentChannelReset',
        component: () => import('@/views/payment_channel/edit'),
        meta: { title: '微信支付设置', noCache: false }
      }
    ]
  },
  {
    path: '/red_pack_exchanges',
    component: Layout,
    redirect: '/red_pack_exchanges',
    name: 'RedPackExchanges',
    meta: { title: '红包发放明细' },
    children: [
      {
        path: '/red_pack_exchanges',
        name: 'RedPackExchangeIndex',
        component: () => import('@/views/red_pack_exchanges/index'),
        meta: { title: '红包提现明细', noCache: false }
      }
    ]
  },
  {
    path: '/wechat_message_templates',
    component: Layout,
    redirect: '/wechat_message_templates',
    name: 'WechatMessageTemplates',
    meta: { title: '消息推送' },
    children: [
      {
        path: '/wechat_message_templates',
        name: 'WechatMessageTemplateIndex',
        component: () => import('@/views/wechat_message_templates/index'),
        meta: { title: '消息推送', noCache: false }
      }
    ]
  },
  {
    path: '/award_orders',
    component: Layout,
    redirect: '/award_orders/all',
    name: 'AwardOrders',
    meta: { title: '兑奖订单' },
    children: [
      {
        path: 'all',
        name: 'AwardOrderAll',
        component: () => import('@/views/award_orders/index'),
        meta: { title: '兑奖订单', noCache: true }
      },
      {
        path: ':id',
        name: 'AwardOrderShow',
        component: () => import('@/views/award_orders/show.vue'),
        meta: { title: '兑奖订单详情', noCache: false, activeMenu: '/award_orders/all' }
      }
    ]
  },
  {
    path: '/rebate_orders',
    component: Layout,
    redirect: '/rebate_orders/all',
    name: 'RebateOrders',
    meta: { title: '返利订单' },
    children: [
      {
        path: 'all',
        name: 'RebateOrderAll',
        component: () => import('@/views/rebate_orders/index'),
        meta: { title: '返利订单', noCache: true, buttons: [
          { text: '未提交导购返利订单', path: 'RebateOrderPending', hiddenIcon: true, perms: ['award_order_manage'] }
        ] }
      },
      {
        path: 'pending',
        name: 'RebateOrderPending',
        component: () => import('@/views/rebate_orders/pending'),
        meta: { title: '未提交导购返利订单', noCache: false, activeMenu: '/rebate_orders/all' }
      },
      {
        path: ':id',
        name: 'RebateOrderShow',
        component: () => import('@/views/rebate_orders/show'),
        meta: { title: '返利订单', noCache: false, activeMenu: '/rebate_orders/all' }
      }
    ]
  },
  {
    path: '/invited_orders',
    component: Layout,
    redirect: '/invited_orders/all',
    name: 'InvitedOrders',
    meta: { title: '分享达标订单' },
    children: [
      {
        path: 'all',
        name: 'InvitedOrderAll',
        component: () => import('@/views/invited_orders/index'),
        meta: { title: '分享达标订单', noCache: true, buttons: [
          { text: '未提交分享达标订单', path: 'InvitedOrderPending', hiddenIcon: true, perms: ['micro_page_manage'] }
        ] }
      },
      {
        path: 'pending',
        name: 'InvitedOrderPending',
        component: () => import('@/views/invited_orders/pending'),
        meta: { title: '未提交分享达标订单', noCache: true, activeMenu: '/invited_orders/all' }
      },
      {
        path: ':id',
        name: 'InvitedOrderShow',
        component: () => import('@/views/invited_orders/show'),
        meta: { title: '分享达标订单', noCache: false, activeMenu: '/invited_orders/all' }
      }
    ]
  },
  {
    path: '/suite_card_exchange_records',
    component: Layout,
    redirect: '/suite_card_exchange_records',
    name: 'SuiteCardExchange',
    meta: { title: '集卡兑换记录' },
    children: [
      {
        path: '/suite_card_exchange_records',
        name: 'SuiteCardExchangeIndex',
        component: () => import('@/views/suite_card_exchange_records/index'),
        meta: { title: '集卡兑换记录', noCache: true }
      },
      {
        path: ':id',
        name: 'SuiteCardExchangeShow',
        component: () => import('@/views/suite_card_exchange_records/show'),
        meta: { title: '集卡兑换记录', noCache: false, activeMenu: '/suite_card_exchange_records' }
      }
    ]
  },
  {
    path: '/bank_card',
    component: Layout,
    redirect: '/bank_card',
    name: 'BankCard',
    meta: { title: '财务设置' },
    children: [
      {
        path: '/bank_card',
        name: 'BankCardIndex',
        component: () => import('@/views/bank_card/index'),
        meta: { title: '财务设置', noCache: false }
      },
      {
        path: '/bank_card/new',
        name: 'BankCardNew',
        component: () => import('@/views/bank_card/edit'),
        meta: { title: '财务设置', noCache: false, activeMenu: '/bank_card' }
      },
      {
        path: '/bank_card/edit',
        name: 'BankCardEdit',
        component: () => import('@/views/bank_card/edit'),
        meta: { title: '财务设置', noCache: false, activeMenu: '/bank_card' }
      },
      {
        path: '/invoice',
        name: 'Invoice',
        component: () => import('@/views/invoice/index'),
        meta: { title: '财务设置', noCache: false, activeMenu: '/bank_card' }
      },
      {
        path: '/invoice/new',
        name: 'InvoiceNew',
        component: () => import('@/views/invoice/edit'),
        meta: { title: '财务设置', noCache: false, activeMenu: '/bank_card' }
      },
      {
        path: '/invoice/edit',
        name: 'InvoiceEdit',
        component: () => import('@/views/invoice/edit'),
        meta: { title: '财务设置', noCache: false, activeMenu: '/bank_card' }
      }
    ]
  },
  {
    path: '/withdraws',
    component: Layout,
    redirect: '/withdraws',
    name: 'Withdraw',
    meta: { title: '资金提现' },
    children: [
      {
        path: '/withdraws',
        name: 'WithdrawIndex',
        component: () => import('@/views/withdraws/index'),
        meta: { title: '资金提现', noCache: false, activeMenu: '/withdraws/new' }
      },
      {
        path: 'new',
        name: 'WithdrawNew',
        component: () => import('@/views/withdraws/new'),
        meta: { title: '资金提现', noCache: false }
      },
      {
        path: ':id',
        name: 'WithdrawShow',
        component: () => import('@/views/withdraws/show'),
        meta: { title: '资金提现', noCache: false, activeMenu: '/withdraws/new' }
      }
    ]
  },
  {
    path: '/units_trans',
    component: Layout,
    redirect: '/units_trans',
    name: 'UnitsTrans',
    meta: { title: '二维码明细' },
    children: [
      {
        path: '/units_trans',
        name: 'UnitsTranIndex',
        component: () => import('@/views/units_trans/index'),
        meta: { title: '二维码明细', noCache: false, activeMenu: '/cash_trans' }
      }
    ]
  },
  {
    path: '/sms_trans',
    component: Layout,
    redirect: '/sms_trans',
    name: 'SmsTrans',
    meta: { title: '短信明细' },
    children: [
      {
        path: '/sms_trans',
        name: 'SmsTranIndex',
        component: () => import('@/views/sms_trans/index'),
        meta: { title: '短信明细', noCache: false, activeMenu: '/cash_trans' }
      }
    ]
  },
  {
    path: '/logistics_trans',
    component: Layout,
    redirect: '/logistics_trans',
    name: 'LogisticsTrans',
    meta: { title: '物流查询明细' },
    children: [
      {
        path: '/logistics_trans',
        name: 'LogisticsTranIndex',
        component: () => import('@/views/logistics_trans/index'),
        meta: { title: '物流查询明细', noCache: false, activeMenu: '/cash_trans' }
      }
    ]
  },
  {
    path: '/miniprogram_phone_trans',
    component: Layout,
    redirect: '/miniprogram_phone_trans',
    name: 'MiniprogramPhoneTrans',
    meta: { title: '小程序获取手机号明细' },
    children: [
      {
        path: '/miniprogram_phone_trans',
        name: 'MiniprogramPhoneTranIndex',
        component: () => import('@/views/miniprogram_phone_trans/index'),
        meta: { title: '查询明细', noCache: false, activeMenu: '/miniprogram_phone_trans' }
      }
    ]
  },
  {
    path: '/purchases',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Purchases',
    meta: { title: '物流查询明细' },
    children: [
      {
        path: '/purchases/new_sms_purchase',
        name: 'NewSmsPurchase',
        component: () => import('@/views/purchases/new_sms_purchase'),
        meta: { title: '购买短信额度', noCache: false }
      },
      {
        path: '/purchases/new_logistics_purchase',
        name: 'NewLogisticsPurchase',
        component: () => import('@/views/purchases/new_logistics_purchase'),
        meta: { title: '购买物流查询额度', noCache: false }
      },
      {
        path: '/purchases/miniprogram_phone_purchase',
        name: 'NewMiniprogramPhonePurchase',
        component: () => import('@/views/purchases/miniprogram_phone_purchase'),
        meta: { title: '购买小程序获取手机号额度', noCache: false }
      }
    ]
  },
  {
    path: '/accounts/operation_logs',
    component: Layout,
    redirect: '/operation_logs',
    name: 'OperationLogs',
    meta: { title: '操作日志' },
    children: [
      {
        path: '/accounts/operation_logs',
        name: 'OperationLogIndex',
        component: () => import('@/views/operation_logs/index'),
        meta: {
          title: '操作日志', noCache: false
        }
      }
    ]
  },
  {
    path: '/micro_pages',
    component: Layout,
    redirect: '/micro_pages',
    name: 'MicroPage',
    meta: { title: '微页面' },
    children: [
      {
        path: '/micro_pages',
        name: 'MicroPages',
        component: () => import('@/views/micro_pages/index'),
        meta: { title: '微页面列表', noCache: false, activeMenu: '/micro_pages', buttons: [
          { text: '新建微页面', path: 'MicroPageTemplates', perms: ['micro_page_manage'] }
        ] }
      },
      {
        path: 'new',
        name: 'MicroPageNew',
        component: () => import('@/views/micro_pages/edit'),
        meta: { title: '微页面列表', noCache: false, activeMenu: '/micro_pages' }
      },
      {
        path: 'templates',
        name: 'MicroPageTemplates',
        component: () => import('@/views/micro_pages/templates'),
        meta: { title: '新建微页面', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'MicroPageEdit',
        component: () => import('@/views/micro_pages/edit'),
        meta: { title: '微页面列表', noCache: false, activeMenu: '/micro_pages' }
      },
      {
        path: ':id/dup',
        name: 'MicroPageDup',
        component: () => import('@/views/micro_pages/edit'),
        meta: { title: '复制微页面', noCache: false, activeMenu: '/micro_pages' }
      },
      {
        path: ':id/form',
        name: 'MicroPageForm',
        component: () => import('@/views/micro_pages/forms'),
        meta: { title: '微页面表面', noCache: false, activeMenu: '/micro_pages' }
      }
    ]
  },
  {
    path: '/ranking_lists',
    component: Layout,
    redirect: 'noRedirect',
    name: 'RankingLists',
    meta: { title: '排行榜列表' },
    children: [
      {
        path: '/ranking_lists',
        name: 'RankingListIndex',
        component: () => import('@/views/ranking_lists/index'),
        meta: {
          title: '排行榜列表',
          noCache: true,
          buttons: [
            { text: '新建排行榜', path: 'RankingListNew', perms: ['micro_page_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'RankingListNew',
        component: () => import('@/views/ranking_lists/edit'),
        meta: { title: '新建排行榜', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'RankingListEdit',
        component: () => import('@/views/ranking_lists/edit'),
        meta: { title: '编辑排行榜', noCache: false, activeMenu: '/ranking_lists' }
      },
      {
        path: ':id/dup',
        name: 'RankingListDup',
        component: () => import('@/views/ranking_lists/edit'),
        meta: { title: '新建排行榜', noCache: false, activeMenu: '/ranking_lists' }
      }
    ]
  },
  // {
  //   path: '/sms_batch_notifies',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'SmsBatchNotifies',
  //   meta: { title: '短信群发' },
  //   children: [
  //     {
  //       path: '/sms_batch_notifies',
  //       name: 'SmsBatchNotifieIndex',
  //       component: () => import('@/views/sms_batch_notifies/index'),
  //       meta: { title: '短信群发', noCache: true, buttons: [
  //         { text: '新建发送任务', path: 'SmsBatchNotifieNew', perms: ['store_good_manage'] }
  //       ] }
  //     },
  //     {
  //       path: 'new',
  //       name: 'SmsBatchNotifieNew',
  //       component: () => import('@/views/sms_batch_notifies/edit'),
  //       meta: { title: '新建发送任务', noCache: false }
  //     },
  //     {
  //       path: ':id/edit',
  //       name: 'SmsBatchNotifieEdit',
  //       component: () => import('@/views/sms_batch_notifies/edit'),
  //       meta: { title: '编辑发送任务', noCache: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/sms_templates',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'SmsTemplates',
  //   meta: { title: '短信模板' },
  //   children: [
  //     {
  //       path: '/sms_templates',
  //       name: 'SmsTemplateIndex',
  //       component: () => import('@/views/sms_template/index'),
  //       meta: { title: '短信模板', noCache: true,
  //         buttons: [
  //           { text: '新建模板', path: 'SmsTemplateNew', perms: ['store_good_manage'] }
  //         ] }
  //     },
  //     {
  //       path: 'new',
  //       name: 'SmsTemplateNew',
  //       component: () => import('@/views/sms_template/edit'),
  //       meta: { title: '新建短信模板', noCache: false }
  //     },
  //     {
  //       path: ':id',
  //       name: 'SmsTemplateShow',
  //       component: () => import('@/views/sms_template/show'),
  //       meta: { title: '模板详情', noCache: false }
  //     },
  //     {
  //       path: ':id/edit',
  //       name: 'SmsTemplateEdit',
  //       component: () => import('@/views/sms_template/edit'),
  //       meta: { title: '编辑短信模板', noCache: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/sms_sign',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'SmsSign',
  //   meta: { title: '签名管理' },
  //   children: [
  //     {
  //       path: '/sms_sign',
  //       name: 'SmsSignIndex',
  //       component: () => import('@/views/sms_sign/index'),
  //       meta: { title: '签名管理', noCache: true, buttons: [
  //         { text: '新建签名', path: 'SmsSignNew', perms: ['store_good_manage'] }
  //       ] }
  //     },
  //     {
  //       path: 'new',
  //       name: 'SmsSignNew',
  //       component: () => import('@/views/sms_sign/edit'),
  //       meta: { title: '新建签名', noCache: false }
  //     },
  //     {
  //       path: ':id/edit',
  //       name: 'SmsSignEdit',
  //       component: () => import('@/views/sms_sign/edit'),
  //       meta: { title: '编辑签名', noCache: false }
  //     }
  //   ]
  // },

  {
    path: '/stats/index',
    component: { render: (e) => e('router-view') },
    name: 'Stats',
    meta: { title: '数据分析' },
    children: [
      {
        path: '/stats',
        component: Layout,
        meta: { title: '数据分析' },
        children: [
          {
            path: 'users',
            name: 'StatsUsers',
            component: () => import('@/views/stats/users.vue'),
            meta: { title: '新增用户', noCache: false }
          },
          {
            path: 'user_locations',
            name: 'StatsUserLocation',
            component: () => import('@/views/stats/user_locations.vue'),
            meta: { title: '地域分析', noCache: false }
          },
          {
            path: 'store_orders',
            name: 'StatsStoreOrders',
            component: () => import('@/views/stats/store_orders.vue'),
            meta: { title: '销量趋势', noCache: false }
          },
          {
            path: 'store_good_rankings',
            name: 'StatsStoreGoodRankings',
            component: () => import('@/views/stats/store_good_rankings.vue'),
            meta: { title: '商品排行', noCache: false }
          },
          {
            path: 'orders',
            name: 'StatsOrders',
            component: () => import('@/views/stats/orders.vue'),
            meta: { title: '兑奖分析', noCache: false }
          },
          {
            path: 'user_rankings',
            name: 'StatsUserRankings',
            component: () => import('@/views/stats/user_rankings.vue'),
            meta: { title: '用户排名', noCache: false }
          },
          {
            path: 'locations',
            name: 'StatsLocations',
            component: () => import('@/views/stats/locations.vue'),
            meta: { title: '地域分析', noCache: false }
          },
          {
            path: 'subscribed_users',
            name: 'StatsSubscribedUsers',
            component: () => import('@/views/stats/subscribed_users/index'),
            meta: { title: '公众号吸粉分析' }
          },
          {
            path: '/stats/data_screen_settings',
            name: 'StatsDataScreenSettings',
            component: () => import('@/views/stats/big_screen_data/settings'),
            meta: { title: '数据大屏设置' }
          },
          {
            path: 'dashboard',
            name: 'StatsDashboard',
            component: () => import('@/views/stats/dashboard'),
            meta: { title: '数据概况', noCache: false }
          },
          {
            path: 'fleeing_channels',
            name: 'StatesFleeingChannel',
            component: () => import('@/views/stats/fleeing_channels.vue'),
            meta: { title: '窜货渠道分析' }
          },
          {
            path: 'fleeing_products',
            name: 'StatesFleeingProduct',
            component: () => import('@/views/stats/fleeing_products.vue'),
            meta: { title: '窜货商品分析' }
          },
          {
            path: 'channel_registers',
            name: 'StatsChannelRegister',
            component: () => import('@/views/stats/channel_registers.vue'),
            meta: { title: '注册分析' }
          },
          {
            path: 'channel_locations',
            name: 'StatsChannelLocation',
            component: () => import('@/views/stats/channel_locations.vue'),
            meta: { title: '地域分析' }
          }
        ]
      },
      {
        path: '/stats/big_screen_data',
        name: 'StatsBigScreenData',
        component: () => import('@/views/stats/big_screen_data/index'),
        meta: { title: '数据看板' }
      }
    ]
  },
  {
    path: '/suite_t_unit_exports',
    component: Layout,
    redirect: 'noRedirect',
    name: 'SuiteTunitExport',
    meta: { title: '追溯码生成' },
    children: [
      {
        path: '/suite_t_unit_exports',
        name: 'SuiteTunitExportIndex',
        component: () => import('@/views/suite_t_unit_exports/index'),
        meta: { title: '追溯码生成', noCache: false,
          buttons: [
            { text: '生成追溯码', path: 'LevelTunitExportNew', perms: ['t_unit_manage'] },
            { text: '生成套码', path: 'SuiteTunitExportNew', perms: ['t_unit_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'SuiteTunitExportNew',
        component: () => import('@/views/suite_t_unit_exports/new.vue'),
        meta: { title: '生成套码', noCache: false, activeMenu: '/level_t_unit_exports' }
      }
    ]
  },
  {
    path: '/level_t_unit_exports',
    component: Layout,
    redirect: 'noRedirect',
    name: 'LevelTunitExport',
    meta: { title: '追溯码生成' },
    children: [
      {
        path: '/level_t_unit_exports',
        name: 'LevelTunitExportIndex',
        component: () => import('@/views/level_t_unit_exports/index'),
        meta: { title: '追溯码生成记录', noCache: false,
          buttons: [
            { text: '生成追溯码', path: 'LevelTunitExportNew', perms: ['t_unit_manage'] },
            { text: '生成套码', path: 'SuiteTunitExportNew', perms: ['t_unit_manage'] }
          ]
        }
      },
      {
        path: 'new',
        name: 'LevelTunitExportNew',
        component: () => import('@/views/level_t_unit_exports/new'),
        meta: { title: '生成追溯码', noCache: false, activeMenu: '/level_t_unit_exports' }
      }
    ]
  },
  {
    path: '/tags',
    component: Layout,
    redirect: '/tags',
    meta: { title: '活动标签管理' },
    children: [
      {
        path: '/tags',
        name: 'TagsActivityTag',
        component: () => import('@/views/tags/index'),
        meta: { title: '活动标签管理', noCache: false, buttons: [
          { text: '添加标签', action: 'create_activity_tags', perms: ['tag_manage', 'vip_user_tag'] }
        ] }
      }
    ]
  },
  {
    path: '/activities',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Activity',
    meta: { title: '活动列表' },
    children: [
      {
        path: '/activities',
        name: 'ActivityIndex',
        component: () => import('@/views/activities/index'),
        meta: { title: '活动列表', noCache: true, buttons: [
          { text: '新建活动', path: 'ActivityListNew', perms: ['activity_create'] }
        ] }
      },
      {
        path: 'list_new',
        name: 'ActivityListNew',
        component: () => import('@/views/activities/list_new'),
        meta: {
          title: '新建活动', noCache: false, activeMenu: '/activities'
        }
      },
      {
        path: 'deleted_index',
        name: 'ActivityDeletedIndex',
        component: () => import('@/views/activities/deleted_index'),
        meta: { title: '活动回收站', noCache: true }
      },
      {
        path: 'new',
        name: 'ActivityNew',
        component: () => import('@/views/activities/new'),
        meta: { title: '新建活动', noCache: false, activeMenu: '/activities' }
      },
      {
        path: '/activities/:activityId/award_orders/all',
        name: 'ActivityAwardOrder',
        component: () => import('@/views/activities/award_orders'),
        meta: { title: '兑奖订单', noCache: true, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/users',
        name: 'ActivityUser',
        component: () => import('@/views/activities/users'),
        meta: { title: '活动用户', noCache: true, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/t_units_increments/new',
        name: 'ActivityTunitIncrementNew',
        component: () => import('@/views/activities/t_units_increments/new'),
        meta: { title: '添加二维码', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/units_increments',
        name: 'ActivityUnitsIncrements',
        component: () => import('@/views/activities/units_increments'),
        meta: { title: '二维码添加记录', noCache: true, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/units',
        name: 'ActivityUnits',
        component: () => import('@/views/activities/units'),
        meta: { title: '二维码查询', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/units/slice',
        name: 'ActivityUnitsSlice',
        component: () => import('@/views/activities/slice'),
        meta: { title: '二维码查询', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/units/:id',
        name: 'ActivityUnitShow',
        component: () => import('@/views/units/show'),
        meta: { title: '二维码详情', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/advance_edit',
        name: 'ActivityAdvanceEdit',
        component: () => import('@/views/activities/advance_edit'),
        meta: { title: '高级设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/advanced',
        name: 'ActivityAdvanced',
        component: () => import('@/views/activities/advanced'),
        meta: { title: '高级设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/awards',
        name: 'ActivityAwards',
        component: () => import('@/views/activities/awards'),
        meta: { title: '奖项设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/edit',
        name: 'ActivityEdit',
        component: () => import('@/views/activities/new'),
        meta: { title: '编辑活动', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/activity_forms',
        name: 'ActivityForms',
        component: () => import('@/views/activities/activity_forms'),
        meta: { title: '活动表单', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/wizard_check',
        name: 'ActivityWizardCheck',
        component: () => import('@/views/activities/wizard_check'),
        meta: { title: '确认', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/wizard_confirm',
        name: 'ActivityWizardConfirm',
        component: () => import('@/views/activities/wizard_confirm'),
        meta: { title: '确认活动', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/edit_page',
        name: 'ActivityEditPage',
        component: () => import('@/views/activities/edit_page'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/page_images',
        name: 'ActivityEditPageImages',
        component: () => import('@/views/activities/page_images'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/edit_award_result',
        name: 'ActivityEditAwardResult',
        component: () => import('@/views/activities/edit_award_result'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId/children',
        name: 'ActivityChildren',
        component: () => import('@/views/activities/children'),
        meta: { title: '子活动管理', noCache: false, activeMenu: '/activities', buttons: [
          { text: '新建子活动', action: 'create_children_activity', perms: ['child_activity_manage'] }
        ] },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/activities/:activityId',
        name: 'ActivityShow',
        component: () => import('@/views/activities/show'),
        meta: { title: '活动详情', noCache: false, activeMenu: '/activities' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      }
    ]
  },
  {
    path: '/anti_fakes',
    component: Layout,
    redirect: 'noRedirect',
    name: 'AntiFake',
    meta: { title: '防伪溯源列表' },
    children: [
      {
        path: '/anti_fakes',
        name: 'AntiFakes',
        component: () => import('@/views/anti_fakes/index'),
        meta: { title: '防伪溯源列表', noCache: true, buttons: [
          { text: '新建防伪溯源', path: 'AntiActivityListNew', perms: ['activity_create'] }
        ] }
      },
      {
        path: 'list_new',
        name: 'AntiActivityListNew',
        component: () => import('@/views/activities/list_new'),
        meta: {
          title: '新建防伪溯源', noCache: false, activeMenu: '/anti_fakes'
        }
      },
      {
        path: 'deleted_index',
        name: 'AntiDeletedIndex',
        component: () => import('@/views/anti_fakes/deleted_index'),
        meta: { title: '防伪溯源回收站', noCache: true }
      },
      {
        path: 'new',
        name: 'AntiActivityNew',
        component: () => import('@/views/activities/new'),
        meta: { title: '新建防伪溯源', noCache: false, activeMenu: '/anti_fakes' }
      },
      {
        path: ':activityId/award_orders/all',
        name: 'AntiActivityAwardOrder',
        component: () => import('@/views/activities/award_orders'),
        meta: { title: '兑奖订单', noCache: true, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/users',
        name: 'AntiActivityUser',
        component: () => import('@/views/activities/users'),
        meta: { title: '活动用户', noCache: true, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/t_units_increments/new',
        name: 'AntiActivityTunitIncrementNew',
        component: () => import('@/views/activities/t_units_increments/new'),
        meta: { title: '添加二维码', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/units_increments',
        name: 'AntiActivityUnitsIncrements',
        component: () => import('@/views/activities/units_increments'),
        meta: { title: '二维码添加记录', noCache: true, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/units',
        name: 'AntiActivityUnits',
        component: () => import('@/views/activities/units'),
        meta: { title: '二维码查询', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/units/slice',
        name: 'AntiActivityUnitsSlice',
        component: () => import('@/views/activities/slice'),
        meta: { title: '二维码查询', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/units/:id',
        name: 'AntiActivityUnitShow',
        component: () => import('@/views/units/show'),
        meta: { title: '二维码详情', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/advance_edit',
        name: 'AntiActivityAdvanceEdit',
        component: () => import('@/views/activities/advance_edit'),
        meta: { title: '高级设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/advanced',
        name: 'AntiActivityAdvanced',
        component: () => import('@/views/activities/advanced'),
        meta: { title: '高级设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/awards',
        name: 'AntiActivityAwards',
        component: () => import('@/views/activities/awards'),
        meta: { title: '奖项设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/edit',
        name: 'AntiActivityEdit',
        component: () => import('@/views/activities/new'),
        meta: { title: '编辑活动', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/activity_forms',
        name: 'AntiActivityForms',
        component: () => import('@/views/activities/activity_forms'),
        meta: { title: '活动表单', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/wizard_check',
        name: 'AntiActivityWizardCheck',
        component: () => import('@/views/activities/wizard_check'),
        meta: { title: '确认', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/wizard_confirm',
        name: 'AntiActivityWizardConfirm',
        component: () => import('@/views/activities/wizard_confirm'),
        meta: { title: '确认活动', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/edit_page',
        name: 'AntiActivityEditPage',
        component: () => import('@/views/activities/edit_page'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/page_images',
        name: 'AntiActivityEditPageImages',
        component: () => import('@/views/activities/page_images'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/edit_award_result',
        name: 'AntiActivityEditAwardResult',
        component: () => import('@/views/activities/edit_award_result'),
        meta: { title: '页面设置', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: ':activityId/children',
        name: 'AntiActivityChildren',
        component: () => import('@/views/activities/children'),
        meta: { title: '子活动管理', noCache: false, activeMenu: '/anti_fakes', buttons: [
          { text: '新建子活动', action: 'create_children_activity', perms: ['child_activity_manage'] }
        ] },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      },
      {
        path: '/anti_fakes/:activityId',
        name: 'AntiActivityShow',
        component: () => import('@/views/activities/show'),
        meta: { title: '活动详情', noCache: false, activeMenu: '/anti_fakes' },
        beforeEnter(to, from, next) {
          activityBeforeEnter(to, from, next)
        }
      }
    ]
  },
  {
    path: '/units',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Units',
    meta: { title: '二维码查询' },
    children: [
      {
        path: '/units',
        name: 'UnitIndex',
        component: () => import('@/views/units/index'),
        meta: { title: '二维码查询', noCache: true }
      },
      {
        path: '/units/slice',
        name: 'UnitSliceIndex',
        component: () => import('@/views/units/slice'),
        meta: { title: '二维码查询', noCache: true }
      },
      {
        path: ':id',
        name: 'UnitShow',
        component: () => import('@/views/units/show'),
        meta: { title: '二维码查询', noCache: false }
      }
    ]
  },
  {
    path: '/anti_fake_units',
    component: Layout,
    redirect: 'noRedirect',
    name: 'AntiFakeUnits',
    meta: { title: '二维码查询' },
    children: [
      {
        path: '/anti_fake_units',
        name: 'AntiFakeUnitIndex',
        component: () => import('@/views/units/index'),
        meta: { title: '二维码查询', noCache: true }
      },
      {
        path: '/anti_fake_units/units/slice',
        name: 'AntiFakeUnitSliceIndex',
        component: () => import('@/views/units/slice'),
        meta: { title: '二维码查询', noCache: true }
      },
      {
        path: ':id',
        name: 'AntiFakeUnitShow',
        component: () => import('@/views/units/show'),
        meta: { title: '二维码查询', noCache: false }
      }
    ]
  },
  {
    path: '/units_exports',
    component: Layout,
    redirect: 'noRedirect',
    name: 'UnitsExports',
    meta: { title: '二维码生成' },
    children: [
      {
        path: '/units_exports',
        name: 'UnitsExportIndex',
        component: () => import('@/views/units_exports/index'),
        meta: { title: '二维码生成记录', noCache: false }
      },
      {
        path: 'new',
        name: 'UnitsExportNew',
        component: () => import('@/views/units_exports/new'),
        meta: { title: '二维码生成', noCache: false, activeMenu: '/units_exports/new' }
      },
      {
        path: 'export',
        name: 'UnitsExportExport',
        component: () => import('@/views/units_exports/export'),
        meta: { title: '二维码导出', noCache: false, activeMenu: '/units_exports/export' }
      }
    ]
  },
  {
    path: '/anti_units_exports',
    component: Layout,
    redirect: 'noRedirect',
    name: 'AntiUnitsExports',
    meta: { title: '二维码生成' },
    children: [
      {
        path: '/anti_units_exports',
        name: 'AntiUnitsExportIndex',
        component: () => import('@/views/units_exports/index'),
        meta: { title: '二维码生成记录', noCache: false }
      },
      {
        path: 'new',
        name: 'AntiUnitsExportNew',
        component: () => import('@/views/units_exports/new'),
        meta: { title: '二维码生成', noCache: false, activeMenu: '/anti_units_exports/new' }
      },
      {
        path: 'export',
        name: 'AntiUnitsExportExport',
        component: () => import('@/views/units_exports/export'),
        meta: { title: '二维码导出', noCache: false, activeMenu: '/anti_units_exports/export' }
      }
    ]
  },
  {
    path: '/t_unit_relation_import',
    component: Layout,
    redirect: 'noRedirect',
    name: 'TUnitRelationImport',
    meta: { title: '更新关联活动码' },
    children: [
      {
        path: '/t_unit_relation_import',
        name: 'TUnitRelationImportIndex',
        component: () => import('@/views/t_unit_relation_import/index'),
        meta: {
          title: '更新关联活动码',
          noCache: false,
          buttons: [
            { text: '批量更新', action: 'upload_t_unit_relation', perms: ['t_unit_relation_unit'] }
          ]
        }
      }
    ]
  },
  {
    path: '/vip_wechat_mini_program',
    component: Layout,
    redirect: 'noRedirect',
    name: 'VipWechatMiniProgram',
    meta: { title: '会员小程序' },
    children: [
      {
        path: 'info',
        name: 'VipWechatMiniProgramInfo',
        component: () => import('@/views/vip_wechat_mini_program/info'),
        meta: {
          title: '会员小程序',
          noCatch: false
        }
      },
      {
        path: 'authorize',
        name: 'VipWechatMiniProgramAuthorize',
        component: () => import('@/views/vip_wechat_mini_program/authorize'),
        meta: {
          title: '绑定会员小程序',
          noCatch: false
        }
      },
      {
        path: 'callback',
        name: 'VipWechatMiniProgramCallback',
        component: () => import('@/views/vip_wechat_mini_program/authorize'),
        meta: {
          title: '绑定会员小程序',
          noCatch: false
        }
      },
      {
        path: '/vip_wechat_mini_program',
        name: 'VipWechatMiniProgramShow',
        component: () => import('@/views/vip_wechat_mini_program/show'),
        meta: {
          title: '会员小程序',
          noCatch: false
        }
      }
    ]
  },
  {
    path: '/merchant_wechat_mini_program',
    component: Layout,
    name: 'MerchantWechatMiniProgram',
    redirect: '/merchant_wechat_mini_program/info',
    meta: { title: '商户小程序' },
    children: [
      {
        path: 'info',
        name: 'MerchantWechatMiniProgramInfo',
        component: () => import('@/views/merchant_wechat_mini_program/info'),
        meta: {
          title: '商户小程序',
          noCatch: false
        }
      }
    ]
  },
  {
    path: '/notifications',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Notifications',
    meta: { title: '通知管理' },
    children: [
      {
        path: '/notifications',
        name: 'NotificationIndex',
        component: () => import('@/views/notifications/index'),
        meta: { title: '通知管理', noCache: false }
      },
      {
        path: ':id',
        name: 'NotificationShow',
        component: () => import('@/views/notifications/show'),
        meta: { title: '通知详情', noCache: false }
      }
    ]
  },
  {
    path: '/public_notices',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PublicNotices',
    meta: { title: '通知管理' },
    children: [
      {
        path: '/public_notices',
        name: 'PublicNotice',
        component: () => import('@/views/public_notices/index'),
        meta: { title: '通知管理', noCache: false }
      },
      {
        path: ':id',
        name: 'PublicNoticeShow',
        component: () => import('@/views/public_notices/show'),
        meta: { title: '通知管理', noCache: false }
      }
    ]
  },
  {
    path: '/docs',
    component: { render: (e) => e('router-view') },
    children: [
      {
        path: 'api',
        name: 'DocApi',
        component: () => import('@/views/docs/api.vue'),
        meta: {
          title: 'API',
          noCatch: false
        }
      }
    ]
  },
  {
    path: '/fleeings',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '窜货管理' },
    children: [
      {
        path: '/fleeings',
        name: 'FleeingIndex',
        component: () => import('@/views/fleeings/index'),
        meta: { title: '窜货管理', noCache: true }
      },
      {
        path: 'stats',
        name: 'FleeingStats',
        component: () => import('@/views/fleeings/stats'),
        meta: { title: '窜货统计', noCache: false }
      },
      {
        path: ':id',
        name: 'FleeingShow',
        component: () => import('@/views/fleeings/show')
      }
    ]
  },
  {
    path: '/fleeing_notify',
    component: Layout,
    redirect: '/fleeing_notify/edit',
    meta: { title: '通知设置' },
    children: [
      {
        path: 'edit',
        name: 'FleeingNotifyEdit',
        component: () => import('@/views/fleeing_notify/edit'),
        meta: { title: '通知设置', noCache: false }
      }
    ]
  },
  {
    path: '/current_version',
    component: Layout,
    redirect: '/current_version',
    meta: { title: '版本信息' },
    children: [
      {
        path: '/current_version',
        name: 'CurrentVersion',
        component: () => import('@/views/current_version/show'),
        meta: { title: '版本信息', noCache: false }
      }
    ]
  },
  {
    path: '/sign_up',
    component: Devices,
    redirect: '/sign_up.html',
    meta: { title: '注册' },
    children: [
      {
        path: '/sign_up.html',
        name: 'SignUp',
        component: () => import('@/views/sign_up/index'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      }
    ]
  },
  {
    path: '/sign_in',
    component: Devices,
    redirect: '/sign_in.html',
    meta: { title: '登录' },
    children: [
      {
        path: '/sign_in.html',
        name: 'SignIn',
        component: () => import('@/views/sign_in/index'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      }
    ]
  },
  {
    path: '/password/edit',
    component: Devices,
    redirect: '/password/edit',
    meta: { title: '忘记密码' },
    children: [
      {
        path: '/password/edit',
        name: 'ForgetPassword',
        component: () => import('@/views/password/edit'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      }
    ]
  },
  {
    path: '/wizard',
    component: { render: (e) => e('router-view') },
    meta: { title: '注册' },
    children: [
      {
        path: 'authorize',
        name: 'WizardAuthorize',
        component: () => import('@/views/wizard/authorize'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      },
      {
        path: 'edit_store',
        name: 'WizardEditStore',
        component: () => import('@/views/wizard/edit_store'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      },
      {
        path: '/wizard',
        name: 'WizardShow',
        component: () => import('@/views/wizard/show'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      },
      {
        path: 'callback',
        name: 'WizardCallback',
        component: () => import('@/views/wizard/callback'),
        meta: { title: '一物一码营销与数据服务平台', noCache: false }
      }
    ]
  },
  {
    path: '/gifts',
    component: Layout,
    redirect: '/gifts',
    meta: { title: '礼品管理' },
    children: [
      {
        path: '/gifts',
        name: 'GiftIndex',
        component: () => import('@/views/gifts/index'),
        meta: { title: '礼品管理', noCache: false }
      }
    ]
  },
  {
    path: '/vip_promotion',
    component: Layout,
    redirect: '/vip_promotion',
    meta: { title: '拉新推广' },
    children: [
      {
        path: '/vip_promotion',
        name: 'VipPromotion',
        component: () => import('@/views/vip_promotion/index'),
        meta: { title: '拉新推广', noCache: false, buttons: [
          { text: '新建推广', path: 'VipPromotionNew', perms: ['vip_promotion_manage'] }
        ] }
      },
      {
        path: 'new',
        name: 'VipPromotionNew',
        component: () => import('@/views/vip_promotion/edit'),
        meta: { title: '新建推广', noCache: false }
      },
      {
        path: 'stats',
        name: 'VipPromotionStats',
        component: () => import('@/views/vip_promotion/stats'),
        meta: { title: '推广数据分析', noCache: false }
      }
    ]
  },
  {
    path: '/checkin_activity',
    component: Layout,
    redirect: '/checkin_activity/edit',
    meta: { title: '签到活动' },
    children: [
      {
        path: 'edit',
        name: 'CheckinActivityEdit',
        component: () => import('@/views/checkin_activity/edit'),
        meta: { title: '签到活动' }
      }
    ]
  },
  {
    path: '/channel_push_messages',
    name: 'ChannelNotice',
    component: Layout,
    redirect: '/channel_push_messages',
    meta: { title: '渠道公告' },
    children: [
      {
        path: '/channel_push_messages',
        name: 'ChannelNoticeIndex',
        component: () => import('@/views/channel_notices/index'),
        meta: { title: '渠道公告', noCache: false, buttons: [
          { text: '新建公告', path: 'ChannelNoticeNew', perms: ['channel_push_message'] }
        ] }
      },
      {
        path: 'new',
        name: 'ChannelNoticeNew',
        component: () => import('@/views/channel_notices/edit.vue'),
        meta: { title: '渠道公告', noCache: false }
      },
      {
        path: ':id/edit',
        name: 'ChannelNoticeEdit',
        component: () => import('@/views/channel_notices/edit.vue'),
        meta: { title: '渠道公告', noCache: false }
      }
    ]
  },
  {
    path: '/award_tools',
    name: 'Tools',
    component: Layout,
    redirect: '/award_tools',
    meta: { title: '工具' },
    children: [
      {
        path: '/award_tools',
        name: 'ToolShow',
        component: () => import('@/views/tools/show.vue'),
        meta: { title: '' }
      }
    ]
  },
  {
    path: '/goods_category',
    name: 'GoodsCategory',
    component: Layout,
    redirect: '/goods_categories',
    meta: { title: '商品分类' },
    children: [
      {
        path: '/goods_categories',
        name: 'GoodsCategoryIndex',
        component: () => import('@/views/goods_category/index'),
        meta: { title: '商品分类', noCache: false, buttons: [
          { text: '新建分类', action: 'create_goods_group', perms: ['store_good_manage'] }
        ] }
      }
    ]
  },
  {
    path: '/cultivate_activity',
    name: 'CultivateActivity',
    component: Layout,
    redirect: '/cultivate_activity/forest',
    meta: { title: '商品分类' },
    children: [
      {
        path: 'forest',
        name: 'CultivateActivityForest',
        component: () => import('@/views/cultivate_activity/forest'),
        meta: { title: '开心种树', noCache: false }
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
