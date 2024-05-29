<template>
  <div>
    <div class="list-wrap">
      <div v-for="(image, index) in crud.data" :key="index" class="item">
        <el-image :src="image.s3Url" class="_image" fit="cover" @click="setAttachment(image)" />
        <div class="name">{{ image.mediaFileName }}</div>
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
    return CRUD({ title: '素材管理', url: '/lmp/v2/admin/wework_media', params: { mediaType: 'image' }})
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    setAttachment(data) {
      if (this._c_vm.limit > this._vm.attachmentList.length) {
        const _data = data
        _data.thum = data.s3Url
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
    width: 120px;
    float: left;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    ._image {
      width: 110px;
      height: 110px;
    }
    .name {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 5px;
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
