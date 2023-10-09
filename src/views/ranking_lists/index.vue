<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          排行榜列表
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form>
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
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="标题" prop="title" />
            <el-table-column label="指标" prop="orderTypeDesc" />
            <el-table-column label="时间" prop="timeRangeDesc" />
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
                <el-button v-if="checkPer(['micro_page_manage'])" type="text" @click="$router.push({ name: 'RankingListEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button v-if="checkPer(['micro_page_manage'])" type="text" @click="copy(scope.row)">复制</el-button>
                <el-button v-if="checkPer(['micro_page_manage'])" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
      :visible.sync="modal.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame">
          <iframe id="previewer" :src="modal.url+'/demo'" />
        </div>
        <div class="home_page_edit">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>排行榜链接</h4>
              <div v-if="!modal.data.published">
                当前排行榜未发布，发布后可复制链接并查看二维码。
              </div>
              <div v-else>
                <el-input ref="copyUrl" v-model="modal.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                <el-input v-model="modal.url" :disabled="true">
                  <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr ref="Qrcode" :text="modal.url" class="img-thumbnail" :size="150" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ranking_list from '@/api/ranking_lists'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'

export default {
  components: {
    pagination,
    VueQr
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '排行榜列表', url: '/lmp/v2/admin/ranking_list', sort: ['updatedAt,desc'], crudMethod: { ...ranking_list }})
  },
  data() {
    return {
      modal: {
        preview: false,
        url: '',
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '排行榜列表' }])
    this.crud.refresh()
  },
  methods: {
    preview(data) {
      this.modal.data = data
      this.modal.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/ranking_lists/${data.id}`
      this.modal.preview = true
    },
    copy(data) {
      this.$router.push({ name: 'RankingListDup', params: { id: data.id }})
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
