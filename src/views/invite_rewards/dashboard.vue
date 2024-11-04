<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"><a href="javascript: void(0)">邀请有礼</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="10">
            <div class="phone-frame" style="margin: 0 auto;">
              <img src="@/assets/preview_invite.jpg" style="width: 100%">
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="t">
              <h3 style="line-height: 40px;">邀请有礼 <br>裂变获客利器</h3>
              <div class="flex justify-content__space-between items-center" style="padding: 20px; border: 1px solid rgb(221, 221, 221); border-radius: 4px; margin-top: 30px; margin-bottom: 20px;">
                <div style="font-size: 18px;">
                  通用版
                  <p style="font-size: 14px; margin: 10px 0;">通过给与奖励方式带动客户自发老带新传播，精准拓客同时提高活跃</p>
                </div>
                <router-link :to="{ name: 'InviteRewardsSetting' }" class="el-button el-button--primary">设置</router-link>
              </div>
              <h4>邀请数据概览：</h4>
            </div>
            <div>
              <div class="flex state">
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">今日新增邀请人数</p>
                      <h4>{{ stats.todayNewInviteCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">今日新增会员数</p>
                      <h4>{{ stats.todayNewVipCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">累计邀请人数</p>
                      <h4>{{ stats.totalInviteCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">累计新增会员数</p>
                      <h4>{{ stats.totalVipCount }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { invite_vip_register_order_summary } from '@/api/stats'
export default {
  data() {
    return {
      stats: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼' }])
    invite_vip_register_order_summary().then(({ data }) => {
      this.stats = data
    })
  }
}
</script>

<style lang="scss" scoped>
.state {
  flex-wrap: wrap;
  .flex-item {
    flex: 0 0 50%;
    padding: 10px;
    .panel {
      margin-bottom: 0;
      border-radius: 5px;
      .panel-body {
        h4 {
          color: #F34541;
          font-size: 30px;
        }
      }
    }
  }
}
.t {
  padding: 0 10px;
  h3, h5 {
    font-size: 24px;
  }
}
</style>
