<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 核销详情 </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-heading">
        <h5>核销信息</h5>
      </div>
      <div class="panel-body table-responsive">
        <table class="table table-loose table-hover">
          <tr>
            <td>核销时间</td><td>{{ detail.createdAt }}</td>
          </tr>
          <tr>
            <td>核销单号</td><td>{{ detail.code }}</td>
          </tr>
          <tr>
            <td>被核销方</td>
            <td>
              <router-link v-if="!detail.channelDeleted" :to="{ name: 'ChannelShow', params: { id: detail.channelId } }">
                {{ detail.channelName }}
              </router-link>
              <span v-else>{{ detail.channelName }}</span>
            </td>
          </tr>
          <tr>
            <td>核销方</td>
            <td>
              <router-link :to="{ name: 'ChannelShow', params: { id: detail.parentChannelId } }">
                {{ detail.parentChannelName }}
              </router-link>
            </td>
          </tr>
          <tr>
            <td>核销人</td>
            <td> {{ detail.operatorName }} </td>
          </tr>
          <tr>
            <td>状态</td>
            <td>
              <el-tag v-if="detail.state === 'pending'" type="warning" effect="plain"> {{ detail.stateName }} </el-tag>
              <el-tag v-else type="info" effect="plain"> {{ detail.stateName }} </el-tag>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td> {{ detail.note }} </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="detail.goods.length > 0" class="panel panel-default new-show">
      <div class="panel-heading">
        <h5>卡劵信息</h5>
      </div>
      <div class="panel-body table-responsive">
        <div class="panel panel-default" style="border-top: none;">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>卡券名称</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detail.goods" :key="item.goodId">
                <td>
                  <router-link :to="{ name: 'GoodsShow', params: { goodsId: item.goodId}}">
                    {{ item.goodName }}
                  </router-link>
                </td>
                <td> {{ item.quantity }} </td>
              </tr>
              <tr>
                <td />
                <td>合计: {{ detail.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import couponVerificationAudit from '@/api/couponVerificationAudit'
export default {
  data() {
    return {
      detail: {
        goods: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道核销记录', path: { name: 'CouponVerificationAuditsIndex' }},
      { title: '核销详情' }
    ])
    couponVerificationAudit.show(this.$route.params).then(response => {
      this.detail = response.data
    })
  }
}
</script>
