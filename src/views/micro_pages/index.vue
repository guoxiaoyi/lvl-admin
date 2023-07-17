<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          微页面列表
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.title" placeholder="标题" />
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
            <el-table-column label="标题" prop="title" />
            <el-table-column label="浏览次数" prop="viewCount" />
            <el-table-column label="更新时间" prop="updatedAt" />
            <el-table-column label="发布状态" prop="published">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.published" type="success">已发布</el-tag>
                <el-tag v-else type="warning">未发布</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="preview(scope.row)">预览</el-button>
                <el-button type="text" @click="$router.push({ name: 'MicroPageEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button type="text" @click="copy(scope.row)">复制</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      width="880px"
      title="预览"
      append-to-body
      :visible.sync="micro_page.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame">
          <iframe id="previewer" :src="micro_page.url" />
        </div>
        <div class="home_page_edit">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>微页面链接</h4>
              <el-input ref="copyUrl" v-model="micro_page.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
              <el-input v-model="micro_page.url" :disabled="true">
                <el-button slot="append" @click="copyClicked">复制</el-button>
              </el-input>
              <p style="margin-top: 20px;">
                <VueQr ref="Qrcode" :text="micro_page.url" class="img-thumbnail" :size="150" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import micro_page from '@/api/micro_page'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import VueQr from 'vue-qr'

export default {
  components: {
    pagination,
    VueQr
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', sort: ['updatedAt,desc'], crudMethod: { ...micro_page }})
  },
  data() {
    return {
      micro_page: {
        preview: false,
        url: ''
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '微页面列表' }])
    this.crud.refresh()
  },
  methods: {
    preview(data) {
      // window.open = `https://admin.${process.env.VUE_APP_BASE_DOMAIN}/admin/micro_pages/${data.id}/mobile_demo`
      // this.micro_page.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/micro_pages/${data.id}/demo`
      this.micro_page.preview = true
      micro_page.show(data).then(response => {
        console.log(response)
      })
    },
    copy() {},
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: center;
  .home_page_edit {
    width: 400px;
    margin-left: 20px;
    .well {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
      padding: 19px;
      margin-bottom: 0px;
      background-color: #F5F5F5;
      border: 1px solid #ededed;
      border-radius: 4px;
    }
  }
}
</style>
