<template>
  <div>
    <div class="list-wrap">
      <div v-for="(video, index) in crud.data" :key="index" class="item">
        <div class="dialog-image-item">
          <el-image :src="video.imageUrl" class="context" fit="cover" @click="setAttachment(video)" />
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
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '素材管理', url: '/lmp/admin/api/wework_media', params: { mediaType: 'video' }})
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    setAttachment(data) {
      if (this._c_vm.limit > this._vm.attachmentList.length) {
        const _data = data
        _data.thum = data.imageUrl

        this._vm.attachmentList.push(_data)
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
    width: 12.5%;
    float: left;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
  }
}
::v-deep {
  .el-pagination__total {
    margin-right: 0;
    margin-left: 10px;
  }
}
</style>
