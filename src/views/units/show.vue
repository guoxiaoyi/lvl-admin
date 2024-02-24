<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          二维码详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-heading">
        <h5>基本信息</h5>
      </div>
      <div class="panel-body table-responsive">
        <table class="table table-loose table-hover">
          <tr>
            <td>{{ $t('unit.sn_text') }}</td>
            <td>{{ detail.snText }}</td>
          </tr>
          <tr>
            <td>{{ $t('unit.deleted') }}</td>
            <td>
              {{ detail.deletedAt ? '已作废' : '正常' }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('unit.visited') }}</td>
            <td>
              {{ detail.visitedAt? '是' : '否' }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('unit.visited_at') }}</td>
            <td>{{ detail.visitedAt }}</td>
          </tr>
          <tr>
            <td>{{ $t('unit.visited_user') }}</td>
            <td> </td>
          </tr>
          <tr>
            <td>{{ $t('unit.visited_location') }}</td>
            <td></td>
          </tr>
          <tr>
            <td>{{ $t('unit.visit_count') }}</td>
            <td>{{ detail.visitCount }}</td>
          </tr>
          <tr>
            <td>{{ $t('unit.used') }}</td>
            <td>{{ detail.usedAt ? '是' : '否' }}</td>
          </tr>
          <tr v-if="detail.activityId && detail.activityMultiTakeEnabled ">
            <td>{{ $t('unit.taken_count') }}</td>
            <td>{{ detail.takenCount }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="panel panel-default new-show">
      <div class="panel-heading">
        <h5>活动信息</h5>
      </div>
      <div class="panel-body">
        <table class="table table-loose table-hover">
          <tr>
            <td>{{ $t('unit.activity') }}</td>
            <td>{{ detail.activityId }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import unit from '@/api/unit'
export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '二维码查询', path: { name: 'UnitIndex' }},
      { title: '二维码详情' }
    ])
    unit.get({ id: this.$route.params.id }).then(({ data }) => {
      this.detail = data
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
