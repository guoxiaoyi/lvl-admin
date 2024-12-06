<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <a href="javascript:void(0)">会员管理概览</a></li>
    </ul>
    <div class="panel panel-default table-responsive">
      <div class="panel-heading text-center" style="border-bottom: none">
        <h3>快速搭建会员成长体系，保障会员活跃度。</h3>
        <p>
          通过会员等级、会员权益和成长任务提升用户对平台的忠诚度、将用户一步步培养为产品的忠实粉丝。
        </p>
      </div>

      <ul class="flex card-step">
        <li class="col-3 flex">
          <div class="content">
            <h4>
              会员注册
              <small> 通过完善会员资料，建立顾客画像，为顾客分层，实施精准营销策略提供参考。</small>
            </h4>
            <el-button v-if="registerFuncEnabled" type="success" @click="$router.push({ name: 'VipSettingEdit' })">立即设置</el-button>
            <el-tooltip v-else content="如需开通, 请联系专属客服" placement="top" effect="light">
              <el-button>未开通</el-button>
            </el-tooltip>
            <img :src="require('@/assets/vip/edit.png')">
          </div>
        </li>
        <li class="col-3 flex">
          <div class="content">
            <h4>
              会员等级
              <small> 通过会员等级与成长值机制，动态优化会员人群分层。</small>
            </h4>
            <el-button v-if="vipFuncEnabled" type="success" @click="$router.push({ name: 'VipLevelsIndex' })">立即设置</el-button>
            <el-tooltip v-else content="如需开通, 请联系专属客服" placement="top" effect="light">
              <el-button>未开通</el-button>
            </el-tooltip>

            <img :src="require('@/assets/vip/level.png')">
          </div>
        </li>
        <li class="col-3 flex">
          <div class="content">
            <h4>
              会员任务
              <small> 引导用户通过消费、互动等行为升级成为高等级会员。</small>
            </h4>
            <el-button v-if="vipFuncEnabled" type="success" @click="$router.push({ name: 'VipSettingEditTask' })">立即设置</el-button>
            <el-tooltip v-else content="如需开通, 请联系专属客服" placement="top" effect="light">
              <el-button>未开通</el-button>
            </el-tooltip>

            <img :src="require('@/assets/vip/task.png')">
          </div>
        </li>
        <li class="col-3 flex">
          <div class="content">
            <h4>
              会员权益
              <small> 不同会员等级享受会员权益，帮助保持会员活跃，提高复购。</small>
            </h4>
            <el-button v-if="vipFuncEnabled" type="success" @click="$router.push({ name: 'VipInterestIndex' })">立即设置</el-button>
            <el-tooltip v-else content="如需开通, 请联系专属客服" placement="top" effect="light">
              <el-button>未开通</el-button>
            </el-tooltip>

            <img :src="require('@/assets/vip/show.png')">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import point_store from '@/api/point_store'
export default {
  data() {
    return {
      registerFuncEnabled: false,
      vipFuncEnabled: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员管理概览' }
    ])
    point_store.functions().then(response => {
      this.registerFuncEnabled = response.data.registerFuncEnabled
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })
  }
}
</script>

<style lang="scss" scoped>

.panel-heading h3{
  padding-top: 30px;
}
.card-step {
  margin-top: 10px;
  .content {
    padding: 19px;
    background: #f8f8f8;
    margin: 10px 15px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin: 0;
      small {
        margin-top: 10px;
        display: block;
        font-size: 14px;
        font-weight: normal;
        color: #333333;
        line-height: 24px;
      }
    }
    a {
      margin-top: 12px;
      margin-bottom: 12px;
      width: 40%;
    }
    img {
      width: 100%;
      margin-top: 19px;
      vertical-align: bottom;
    }
  }
}

</style>
