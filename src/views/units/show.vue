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
            <td>
              <router-link v-if="detail.userId" :to="{ name: 'UserShow', params: { userId: detail.userId }}">
                {{ detail.userName }}
              </router-link>
              <span v-else> - </span>
            </td>
          </tr>
          <tr>
            <td>{{ $t('unit.visited_location') }}</td>
            <td>{{ detail.scanRegion }}</td>
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
    <template v-if="detail.activityId">
      <template v-if="detail.activityMultiTakeEnabled">
        <template v-if="detail.orderCount > 0">
          <div v-if="detail.activityId" class="panel panel-default new-show">
            <div class="panel-heading">
              <h5>活动信息</h5>
            </div>
            <div class="panel-body">
              <div class="panel panel-default">
                <el-table v-loading="crud.loading" :data="crud.data">
                  <el-table-column prop="activityId" label="订单号/创建时间">
                    <template slot-scope="scope">
                      <router-link :to="{ name: 'AwardOrderShow', params: { id: scope.row.code } }"> {{ scope.row.code }} </router-link>
                      <p class="text-muted">{{ scope.row.createdAt }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="activityId" label="活动">
                    <template slot-scope="scope">
                      <router-link :to="{ name: 'ActivityShow', params: { activityId: scope.row.activity.id } }"> {{ scope.row.activity.title }} </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="activityId" label="奖项">
                    <template slot-scope="scope">
                      {{ scope.row.award.title }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="activityId" label="奖品">
                    <template slot-scope="scope">
                      <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.goods.id }}">
                        {{ scope.row.goods.name }}
                      </router-link>
                      <GoodsPrice :detail="scope.row.goods" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="activityId" label="用户">
                    <template slot-scope="scope">
                      <router-link :to="{ name: 'UserShow', params: { userId: scope.row.user.id }}">
                        {{ scope.row.user.nickname }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="activityId" label="状态/兑奖时间">
                    <template slot-scope="scope">
                      <span class="label" :class="[`label-${scope.row.state}`]">{{ scope.row.stateText }}</span>
                      <p class="text-muted">{{ scope.row.submittedAt }}</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <pagination />
            </div>
          </div>
        </template>
        <ActivityDetail v-else :activity="{ name: detail.activityName, id: detail.activityId }" :unit="detail" />
      </template>
      <template v-else>
        <template v-if="detail.award">
          <ActivityDetail :activity="{ name: detail.activityName, id: detail.activityId }" :award="detail.award" :good="detail.award.goods" :unit="detail" />
        </template>
        <template v-else>
          <ActivityDetail :activity="{ name: detail.activityName, id: detail.activityId }" :unit="detail" />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import GoodsPrice from '@/components/Goods/Price'
import ActivityDetail from './ActivityDetail.vue'
import unit from '@/api/unit'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
export default {
  components: {
    pagination,
    GoodsPrice,
    ActivityDetail
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '订单列表', url: '/lmp/v2/admin/award_order', query: { unitId: this.parent.$route.params.id }})
  },
  data() {
    return {
      detail: {},
      list: []
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  },
  async mounted() {
    if (this.$route.name === 'ActivityUnitShow') {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }}
      ])
      // await activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      // })
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }},
        { title: this.activityData.title, path: { name: 'ActivityShow', params: { activityId: this.$route.params.activityId }}},
        { title: '二维码详情' }
      ])
      await unit.get_activity_unit({ activityId: this.$route.params.activityId, id: this.$route.params.id }).then(({ data }) => {
        this.detail = data
      })
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '二维码查询', path: { name: 'UnitIndex' }},
        { title: '二维码详情' }
      ])
      await unit.get({ id: this.$route.params.id }).then(({ data }) => {
        this.detail = data
      })
    }
    if (this.detail.activityId && this.detail.activityMultiTakeEnabled && this.detail.orderCount > 0) {
      this.crud.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
