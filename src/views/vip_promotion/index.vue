<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 拉新推广</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.label" placeholder="名称" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="query.sourceType" clearable>
                <el-option v-for="(item, index) in sourceTypeData" :key="item" :value="index" :label="item" />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="名称" prop="label" />
            <el-table-column label="类型" prop="sourceTypeName" />
            <el-table-column label="关联" prop="relatedContent" min-width="160">
              <template slot-scope="scope">
                <router-link v-if="scope.row.sourceType === 'unit_activity'" :to="{ name: 'ActivityShow', params: { activityId: scope.row.relatedObject.id }}">
                  {{ scope.row.relatedObject.title }}
                </router-link>
                <div v-else-if="scope.row.sourceType === 'wechat'">
                  {{ scope.row.relatedObject.typeName }}
                </div>
                <div v-else>{{ scope.row.relatedContent }}</div>
              </template>
            </el-table-column>
            <el-table-column label="开关" prop="state" width="120px">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.state" active-value="enabled" inactive-value="closed" :disabled="!checkPer(['vip_promotion_manage'])" @change="switchState(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.showPromotion" type="text" @click="promotion(scope.row)">推广</el-button>
                <el-button v-if="checkPer(['vip_promotion_manage'])" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="promotionModal.show"
      title="推广"
      width="580px"
    >
      <div v-loading="promotionModal.loading" style="text-align: center;">
        <p>复制链接推广</p>
        <div style="width: 80%; margin: 0 auto; margin-bottom: 10px;">
          <el-input ref="copyUrl" v-model="promotionModal.url" type="textarea" style="opacity: 0;position: absolute;" :rows="20" resize="none" />
          <el-input v-model="promotionModal.url" :disabled="true">
            <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
          </el-input>
        </div>
        <el-image :src="promotionModal.url" style="width: 200px; height: 200px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import acquisition_promotion from '@/api/acquisition_promotion'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      sourceTypeData: {},
      promotionModal: {
        loading: true,
        url: null,
        show: false
      }
    }
  },
  cruds() {
    return CRUD({ title: '会员审核', url: '/lmp/v2/admin/acquisition_promotion' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '拉新推广', path: { name: 'VipPromotion' }}])
    this.crud.refresh()
    acquisition_promotion.source_type().then(({ data }) => {
      this.sourceTypeData = data
    })
  },
  methods: {
    switchState(data) {
      acquisition_promotion.switch_state(data).then(response => {
        if (data.state === 'enabled') {
          this.$message.success('已开启')
        } else {
          this.$message.success('已关闭')
        }
      })
    },
    promotion(data) {
      this.promotionModal.show = true
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
