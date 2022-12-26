<template>
  <div>
    <div class="list-wrap">
      <div v-for="(file, index) in crud.data" :key="index" class="item">
        <div class="dialog-image-item">
          <div class="file" @click="setAttachment(file)">
            <div class="name"> {{ file.mediaContentType | fileType }} </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lifanli-pagination">
      <el-pagination
        :page-sizes="[24]"
        :page-size="24"
        :total="page.total"
        :current-page.sync="page.page"
        layout="prev, pager, next, total"
        background
        @size-change="crud.sizeChangeHandler($event)"
        @current-change="crud.pageChangeHandler"
      />
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import { pagination } from '@crud/crud'

export default {
  inject: ['_vm', '_c_vm'],
  filters: {
    fileType(file) {
      return file.split('/')[1]
    }
  },
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '素材管理', url: '/lmp/admin/api/wework_media', params: { mediaType: 'file' }})
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    setAttachment(data) {
      if (this._c_vm.limit > this._vm.attachmentList.length) {
        this._vm.attachmentList.push(data)
      }
      this._c_vm.dialog.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
.list-wrap {
  display: flex;
  margin-left: -5px;
  margin-right: -5px;
  flex-flow: row wrap;
  .item {
    width: 8%;
    float: left;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    .dialog-image-item {
      padding-top: 0;
    }
  }
  .file {
    width: 46px;
    height: 60px;
    background: url('~@/assets/wework/file.png');
    margin: 0 auto;
    position: relative;
    div.name {
      height: 18px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 18px;
      background: #6CCBFF;
      color: #FFF;
    }
  }
}
::v-deep {
  .el-pagination__total {
    margin-right: 0;
    margin-left: 10px;
  }
}
</style>
