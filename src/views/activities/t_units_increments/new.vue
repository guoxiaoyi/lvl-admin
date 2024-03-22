<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          添加二维码
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-warning" role="alert">
          <h4><i class="fa fa-alert-warning" /> 注意：</h4>
          <ul>
            <li>添加二维码，会影响现有活动的中奖比例，建议先暂停活动，重新配置奖项数量后再开启活动。</li>
            <li>添加二维码，会从您的账户中扣除相应的二维码额度，且无法退还，请确认数量正确无误。</li>
          </ul>
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form" @submit.native.prevent>
          <el-form-item label="账户二维码余额">
            <el-statistic
              group-separator=","
              :precision="0"
              :value="account.store.unitsBalance"
            />
          </el-form-item>
          <el-form-item v-if="$route.query.type === 'TUnitsIncrementBatch'" label="生产批次">
            <el-input v-model="code" @keyup.enter.native="confirm">
              <template slot="append">
                <el-button :loading="loading" @click="confirm">确定</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-else label="出库单">
            <el-input v-model="code" @keyup.enter.native="confirm">
              <template slot="append">
                <el-button :loading="loading" @click="confirm">确定</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="$route.query.type === 'TUnitsIncrementBatch'" label="二维码数量">
            <div class="sns-content">
              <div class="panel panel-default table-responsive">
                <div class="panel-heading">
                  活动码：<span id="show_units_amount">{{ sum }}</span>
                </div>
                <el-table :data="list">
                  <el-table-column label="序号" width="50px" type="index" :index="indexMethod" />
                  <el-table-column label="活动码数量" prop="unitAmount" width="140px" />
                  <el-table-column label="生产批次/生产时间">
                    <template slot-scope="scope">
                      <div> {{ scope.row.code }} </div>
                      <div class="text-muted">{{ scope.row.createdAt }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="产品套码规格">
                    <template slot-scope="scope">
                      <div class="flex items-center">
                        <CustomImg :image="scope.row.unitSpec.product.imageList[0]" :size="{width: '40px', height: '40px' }" />
                        <div style="margin-left: 10px; color: #999;">
                          <router-link :to="{ name: 'ProductShow', params: { id: scope.row.unitSpec.product.id }}">
                            {{ scope.row.unitSpec.product.name }}
                          </router-link>
                          <br>
                          {{ scope.row.unitSpec.specLabel }}
                        </div>
                      </div>
                    </template>

                  </el-table-column>
                  <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                      <el-button type="text" @click="del(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-else label="二维码数量">
            <div class="sns-content">
              <div class="panel panel-default table-responsive">
                <div class="panel-heading">
                  活动码：<span id="show_units_amount">{{ sum }}</span>
                </div>
                <el-table :data="list">
                  <el-table-column label="序号" width="50px" type="index" :index="indexMethod" />
                  <el-table-column label="活动码数量" prop="unitAmount" width="140px" />
                  <el-table-column label="单号/时间">
                    <template slot-scope="scope">
                      <router-link :to="{name: 'TChannelInReceiptShow', params: {id: scope.row.id}}">
                        {{ scope.row.code }}
                      </router-link>
                      <div class="text-muted">{{ scope.row.createdAt }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="发货渠道-收货渠道">
                    <template slot-scope="scope">
                      <div class="flex items-center">
                        <router-link v-if="scope.row.outChannelId" :to="{name: 'ChannelShow', params: {id: scope.row.outChannelId}}">
                          {{ scope.row.outChannelName }}
                        </router-link>
                        <span v-else>-</span>
                        <i class="fa fa-long-arrow-right" style="margin-left: 5px; margin-right: 5px;" />
                        <router-link :to="{name: 'ChannelShow', params: {id: scope.row.inChannelId}}">
                          {{ scope.row.inChannelName }}
                        </router-link>
                      </div>

                    </template>

                  </el-table-column>
                  <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                      <el-button type="text" @click="del(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>
          <el-divider />
          <el-button type="success" @click="submit">确定添加</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import CustomImg from '@/components/Image/goods'
import { mapGetters } from 'vuex'
export default {
  components: {
    CustomImg
  },
  data() {
    return {
      code: null,
      detail: {
        userTags: []
      },
      rules: {},
      form: {},
      preAddedResources: [],
      list: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData']),
    sum() {
      let sum = 0
      this.list.map(i => {
        sum += i.unitAmount
        return false
      })
      return sum
    }
  },
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
    this.detail = this.activityData
  },
  methods: {

    confirm() {
      if (!this.loading) {
        this.loading = true
        activities.amount_increment_trace({
          id: this.$route.params.activityId,
          type: this.$route.query.type,
          currentResource: this.code,
          preAddedResources: this.preAddedResources
        }).then(({ data }) => {
          this.preAddedResources.push(this.code)
          this.code = null
          this.list.unshift(data)
          this.loading = false
        }).catch(fail => {
          this.loading = false
        })
      }
    },
    submit() {
      if (confirm('是否确认操作？')) {
        activities.amount_increment({
          id: this.$route.params.activityId,
          type: this.$route.query.type,
          traceSource: this.preAddedResources
        }).then(({ data }) => {
          this.$message.success('添加二维码已在处理，添加完成后自动更新二维码数量及可用号段。')
          this.$router.push({ name: 'ActivityShow', params: { activityId: this.$route.params.activityId }})
        })
      }
    },
    del(data) {
      const index = this.list.findIndex(i => i.code === data.code)
      const preAddedResourcesIndex = this.preAddedResources.findIndex(i => i === data.code)
      this.list.splice(index, 1)
      this.preAddedResources.splice(preAddedResourcesIndex, 1)
    },
    indexMethod(index) {
      return this.list.length - index
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep {
  .number {
    color: #3c763d;
    font-size: 18px;
    font-weight: bold;
  }
  .sns-content {
    line-height: 1.428571429;
  }
  .el-input-group__append {
    span {
      color: #FFF;
    }
  }
}
</style>
