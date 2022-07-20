<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" :size="btnSize" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :destroy-on-close="true">
      <div slot="title" class="images-dialog-title">
        图片列表
        <el-upload 
          action="#" 
          :http-request="uploadGlobalImage" 
          :show-file-list="false"
          :on-success="uploadSuccess"
        >
          <el-button type="primary" size="mini">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </div>
      <el-row type="flex" :gutter="10" justify="start" style="flex-wrap: wrap; flex-direction: row;">
        <el-col :span="3" v-for="(image, index) in globalImageList" :key="index">
          <div 
            class="dialog-image-item" :style="{backgroundImage:'url('+image.url+')'}" 
            :data-compressUrl="JSON.stringify(image.compressUrl)"
            :data-url="image.url"
            :data-id="image.id"
            @click="handleSubmit(image)"
          />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getGlobalImage, postGlobalImage } from '@/api/globalImage'

export default {
  name: 'CustomUploadImage',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    btnSize: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {
      dialogVisible: false,
      globalImageList: []
    }
  },
  watch: {
    dialogVisible() {
      if(this.dialogVisible) {
        getGlobalImage().then(response => {
          this.globalImageList = response.content
        })
      }
    }
  },
  methods: {
    uploadGlobalImage(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      postGlobalImage(formData).then(response => {
        this.uploadSuccess(response)
      })
    },
    uploadSuccess(response, file, fileList) {
      this.globalImageList.push(response)
    },
    handleSubmit(current) {
      this.dialogVisible = false
      this.$emit('successCBK', current)
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
</style>
