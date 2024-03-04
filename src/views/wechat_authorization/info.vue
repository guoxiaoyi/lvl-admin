<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          微信公众号概览
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex flex-wrap">
          <div class="text-center wechat-logo">
            <img :src="require('@/assets/wx_logo.png')" width="208">
            <div class="wechat-status">
              <div v-if="detail.authorized">
                <el-button @click="$router.push({ name: 'WechatAuthorizationAuthorize' })">重新绑定公众号</el-button>
                <dl style="margin-top: 30px;">
                  <dt>公众号名称:</dt>
                  <dd>{{ detail.nickName }}</dd>
                </dl>
                <dl>
                  <dt>公众号类型:</dt>
                  <dd>{{ detail.serviceTypeText }}</dd>
                </dl>
                <dl>
                  <dt>公众号ID:</dt>
                  <dd>{{ detail.appid }}</dd>
                </dl>
                <dl>
                  <el-button type="text" @click="modal.show = true">查看全部信息</el-button>
                </dl>
              </div>
              <div v-else>
                <el-button @click="$router.push({ name: 'WechatAuthorizationAuthorize' })">立即绑定公众号</el-button>
              </div>
            </div>
          </div>
          <div class="flex-item wechat-info-area">
            <div class="title">
              <h3>微信公众号-建立微信生态私域流量</h3>
              <p>借助多种平台活动吸粉获客，构建微信生态私域流量。提升企业形象及用户服务体验。</p>
            </div>

            <ul class="flex flex-wrap wechat-func">
              <li v-for="(item, index) in functions" :key="index" class="col-6">
                <dl class="flex">
                  <dd class="flex-item">
                    <h5>{{ item[0] }}</h5>
                    <p>{{ item[1] }} </p>
                  </dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      title="微信公众号详情"
      width="780px"
    >
      <div class="modal-body">
        <div class="left-block">
          <p>基本信息</p>
          <div class="info-block">
            <div class="info-group">
              <div class="info-title"> 公众号二维码 </div>
              <div class="info-body">
                <img class="img-thumbnail avatar-thumbnail-middle" :src="detail.qrcodeUrl" alt="0?1676354626">
              </div>
            </div>
            <div class="info-group">
              <div class="info-title"> 公众号名称 </div>
              <div class="info-body">
                {{ detail.nickName }}
              </div>
            </div>
            <div class="info-group">
              <div class="info-title"> 认证主体 </div>
              <div class="info-body">
                {{ detail.principalName }}
              </div>
            </div>
            <div class="info-group">
              <div class="info-title">
                公众号ID
              </div>
              <div class="info-body">
                {{ detail.appid }}
              </div>
            </div>
            <div class="info-group">
              <div class="info-title">
                公众号类型
              </div>
              <div class="info-body">
                {{ detail.serviceTypeText }}
              </div>
            </div>
            <div class="info-group">
              <div class="info-title">
                认证类型
              </div>
              <div class="info-body">
                {{ detail.verifyTypeText }}
              </div>
            </div>
            <div class="info-group">
              <div class="info-title">
                原始ID
              </div>
              <div class="info-body">
                {{ detail.userName }}
              </div>
            </div>
          </div>
        </div>
        <div class="right-block">
          <p>授权列表</p>
          <div class="info-block">
            <p v-for="(item, index) in detail.funcInfoList" :key="index">
              {{ item.funcName }}
              <i class="fa" :class="[ item.enabled ? 'fa-check text-success' : 'fa-times text-danger']" />
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import wechat_authorization from '@/api/wechat_authorization'

export default {
  data() {
    return {
      modal: {
        show: false
      },
      detail: {},
      functions: [
        ['自动回复', '支持扫码自动回复、关键词自动回复及关注公众号自动回复。可设置自动回复红包等活动，提高公众号粉丝数量及粉丝活跃度。'],
        ['公众号菜单', '自定义设置公众号菜单项，让企业简单快捷调整公众号菜单并提供更多一物一码及用户运营能力。'],
        ['微信支付', '积分商城用户微信支付的资金，将直接进入商家微信支付账户。'],
        ['消息推送', '通过公众号模板消息，自动向用户发送微信消息通知。']
      ]
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '微信公众号概览' }
    ])
    wechat_authorization.show().then(({ data }) => {
      this.detail = data
    })
  }
}
</script>

<style lang="scss" scoped>
.wechat-logo {
  width: 300px;
  img {
    padding: 30px;
  }
}
.wechat-func {
  margin-left: -10px;
  margin-right: -10px;
  dl {
    background: #F8F8F8;
    padding: 20px 25px;
  }
  .col-6 {
    padding: 10px;
    h5 {
      margin-bottom: 0;
      font-size: 16px;
    }
    p {
      margin-bottom: 0;
      font-size: 14px;
      color: #888888;
    }
  }
}
.wechat-status {
  text-align: center;
  dl {
    padding-left: 40px;
    margin-bottom: 25px;
    text-align: left;
  }
  dt {
    color: #999898;
    font-weight: normal;
  }
  dd {
    color: #252525;
    margin-top: 7px;
  }
}
.modal-body {
  display: flex;
  color: #333;
  .left-block {
    width: 70%;
    padding-left: 20px;
    .info-block {
      padding-left: 30px;
    }
    .avatar-thumbnail-middle {
      width: 120px;
      height: 120px;
    }
    .info-group {
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      .info-title {
        width: 100px;
      }
    }
  }
  .right-block {
    flex: 1;
    .info-block {
      padding-left: 30px;
    }
  }
}

</style>
