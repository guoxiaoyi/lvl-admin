<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          窜货详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table class="table table-loose table-hover">
          <tbody>
            <tr>
              <td>产品名称</td>
              <td>
                <router-link v-if="fleeing.product" :to="{ name: 'ProductShow', params: { id: fleeing.product.id } }">
                  {{ fleeing.product.name }}
                </router-link>
              </td>
            </tr>
            <tr>
              <td>规格</td>
              <td> {{ fleeing.specLabel }} </td>
            </tr>
            <tr>
              <td>窜货类型</td>
              <td> {{ fleeing.typeText }} </td>
            </tr>
            <tr>
              <td>活动</td>
              <td>
                <template v-if="fleeing.activityId">
                  <router-link v-if="!fleeing.activityDeleted" :to="{ name: 'ActivityShow', params: { activityId: fleeing.activityId } }">
                    {{ fleeing.activityTitle }}
                  </router-link>
                  <span v-else>[已删]{{ fleeing.activityTitle }}</span>
                </template>
                <template v-else>
                  -
                </template>
              </td>
            </tr>
            <tr>
              <td>活动码</td>
              <td>
                <a v-if="fleeing.unitId" :href="`/admin/activities/${fleeing.activityId}/units/${fleeing.unitId}`">
                  {{ fleeing.unitCode }}
                </a>
                <span v-else>
                  -
                </span>
              </td>
            </tr>
            <tr>
              <td>产品批次</td>
              <td> {{ fleeing.unitBatchCode }} </td>
            </tr>
            <tr>
              <td>追溯码</td>
              <td> {{ fleeing.unitIdSnText }} </td>
            </tr>
            <tr>
              <td>窜货渠道</td>
              <td>
                <template v-if="fleeing.channelId">
                  <router-link v-if="!fleeing.channelDeleted" :to="{ name: 'ChannelShow', params: { channelId: fleeing.channelId } }">
                    {{ fleeing.channelName }}
                  </router-link>
                  <span v-else>[已删]{{ fleeing.channelName }}</span>
                </template>
                <template v-else>
                  -
                </template>
              </td>
            </tr>
            <tr>
              <td>渠道类型</td>
              <td> {{ fleeing.channelType }} </td>
            </tr>
            <tr>
              <td>业务范围</td>
              <td> {{ fleeing.name }} </td>
            </tr>
            <tr>
              <td>实际扫码区域</td>
              <td> {{ fleeing.scanRegion }} </td>
            </tr>
            <tr>
              <td>时间</td>
              <td> {{ fleeing.updatedAt }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fleeings from '@/api/fleeing'
export default {
  data() {
    return {
      fleeing: { }
    }
  },
  created() {
    fleeings.get(this.$route.params).then(res => {
      this.fleeing = res.data
    })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '窜货记录', path: { name: 'FleeingIndex' }}, { title: '窜货详情' }])
  }
}
</script>

<style>

</style>
