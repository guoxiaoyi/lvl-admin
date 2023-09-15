<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <lfl-table :list="crud.data">
          <div class="panel panel-default">
            <el-table v-loading="crud.loading" :data="crud.data">
              <el-table-column label="时间" prop="createdAt" />
              <el-table-column label="类型" prop="typeText" />
              <el-table-column label="数量" prop="amount" />
              <el-table-column label="开始编号" prop="snStartText" />
              <el-table-column label="结束编号" prop="snEndText" />
              <el-table-column label="状态" prop="stateText" width="120px" />
              <el-table-column label="备注" prop="note" width="180px">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.note && scope.row.note.length > 10" effect="dark" placement="top">
                    <div slot="content" class="content">{{ scope.row.note }}</div>
                    <div>{{ truncate(scope.row.note, 10) }}</div>
                  </el-tooltip>
                  <span v-else>{{ scope.row.note }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <template v-if="checkPer(['unit_export_manage'])">
                    <template v-if="scope.row.state === 'reset'">
                      <el-button type="text" @click="reexport(scope.row)">重新导出</el-button>
                    </template>
                    <template v-else>
                      <el-button v-if="scope.row.csvZipFileName" type="text" @click="download('csv_zip', scope.row)">下载数据</el-button>
                      <template v-if="checkPer(['units_export_img'])">
                        <el-button v-if="scope.row.imgZipFileName" type="text" @click="(download('img_zip', scope.row))">下载图片</el-button>
                        <el-button v-else-if="scope.row.state === 'finished' && scope.row.amount <= 1000" type="text" @click="img_generating(scope.row)">生成图片</el-button>
                      </template>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </lfl-table>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/units_exports.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import LflTable from '@/components/LflTable'
import units_exports from '@/api/units_exports'
import { downloadUrlFile } from '@/utils'
export default {
  components: {
    tab,
    pagination,
    LflTable
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '二维码生成', url: '/lmp/v2/admin/units_exports' })
  },

  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '二维码生成记录' }
    ])
    this.crud.refresh()
  },
  methods: {
    img_generating(data) {
      units_exports.img_generating({ id: data.id }).then(response => {
        this.crud.refresh()
      })
    },
    download(t, d) {
      units_exports.download(t, { id: d.id }).then(response => {
        downloadUrlFile(response.data, { csv_zip: 'csvZipFileName', img_zip: 'imgZipFileName' }[t])
      })
    },
    reexport(data) {
      units_exports.reexport({ id: data.id }).then(response => {
        this.crud.refresh()
      })
    }
  }
}
</script>
