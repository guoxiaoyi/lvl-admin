<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          卡券功能概览
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading no-border-bottom">
        <h4 style="font-size: 16px; font-weight: 400">卡券应用场景</h4>
      </div>
      <div class="panel-body">
        <ul class="flex flex-wrap card-scene">
          <li v-for="(scene, index) in scenes" :key="index" class="col-6">
            <dl class="flex">
              <dt><img :src="require('@/assets/image_icon/' + scene.image)"></dt>
              <dd>
                <h4>{{ scene.title }}</h4>
                <p>{{ scene.desc }}</p>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="panel-heading no-border-bottom">
        <h4 style="font-size: 16px; font-weight: 400">卡券使用流程</h4>
      </div>
      <div class="panel-body">
        <ul class="flex card-step">
          <li class="col-3 flex">
            <div class="step"><span>第一步</span></div>
            <div class="content">
              <h4>创建卡券</h4>
              <div class="sub-step">
                <p> 1.进入<span>【礼品管理】</span>模块 </p>
                <p> 2.创建自主卡券类礼品 </p>
                <p> 3.设置卡券名称，图片及使用规则 </p>
              </div>
              <router-link :to="{ name: 'GoodsListNew' }" class="link">
                点击跳转>>
              </router-link>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第二步</span></div>
            <div class="content">
              <h4>投放卡券</h4>
              <div class="sub-step">
                <p> 1.进入<span>【活动管理】</span>模块 </p>
                <p> 2.创建二维码活动</p>
                <p> 3.将卡券礼品设为活动奖品</p>
                <p> 4.设置活动规则及领取条件 </p>
              </div>
              <router-link :to="{ name: 'ActivityListNew'}" class="link">
                点击跳转>>
              </router-link>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第三步</span></div>
            <div class="content">
              <h4>领取卡券</h4>
              <div class="sub-step">
                <p>1.用户通过扫码领取卡券 </p>
                <p>2.卡券进入用户卡包 </p>
              </div>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第四步</span></div>
            <div class="content">
              <h4>核销卡券</h4>
              <div class="sub-step">
                <p> 1.用户打开个人中心卡包</p>
                <p> 2.核销员使用<span>【利多码商户助手】</span>小程序核销用户卡券 </p>
              </div>
              <a href="/admin/merchant_wechat_mini_program/info" class="link">点击跳转>></a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scenes: [
        {
          image: '3.png',
          title: '扫码领券，线下核销引流',
          desc: '消费者购买产品，扫码领券，线下商家通过“商户助手小程序”核销卡券，为门店引流'
        },
        {
          image: '6.png',
          title: '电子化再来一瓶',
          desc: '消费者购买产品，扫码中奖“再来一瓶”，通过卡券方式线下兑换，同时方便经销商与门店的兑换补货流程。'
        },
        {
          image: '5.png',
          title: '电商引流',
          desc: '消费者购买产品，扫码领取企业电商优惠券，如京东，淘宝优惠券，引导用户进入电商，形成二次营销。'
        },
        {
          image: '10.png',
          title: '第三方卡券，异业营销',
          desc: '消费者购买产品，扫码领取第三方卡券，如优酷券，滴滴打车券等，丰富活动奖品配置，降低活动营销成本。'
        }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '卡券功能概览' }
    ])
  }
}
</script>

<style lang="scss" scoped>
.no-border-bottom {
  border-bottom: none;
}
.card-scene{
  margin-left: -15px;
  margin-right: -15px;
  [class^='col-']{
    padding: 10px 15px;
    dl{
      height: 100%;
      border: 1px dashed #BBB;
      padding: 30px;
      border-radius: 8px;
      img{
        width: 40px;
        margin-right: 20px;
      }
      h4{
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
.card-step{
  margin-left: -15px;
  margin-right: -15px;
  [class^='col-']{
    flex-direction: column;
    &:first-child{
      .step{
        margin-left: 15px;
      }
    }
    &:last-child{
      .step{
        margin-right: 15px;
      }
    }
  }
  .step{
    position: relative;
    height: 24px;
    text-align: center;
    span{
      display: inline-block;
      line-height: 24px;
      border-radius: 24px;
      color: #FFF;
      background: rgba(243, 69, 65, 1);
      text-align: center;
      font-size: 14px;
      padding: 0 11px;
      position: relative;
      z-index: 1;
    }
    &:after{
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background: rgba(243, 69, 65, 1);
      top: 12px;
      position: absolute;
    }
  }
  .content{
    padding: 40px 26px;
    background: rgba(248, 248, 248, 1);
    margin: 10px 15px;
    border-radius: 8px;
    height: 100%;
    h4{
      margin-bottom: 20px;
    }
    .sub-step{
      min-height: 120px;
    }
    p{
      color: rgba(153, 153, 153, 1);
      margin-bottom: 5px;
      span{
        color: #000;
      }
    }
  }
}
</style>
