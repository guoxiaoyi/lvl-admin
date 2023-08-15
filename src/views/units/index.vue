<template>
  <div class="app-container">
    <slot name="page-tab">
      <ul class="nav nav-tabs" role="tablist">
        <li :class="{ active: searchTemplate === 'batch'}" @click="searchTemplate = 'batch'"><a href="javascript:void(0)">序号搜索</a></li>
        <li :class="{ active: searchTemplate === 'range'}" @click="searchTemplate = 'range'"><a href="javascript:void(0)">号段搜索</a></li>
        <li :class="{ active: searchTemplate === 'unit_code'}" @click="searchTemplate = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li>
      </ul>
    </slot>
    <div class="panel panel-default">
      <div class="panel-body">
        <ul v-if="$route.name === 'ActivityUnits'" class="nav nav-pills" role="tablist" style="margin-bottom: 10px;">
          <li :class="{ active: searchTemplate === 'batch'}" @click="searchTemplate = 'batch'"><a href="javascript:void(0)">序号搜索</a></li>
          <li :class="{ active: searchTemplate === 'range'}" @click="searchTemplate = 'range'"><a href="javascript:void(0)">号段搜索</a></li>
          <li :class="{ active: searchTemplate === 'unit_code'}" @click="searchTemplate = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li>
        </ul>
        <div class="page_toolbar">
          <component :is="searchTemplate" :query="query">
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery(false)"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </component>
        </div>
        <div class="panel panel-default">
          <lfl-table :list="crud.data">
            <el-table v-loading="crud.loading" :data="crud.data">
              <el-table-column label="序号" prop="snText" />
              <el-table-column label="所属活动" prop="activityName">
                <template slot-scope="scope">
                  <a v-if="scope.row.activityName" :href="`/admin/activities/${scope.row.activityId}`">{{ scope.row.activityName }}</a>
                </template>
              </el-table-column>
              <el-table-column label="激活状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.enabledAt ? 'success' : 'warning'">{{ scope.row.enabledAt ? '已激活' : '未激活' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="扫码状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.visitedAt ? 'success' : 'warning'">{{ scope.row.visitedAt ? '已扫码' : '未扫码' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="首次扫码时间" prop="visitedAt" />
              <el-table-column label="抽奖状态" prop="usedAt">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.usedAt ? 'success' : 'warning'">{{ scope.row.usedAt ? '已抽奖' : '未抽奖' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="作废状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.deletedAt ? 'warning' : 'success'">{{ scope.row.deletedAt ? '已作废' : '正常' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.deletedAt" type="text">详情</el-button>
                  <el-button type="text" @click="previewCode(scope.row)">预览</el-button>
                  <el-button type="text">激活</el-button>
                  <el-button type="text">作废</el-button>
                </template>
              </el-table-column>
            </el-table>
          </lfl-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="previewClose"
      :visible.sync="preview.show"
      :title="`序号：${preview.code}`"
      width="460px"
    >
      <div class="flex align-items-center justify-content__center" style="padding: 15px">
        <vue-qr v-if="preview.url" ref="Qrcode" :text="preview.url" :size="320" :margin="0" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import LflTable from '@/components/LflTable'
import batch from '@/components/Units/Search/batch.vue'
import range from '@/components/Units/Search/range.vue'
import unit_code from '@/components/Units/Search/unit_code.vue'
import VueQr from 'vue-qr'
export default {
  components: {
    pagination,
    LflTable,
    batch,
    range,
    unit_code,
    VueQr
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const query = {}
    if (this.parent.$route.name === 'ActivityUnits') {
      query.activityId = this.parent.$route.params.activityId
    }
    return CRUD({ title: '二维码查询', url: '/lmp/v2/admin/unit', query })
  },
  data() {
    return {
      searchTemplate: 'batch',
      preview: {
        show: false,
        code: '',
        url: null
      }
    }
  },
  watch: {
    searchTemplate() {
      this.crud.resetQuery(false)
      this.crud.clearDatas()
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '二维码查询' }])
    if (this.$route.name === 'ActivityUnits') {
      this.crud.refresh()
    }
  },
  methods: {
    previewCode(data) {
      this.preview.code = data.snText
      this.preview.url = data.url
      this.preview.show = true
    },
    previewClose() {
      this.preview.show = false
      this.preview.url = null
      this.preview.code = ''
    }
  }
}
</script>
