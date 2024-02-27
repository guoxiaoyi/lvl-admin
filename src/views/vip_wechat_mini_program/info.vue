<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员小程序 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex flex-wrap miniprogram-preview">
          <div class="text-center miniprogram-qr">
            <template v-if="account.store.customVipWxMiniprogramEnabled">
              <!-- 若有专属版小程序 -->
              <img :src="previewCode.content" style="width: 208px;">
              <br>
              {{ miniProgram.nickName || '利多码会员中心' }}
              <br>
              <div class="label self"> 专属版 </div>
            </template>
            <template v-else-if="account.store.commonVipWxMiniprogramEnabled">
              <!-- 若开启通用版会员小程序 -->
              <img :src="previewCode.content" style="width: 208px;">
              <br>
              利多码会员中心
              <br>
              <div class="label">通用版</div>
            </template>
            <template v-else>
              <!-- 专属版和通用版小程序都未开启，显示个人中心二维码 -->
              <VueQr v-if="previewCode.content" :text="previewCode.content" :size="416" style="width: 208px" />
              <br>
              利多码会员中心
            </template>
          </div>

          <div class="flex-item miniprogram-info">
            <div class="col-10">
              <h3 class="parent-title">
                会员小程序
                <br>
                快速搭建会员成长体系，保障会员活跃度
                <br>
                <small v-if="account.store.customVipWxMiniprogramEnabled">您已开通专属版会员小程序，如需使用小程序内支付功能，请查看<a href="http://admin.lifanli.cn/lgp/portal/help/articles/249?cid=3" target="_blank">小程序支付开通指南</a></small>
              </h3>
            </div>
            <div class="flex functions-enabled funcs direction-column">
              <template v-if="account.store.customVipWxMiniprogramEnabled">
                <!--
                  开启了专属小程序功能
                  专属版
                -->
                <div class="col-12">
                  <div class="flex">
                    <div class="flex items-center justify-content__space-between flex-item">
                      <div>
                        专属版
                        <p>
                          功能全部使用小程序方式实现，可以设置专属小程序名称，支持微信内搜索。并且可以创建小程序活动。
                        </p>
                      </div>

                      <el-button v-if="miniProgram" type="success" @click="$router.push({ name: 'VipWechatMiniProgramAuthorize' })">查看</el-button>
                      <el-button v-else type="success">启用</el-button>
                    </div>

                    <div class="warning">
                      <b><span style="color:#333;">小程序获取手机号：</span></b>
                      <br>
                      小程序获取手机号额度不足，将影响用户进行登录、变更等相关操作。
                      <br>
                      本功能为腾讯付费功能，请到微信小程序后台<a href="https://mp.weixin.qq.com" target="blank">购买手机号快速验证组件工具包</a>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-12">
                  <div class="flex">
                    <div class="flex items-center justify-content__space-between flex-item">
                      <div>
                        通用版
                        <p>
                          个人中心、积分商城、会员中心等功能使用小程序方式实现。
                        </p>
                      </div>
                      <!-- 启用会员小程序通用版 -->
                      <template v-if="account.store.commonVipWxMiniprogramEnabled">
                        <!-- 已绑定公众号 -->
                        <el-button v-if="account.wechatProfile" type="danger" @click="vueConfirm('停用后，个人中心、积分商城、会员中心等功能全部使用h5方式实现。')">停用</el-button>
                        <el-button v-else @click="vueAlert('停用通用版小程序，需绑定公众号。停用后，个人中心、积分商城、会员中心等功能全部使用h5方式实现。')">停用</el-button>
                      </template>
                      <template v-else>
                        <el-button type="success" @click="vueConfirm('启用后，个人中心、积分商城、会员中心等功能使用小程序方式实现。')">开启</el-button>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="flex">
                    <div class="flex items-center justify-content__space-between flex-item">
                      <div>
                        专属版
                        <p>
                          开通您公司主体下的专属小程序，可自定义小程序图标及名称，体现小程序专有性，进一步提升品牌形象。
                        </p>
                      </div>
                      <el-button type="success" @click="vueAlert('如需开通会员小程序专属版，请联系您的专属客服！')">开启</el-button>
                    </div>
                  </div>
                </div>
              </template>

            </div>

            <h4 class="sub-title">功能简介:</h4>
            <ul class="flex flex-wrap funcs">
              <li v-for="(item, index) in funs" :key="index" class="col-6">
                <dl class="flex">
                  <dt>
                    <img :src="require('@/assets/vip_wechat_mini_programs/'+ (index + 1) +'.png')">
                  </dt>
                  <dd class="flex-item">
                    <h5>{{ item[0] }}</h5>
                    <p>{{ item[1] }}</p>
                  </dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import vip_wechat_mini_program from '@/api/vip_wechat_mini_program.js'
