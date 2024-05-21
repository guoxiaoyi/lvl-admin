<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript:void(0)"> 渠道公告 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="pushKindsName" label="渠道类型">
              <template slot-scope="scope">
                {{ scope.row.pushKindsName.join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="pushRangeName" label="推送范围">
              <template slot-scope="scope">
                {{ scope.row.pushRangeName.map(i => i.name ).join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="240px" />
            <el-table-column prop="id" label="操作" width="140px">
              <template slot-scope="scope">
                <el-button type="text" @click="handlerPreview(scope.row)">预览</el-button>
                <el-button v-if="checkPer(['channel_push_message'])" type="text" @click="$router.push({ name: 'ChannelNoticeEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button v-if="checkPer(['channel_push_message'])" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="preview.show"
      class="preview"
      width="520px"
    >
      <div class="flex">
        <div class="phone-frame">
          <div class="phone-content">
            <div class="title">{{ preview.data.title }}</div>
            <p class="time">{{ preview.data.createdAt }}</p>
            <div v-html="preview.data.content" />
          </div>
          <div class="phone-home-btn" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import push_message from '@/api/push_message.js'
export default {
  components: { pagination },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '渠道公告', url: '/lmp/v2/admin/push_message', crudMethod: { ...push_message }})
  },
  data() {
    return {
      preview: {
        show: false,
        data: {}
      }
    }
  },
  mounted() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道公告' }])
  },
  methods: {
    handlerPreview(data) {
      this.preview.show = true
      this.preview.data = data
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .preview {
    .el-dialog__header {
      border-bottom: none;
      .el-dialog__headerbtn .el-dialog__close {
        font-size: 30px;
        font-weight: bold;
        color: #FFF;
      }
    }
    .el-dialog__body {max-height: 100vh; overflow: hidden;}
    .el-dialog {
      margin-top: 10px !important;
      background: transparent;
      box-shadow: none;
    }
  }
}
.phone-frame {
  height: 750px;
}
.phone-content {
  border: 1px solid #ececec;
  height: 580px;
  padding: 15px;
  overflow-y: auto;
  .title {
    font-size: 16px;
  }
  p {
    font-size: 12px;
    margin: 0;
    color: #969799;
    border-bottom: 1px solid #ebedf0;
    padding-bottom: 10px;
    padding-top: 5px;
  }
  ::v-deep {
    img {
      max-width: 100%;
    }
  }
}
</style>
