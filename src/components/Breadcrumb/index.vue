<template>
  <div class="row page-header">
    <div class="col-sm-12">
      <h1>
        <div>
          <i class="fa fa-angle-right" />
          <div v-for="(item, index) in breadcrumb" :key="index" style="display: inline-block;margin-left: 8px">
            <template v-if="!account.store.javaAdminEnabled">
              <small v-if="index != breadcrumb.length-1" class="no-redirect">
                <a v-if="item.type === 'external'" :href="item.path">{{ item.title }}</a>
                <router-link v-else-if="!item.type && item.path" :to="item.path">{{ item.title }}</router-link>
                <small v-else style="font-size: 20px"> {{ item.title }} </small>
                /
              </small>
              <template v-else> {{ item.title }}</template>
            </template>
            <template v-else>
              <small v-if="index != breadcrumb.length-1" class="no-redirect">
                <a v-if="item.type === 'external'" :href="`/lmp/portal${item.path}`">{{ item.title }}</a>
                <router-link v-else-if="!item.type && item.path" :to="item.path">{{ item.title }}</router-link>
                <small v-else style="font-size: 20px"> {{ item.title }} </small>
                /
              </small>
              <template v-else> {{ item.title }}</template>
            </template>
          </div>
          <span v-for="item in buttons" :key="item.path" class="page_actions">
            <a v-if="item.type === 'link' && checkPer(item.perms)" :href="item.path" class="el-button el-button--success el-button--small" style="color: #FFF">
              <i v-if="!item.hiddenIcon" class="fa fa-plus" /> {{ item.text }}
            </a>
            <el-button v-if="item.type !== 'link' && checkPer(item.perms)" size="small" type="success" @click="handleLink(item)">
              <i v-if="!item.hiddenIcon" class="fa fa-plus" /> {{ item.text }}
            </el-button>
          </span>
          <span v-if="$route.name === 'Dashboards'" class="page_actions">
            <el-button @click="redirectTo('/admin/guide')">
              <span style="color: #333"><i class="fa fa-graduation-cap" /> 新手入门 </span>
            </el-button>
            <el-button @click="redirectTo('/lgp/portal/help')">
              <span style="color: #333"><i class="fa fa-video-camera" /> 视频教学 </span>
            </el-button>
          </span>
        </div>
        <span v-if="help_link" class="page_help">
          <a target="blank" :href="help_link.url">
            {{ help_link.title }}<img style="vertical-align: unset;margin-left: 3px;" :src="require('@/assets/help_link.png')" alt="Help link" width="10" height="10">
          </a>
        </span>
      </h1>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      buttons: [],
      ids: [1]
    }
  },
  computed: {
    ...mapGetters([
      'breadcrumb',
      'account'
    ]),
    help_link() {
      return {
        'TChannelOutReceiptIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/204', title: '出库功能帮助说明' },
        'TChannelInReceiptIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/36', title: '入库功能帮助说明' },
        'TChannelProductsIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/35', title: '库存查询功能帮助说明' },
        'TUnitBatchesNew': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/35', title: '新建生产批次流程' },
        'ChannelInvitation': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/220', title: '如何注册渠道' },
        'WorkerInvitation': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/220', title: '员工邀请' },
        'StoreGoodVerifiedCoupon': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/192', title: '如何核销顾客卡券' },
        'VipSettingEdit': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/179', title: '如何注册会员' },
        'UserTags': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/215', title: '用户标签使用说明' },
        'UserBlacked': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/216', title: '黑名单使用说明' },
        'UserWhitelistPhones': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/214', title: '白名单使用说明' },
        'WechatMenuIndex': { url: 'https://admin.lifanli.cn/lgp/portal/help/articles/5', title: '微信公众号菜单设置功能' },
        'WxReplyIndex': { url: 'https://admin.lifanli.cn/lgp/portal/help/articles/16', title: '微信公众号吸粉（自动回复设置）' },
        'CashTrans': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/13', title: '资金余额(红包款)充值及提现' },
        'Invoice': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/39', title: '发票申领流程说明' },
        'GoodsIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/26', title: '如何添加礼品库存' },
        'SuiteCardIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/213', title: '集卡活动使用说明' },
        'LevelTunitExportIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/33', title: '码生成功能帮助说明' },
        'UnitIndex': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/1', title: '如何手动激活二维码' },
        'ActivityAwards': { url: 'http://admin.lifanli.cn/lgp/portal/help/articles/4', title: '活动奖项规则说明' },
        'ActivityListNew': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/6', title: '扫码送红包活动创建流程' },
        'ActivityShow': { url: 'http://admin.lifanli.cn/lgp/portal/help/videos/12', title: '原有活动增加二维码数量' }
      }[this.$route.name]
    }
  },
  watch: {
    $route() {
      this.get_current_page_buttons()
    }
  },
  created() {
    this.get_current_page_buttons()
  },
  methods: {
    get_current_page_buttons() {
      this.buttons = this.$route.meta.buttons || []
    },

    handleLink(item) {
      const { path } = item
      if (item.action) {
        item.show = true
        this.$store.dispatch('breadcrumb/set_active__button', item)
      } else {
        if (item.needParams) {
          this.$router.push({ name: path, query: { ...this.$route.params }})
        } else {
          this.$router.push({ name: path })
        }
      }
    },
    redirectTo(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
$brand-primary: #F34541;
$gray-lighter: #EEE;

.page-header {
  background-color: #fff;
  padding-bottom: 9px;
  margin: 0px 0px 10px -25px;
  border-bottom: 1px solid #ddd;
  h1 {
    font-size: 30px;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
    margin: 0;
    padding-left: 15px;
    padding-top: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
      small {
        font-size: 65%;
        font-weight: normal;
        line-height: 1;
        color: #777777;
      }
      a {
        color: #da120e;
        text-decoration: none;
        vertical-align: baseline;
      }
      >.fa {
        color: $brand-primary
      }
    }
  }
  .page_actions {
    padding-left: 10px;
    margin-left: 5px;
    border-left-color: $gray-lighter;
    border-left-style: solid;
    border-left-width: 1px;
    display: inline-flex;
    .btn {
      vertical-align: top;
    }
  }
}
</style>
