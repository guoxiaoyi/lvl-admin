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
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </component>
        </div>
        <div class="panel panel-default">
          <div v-if="crud.data.length" class="panel-heading">
            <el-button type="danger" :disabled="selected.length <= 0" @click="batch_destroy('single')">作废</el-button>
            <el-button type="success" :disabled="selected.length <= 0" @click="batch_enabled('single')">激活</el-button>
            <el-popover
              placement="top"
              title="全部作废"
              width="340"
              trigger="hover"
              style="margin-left: 10px;"
              :content="`作废当前搜索条件下的所有二维码,共${crud.page.total}条`"
            >
              <el-button slot="reference" type="danger" @click="batch_destroy('all')">全部作废</el-button>
            </el-popover>
            <el-popover
              placement="top"
              title="全部激活"
              width="340"
              trigger="hover"
              style="margin-left: 10px;"
              :content="`激活当前搜索条件下的所有二维码,共${crud.page.total}条`"
            >
              <el-button slot="reference" type="success" @click="batch_enabled('all')">全部激活</el-button>
            </el-popover>
          </div>
          <lfl-table v-loading="crud.loading" :list="crud.data">
            <el-table :data="crud.data" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
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
              <el-table-column label="首次扫码时间" prop="visitedAt" width="160px" />
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
                  <el-button v-if="!scope.row.deletedAt" type="text" @click="get(scope.row)">详情</el-button>
                  <el-button type="text" @click="preview(scope.row)">预览</el-button>
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
    <PreViewCode :show.sync="previewModal.show" :link="previewModal.data.link" :title="'序号：'+previewModal.data.sn" width="460px" :size="320" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'
import unit from '@/api/unit'
import LflTable from '@/components/LflTable'
import batch from '@/components/Units/Search/batch.vue'
import range from '@/components/Units/Search/range.vue'
import unit_code from '@/components/Units/Search/unit_code.vue'
import PreViewCode from '@/components/PreView/Code.vue'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  components: {
    pagination,
    LflTable,
    batch,
    range,
    unit_code,
    PreViewCode
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const query = {}
    if (this.parent.$route.name === 'ActivityUnits') {
      query.activityId = this.parent.$route.params.activityId
    }
    return CRUD({ title: '二维码查询', url: '/lmp/v2/admin/unit', query, sort: ['sn,asc'] })
  },
  data() {
    return {
      searchTemplate: 'batch',
      previewModal: {
        data: {
          link: '',
          sn: ''
        },
        show: false
      },
      selected: []
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    searchTemplate() {
      this.crud.resetQuery(false)
      if (this.$route.name !== 'ActivityUnits') {
        this.crud.clearDatas()
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '二维码查询' }])
    if (this.$route.name === 'ActivityUnits') {
      this.crud.refresh()
    }
  },
  methods: {
    preview(data) {
      if (this.account.store.needUnitPreviewPwd && !Cookies.get('unit_pwd')) {
        this.$prompt('', '请输入密码', {
          confirmButtonText: '查看',
          inputType: 'password'
        }).then(({ value }) => {
          Cookies.set('unit_pwd', value)
          unit.get_url({ sn: data.snText, password: Cookies.get('unit_pwd') }).then(response => {
            this.previewModal.show = true
            this.previewModal.data.sn = data.snText
            this.previewModal.data.link = response.data
          }).catch(fail => {
            Cookies.remove('unit_pwd')
            this.preview(data)
          })
        }).catch(() => {
        })
      } else {
        unit.get_url({ sn: data.snText, password: Cookies.get('unit_pwd') }).then(response => {
          this.previewModal.show = true
          this.previewModal.data.sn = data.snText
          this.previewModal.data.link = response.data
        }).catch(fail => {
          Cookies.remove('unit_pwd')
          this.preview(data)
        })
      }
    },
    handleSelectionChange(value) {
      this.selected = value
    },
    batch_destroy(action) {
      if (action === 'single') {
        if (confirm('确定作废二维码？作废后不可恢复。')) {
          unit.batch_destroy({ unitIds: this.selected.map(i => i.id) }).then(response => {
            this.crud.refresh()
          })
        }
      } else {
        if (confirm(`确定作废全部二维码？共 ${this.crud.page.total} 条`)) {
          unit.batch_destroy(this.crud.query).then(response => {
            this.crud.refresh()
          })
        }
      }
    },
    batch_enabled(action) {
      if (action === 'single') {
        if (confirm('确定激活二维码？激活后不可恢复。')) {
          unit.batch_enabled({ unitIds: this.selected.map(i => i.id) }).then(response => {
            this.crud.refresh()
          })
        }
      } else {
        if (confirm(`确定激活全部二维码？共 ${this.crud.page.total} 条`)) {
          unit.batch_enabled(this.crud.query).then(response => {
            this.crud.refresh()
          })
        }
      }
    },
    resetQuery() {
      this.crud.resetQuery(false)
      this.crud.data = []
      this.crud.page.page = 0
      this.crud.page.total = 0
      this.crud.page.totalPages = 1
    },
    get(data) {
      const u = window.open('about:blank')
      u.location.href = `/admin/units/${data.id}`
    }
  }
}
</script>
