<template>
  <div class="upload-container">
    <el-button :style="{background: color, borderColor: color}" icon="el-icon-upload" :size="btnSize" type="success" @click="dialogVisible = true">
      添加图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body :destroy-on-close="true">
      <div slot="title" class="images-dialog-title">
        图片列表
        <el-upload
          action="#"
          :http-request="uploadGlobalImage"
          :show-file-list="false"
          accept="image/*"
          :on-success="uploadSuccess"
        >
          <el-button type="primary" size="mini" :loading="uploading">上传<i class="el-icon-upload el-icon--right" /></el-button>
        </el-upload>
      </div>
      <div class="list-wrap">
        <div v-for="(image, index) in crud.data" :key="index" class="item">
          <div
            class="dialog-image-item"
            :style="{ backgroundImage:'url('+image.url+')'}"
          >
            <div
              :data-compressUrl="JSON.stringify(image.compressUrl)"
              :data-url="image.url"
              :data-id="image.id"
              class="context"
              @click="handleSubmit(image)"
            />
            <div class="el-icon-error del" @click="crud.doDelete(image)" />
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
    </el-dialog>
  </div>
</template>

<script>
import crudMethod, { postGlobalImage } from '@/api/globalImage'
import CRUD, { presenter, crud, header } from '@crud/crud'
import { pagination } from '@crud/crud'

export default {
  name: 'CustomUploadImage',
  cruds() {
    return CRUD({ title: '素材库', url: '/lmp/admin/api/image', size: 24, crudMethod: { ...crudMethod }})
  },
  mixins: [presenter(), header(), crud(), pagination()],
  props: {
    color: {
      type: String,
      default: '#5cb85c'
    },
    btnSize: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {
      dialogVisible: false,
      globalImageList: [],
      uploading: false
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.crud.refresh()
      }
    }
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    uploadGlobalImage(params) {
      this.uploading = true
      const formData = new FormData()
      formData.append('file', params.file)
      postGlobalImage(formData).then(response => {
        this.uploadSuccess(response)
      }).catch(() => {
        this.uploading = false
      })
    },
    async uploadSuccess(response, file, fileList) {
      await this.crud.refresh()
      this.uploading = false
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