import user from '@/api/user.js'
import store_settings from '@/api/store_setting.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      miniProgram: {},
      funs: [
        ['个人中心', '承载着账号信息、资产状况、活动及兑奖信息等功能的聚合地，主要用于个人信息的管理。'],
        ['积分商城', '可以消耗用户积分，用以兑换商城中的商品。提升客户的活跃度和消费欲望，增加用户黏度。'],
        ['会员等级', '将用户分级，做精细化运营进而达到激发活跃、提升留存、刺激转化，最大的发挥用户价值。'],
        ['会员任务', '通过基础任务，激励用户做任务升级会员。激励用户做任务，快速成为忠诚会员，提升会员活跃和复购。'],
        ['会员权益', '会员权益可以享受到会员专享的服务和功能，让用户获得更好的使用体验。'],
        ['小程序活动(专属小程序可用)', '开通专属小程序后，可创建小程序活动，扫码直接打开小程序参与活动。打造轻便又随时可用的用户体验。']
      ],
      previewCode: ''
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员小程序' }
    ])
    vip_wechat_mini_program.info().then(({ data }) => {
      this.miniProgram = data
    })
    user.getPreviewInfo().then(({ data }) => {
      this.previewCode = data
    })
  },
  methods: {
    vueConfirm(str) {
      if (confirm(str)) {
        this.toggle_common_vip_mini_program()
      }
    },
    vueAlert(str) {
      alert(str)
    },
    toggle_common_vip_mini_program() {
      store_settings.toggle_common_vip_mini_program().then(({ data }) => {
        window.location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.miniprogram-preview{
  .miniprogram-qr{
    width: 300px;
    img{
      padding: 20px;
    }
    .label{
      width: 80px;
      height: 28px;
      padding: 2px 2px 2px 2px;
      border-radius: 5px;
      border: 1px solid rgba(121, 121, 121, 0);
      background-color: rgba(243, 69, 65, 0.1);
      color: #f34541;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      &.self {
        border: 1px solid rgba(121, 121, 121, 0);
        background-color: rgba(255, 161, 0, 0.1);
        color: #ffa100;
      }
    }
  }
  .miniprogram-info{
    .parent-title{
      line-height: 40px;
      margin-bottom: 30px;
    }
    .sub-title{
      color: rgba(51, 51, 51, 1);
    }
  }
  .funcs {
    margin-left: -10px;
    margin-right: -10px;
    [class^='col-']{
      padding: 10px;
      dl{
        height: 100%;
        background: #F8F8F8;
        padding: 20px 25px;
        img{
          width: 40px;
          margin-right: 20px;
        }
        h5{
          font-size: 16px;
          margin-top: 0;
        }
        p{
          margin-bottom: 0;
          font-size: 14px;
          color: rgba(136, 136, 136, 1);
        }
      }
    }
  }
  p{
    margin-bottom: 0;
  }
  .functions-enabled {
    .col-6, .col-12 {
      & > div.flex{
        border: 1px solid #bbb;
        border-radius: 4px;
        flex-direction: column;
        padding: 20px;
        // align-items: flex-start;
        font-size: 18px;
        // justify-content: space-between;
        p {
          font-size: 14px;
          // min-height: 60px;
          margin: 10px 0;
        }
      }
      .warning{
        font-size: 14px;
        background-color: #fcf8e3;
        border-color: #faebcc;
        color: #8a6d3b;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 15px;
      }
    }
  }
}

</style>
