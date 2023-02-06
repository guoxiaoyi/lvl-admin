<template>
  <div>
    <div class="list-wrap">
      <div v-for="(file, index) in crud.data" :key="index" class="item" @click="setAttachment(file)">
        <div class="file">
          <div class="type"> {{ file.mediaContentType | fileType }} </div>
        </div>
        <div class="name">
          {{ file.mediaFileName }}
          <span> {{ file.mediaFileSize | sizeTostr }} </span>
        </div>
      </div>
    </div>
    <div class="lifanli-pagination">
      <el-pagination
        :page-sizes="[12]"
        :page-size="12"
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
    },
    sizeTostr(size) {
      var data = ''
      if (size < 0.1 * 1024) { // 如果小于0.1KB转化成B
        data = size.toFixed(2) + 'B'
      } else if (size < 0.1 * 1024 * 1024) { // 如果小于0.1MB转化成KB
        data = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 0.1 * 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
        data = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else { // 其他转化成GB
        data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      var sizestr = data + ''
      var len = sizestr.indexOf('\.')
      var dec = sizestr.substr(len + 1, 2)
      if (dec === '00') { // 当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
      }
      return sizestr
    }
  },
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '素材管理', url: '/lmp/admin/api/wework_media', size: 12, params: { mediaType: 'file' }})
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
  margin-bottom: 15px;
  .item {
    width: 230px;
    // height: 70px;
    float: left;
    box-sizing: border-box;
    padding: 10px;
    margin: 5px;
    display: flex;
    align-items: center;
    border: 1px solid #e4e4e4;
    .file {
      width: 46px;
      height: 60px;
      background: url('~@/assets/wework/file.png');
      position: relative;

      .type {
        height: 18px;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        line-height: 18px;
        background: #6CCBFF;
        color: #FFF;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .name {
      display: flex;
      align-items: baseline;
      height: 100%;
      flex: 1;
      line-height: 1.2;
      padding: 2px 8px;
      flex-direction: column;
      justify-content: space-between;
      span {color: #a7a7a7;}
    }
  }
}
::v-deep {
  .el-pagination__total {
    margin-right: 0;
    margin-left: 10px;
  }
  .el-image {
    display: block;
  }
}
</style>
