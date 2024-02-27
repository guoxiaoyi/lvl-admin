<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 商户小程序 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex flex-wrap miniprogram-preview">
          <div class="text-center miniprogram-qr">
            <template v-if="account.store.customMerchantWxMiniprogramEnabled && detail">
              <!-- 若有专属版小程序 -->
              <img :src="qr" width="208">
              <br>
              利多码商户助手小程序
              <br>
              <div class="label self">专属版</div>
            </template>
            <template v-else>
              <!-- 若开启通用版会员小程序 -->
              <img :src="qr" width="208">
              <br>
              利多码商户助手小程序
              <br>
              <div class="label">通用版</div>
            </template>
          </div>

          <div class="flex-item miniprogram-info">
            <div class="col-10">
              <h3 class="parent-title">
                利多码商户助手<br>
                让经销商/门店用小程序帮你营销
              </h3>
            </div>

            <div class="flex functions-enabled funcs direction-column">
              <template v-if="account.store.customMerchantWxMiniprogramEnabled">
                <div class="col-12">
                  <div class="flex">
                    <div class="flex items-center justify-content__space-between flex-item">
                      <div>
                        专属版
                        <p> 开通您公司主体下的专属小程序，可自定义小程序图标及名称，体现小程序专有性，进一步提升品牌形象。 </p>
                      </div>
                      <!-- 开启了专属小程序功能 -->
                      <el-button v-if="detail">查看</el-button>
                      <el-button v-else>启用</el-button>
                    </div>
                    <div class="warning">
                      <b><span style="color:#333;">小程序获取手机号：</span></b>
                      <br>
                      小程序获取手机号额度不足，将影响渠道注册、登录、变更等相关操作。
                      <br>
                      本功能为腾讯付费功能，请到微信小程序后台<a href="https://mp.weixin.qq.com" target="blank">购买手机号快速验证组件工具包</a>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <!-- 未开启专属小程序功能 -->
                <!-- 通用版 -->
                <div class="col-12">
                  <div class="flex">
                    <div class="flex items-center justify-content__space-between flex-item">
                      <div>
                        通用版
                        <p>
                          商户可在小程序邀请注册、卡券核销、导购返利、出入库管理等操作。
                        </p>
                      </div>
                    </div>

                    <div class="warning">
                      <b><span style="color:#333;">小程序获取手机号额度：</span></b><span style="color:#da120e">{{ account.store.miniprogramPhoneBalance }}次</span>
                      <br>
                      小程序获取手机号额度不足，将影响渠道注册、登录、变更等相关操作。<router-link :to="{ name: 'NewMiniprogramPhonePurchase'}">立即充额度</router-link>
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
                      <a href="javascript:alert('如需开通商户助手小程序专属版，请联系您的专属客服！');" class="el-button el-button--success">启用</a>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <h4 class="sub-title">功能简介:</h4>
            <ul class="flex flex-wrap funcs">
              <li v-for="(f, index) in funcs" :key="index" class="col-4">
                <dl class="flex">
                  <dt><img :src="require(`@/assets/merchant_wechat_mini_programs/${index + 1}.png`)"></dt>
                  <dd class="flex-item">
                    <h5>{{ f[0] }}</h5>
                    <p>{{ f[1] }}</p>
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
import { mapGetters } from 'vuex'
import wechat_mini_program from '@/api/wechat_mini_program.js'
export default {
  data() {
    return {
      detail: {},
      funcs: [
        ['渠道信息收集', '精准收集经销商，业务员，门店的注册信息'],
        ['导购返利', '自动发放导购返利，促进导购员/服务员卖力推销'],
        ['卡券核销', '实现线上优惠券发放，线下门店核销'],
        ['渠道返利', '引导经销商扫码出入库，实现产品追溯与渠道库存监控'],
        ['店主返利', '通过开箱有礼等活动，提升门店老板进货积极性'],
        ['再来一瓶/一元乐享', '电子化“再来一瓶”活动，门店核销，高效促销'],
        ['业务员返利', '自动化业务员返利，促进业务员积极铺货，积极开发新终端'],
        ['出入库管理', '简单易操作的出入库工具，实现产品追溯与渠道库存监控'],
        ['渠道分析', '实现渠道库存分析，周转分析，货龄分析']
      ],
      qr: null
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '商户小程序' }])
    await wechat_mini_program.merchant().then(({ data }) => {
      if (data) {
        this.detail = data
      }
    })
    wechat_mini_program.qr_code({ scene: this.account.store.code, page: 'pages/sign_up/webview' }).then(response => {
      this.qr = response.data
    })
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
  .funcs{
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
