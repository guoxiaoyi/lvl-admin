<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      :before-close="handlerClose"
      width="930px"
      title="选择视频"
      top="10vh"
    >
      <div slot="title" class="images-dialog-title">
        选择视频
        <el-upload
          action="#"
          :http-request="uploadGlobalImage"
          :show-file-list="false"
          accept="video/*"
          :on-success="uploadSuccess"
          :before-upload="beforeImageUpload"
        >
          <el-button type="primary" :loading="uploading">上传<i class="el-icon-upload el-icon--right" /></el-button>
        </el-upload>
      </div>
      <div class="list-wrap">
        <div v-for="(image, index) in crud.data" :key="index" class="item">
          <div class="dialog-image-item" :style="{ backgroundImage:'url('+image.imgUrl+')'}">
            <div class="context" @click="handleSubmit(image)" />
            <div class="el-icon-error del" @click="crud.doDelete(image)" />
          </div>
        </div>
      </div>
      <pagination :size="18" />
    </el-dialog>
  </div>
</template>

<script>
import crudMethod, { postGlobalVideo } from '@/api/globalVideo'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/DialogPagination'

export default {
  components: {
    pagination
  },
  cruds() {
    return CRUD({ title: '素材库', url: '/lmp/v2/admin/video', size: 24, crudMethod: { ...crudMethod }})
  },
  mixins: [presenter(), header(), crud()],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  mounted() {
    if (this.checkPer(['video_manage'])) {
      this.crud.refresh()
    }
  },
  methods: {
    handlerClose() {
      this.$emit('update:show', false)
    },
    uploadGlobalImage(params) {
      this.uploading = true
      const formData = new FormData()
      formData.append('file', params.file)
      postGlobalVideo(formData).then(response => {
        this.uploadSuccess(response)
      }).catch(() => {
        this.uploading = false
      })
    },
    async uploadSuccess(response, file, fileList) {
      await this.crud.toQuery()
      this.uploading = false
    },
    handleSubmit(current) {
      this.handlerClose()
      this.$emit('selectChange', current)
    },
    beforeImageUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('视频大小不能超过 10MB!')
      }
      this.uploading = false
      return isLt10M
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
  margin-left: -10px;
  margin-right: -10px;
  flex-flow: row wrap;
  padding-top: 15px;
  padding-bottom: 15px;
  .item {
    width: 12.5%;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
  }
}
.dialog-image-item {
  margin-bottom: 15px;
}
</style>
