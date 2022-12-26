<template>
  <div>
    <ul v-if="mode === 'edit'" class="function_button" :class="{disabled: limit <= _vm.attachmentList.length}">
      <li v-for="item in functionButton" :key="item.value" @click="handleFunc(item.value)">
        <i :class="item.icon" />
        <div>{{ item.name }}</div>
      </li>
    </ul>
    <div v-for="(item, index) in _vm.attachmentList" :key="index" class="assets-list">
      <div class="name">
        <i v-if="item.mediaType === 'link'" class="el-icon-link" />
        <i v-if="item.mediaType === 'image'" class="el-icon-picture-outline" />
        <i v-if="item.mediaType === 'file'" class="el-icon-document" />
        <i v-if="item.mediaType === 'video'" class="el-icon-video-play" />
        {{ item.mediaType === 'link' ? item.title : item.mediaFileName }}
      </div>
      <div v-if="mode === 'edit'" class="action">
        <i class="el-icon-delete" @click="removeAttachment(index)" />
      </div>
    </div>

    <el-dialog
      v-if="dialog.show"
      :visible.sync="dialog.show"
      :destroy-on-close="true"
    >
      <div slot="title" class="el-dialog__title">
        {{ (component.type === 'link') ? '' : '素材管理-' }} {{ component.text }}
      </div>
      <el-upload
        v-if="component.type !== 'link'"
        action="#"
        :http-request="uploadImage"
        :show-file-list="false"
        :accept="accept"
        :on-success="uploadSuccess"
      >
        <el-button type="primary" :loading="dialog.uploading">上传<i class="el-icon-upload el-icon--right" /></el-button>
      </el-upload>
      <component :is="component.name" v-if="component.type !== 'link'" ref="component" />
      <el-form v-else ref="form" :rules="rules" :model="form" size="small" label-width="16.6666%">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请填写标题" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" placeholder="请输入描述文字" :rows="3" />
        </el-form-item>
      </el-form>
      <div v-if="component.type === 'link'" slot="footer" class="dialog-footer">
        <el-button type="success" @click="submit">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import wework_media from '@/api/wework_assets'
import ImageList from './list/image.vue'
import VideoList from './list/video.vue'
import FileList from './list/file.vue'
export default {
  provide() {
    return {
      _c_vm: this
    }
  },
  inject: ['_vm'],
  components: {
    ImageList,
    VideoList,
    FileList
  },
  props: {
    functionButton: {
      type: Array,
      default: () => {
        return [
          { icon: 'el-icon-picture-outline', name: '图片', value: 'picture' },
          { icon: 'el-icon-video-play', name: '视频', value: 'video' },
          { icon: 'el-icon-document', name: '文件', value: 'file' },
          { icon: 'el-icon-link', name: '链接', value: 'link' }
        ]
      }
    },
    limit: {
      type: Number,
      default: () => {
        return 9
      }
    },
    mode: {
      type: String,
      default: () => {
        return 'edit'
      }
    }
  },

  data() {
    return {
      dialog: {
        show: false,
        uploading: false
      },
      accept: 'image/*',
      component: {
        name: null,
        type: null
      },
      form: {
        title: null,
        url: null,
        desc: null,
        mediaType: 'link'
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '链接不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleFunc(val) {
      if (this.limit <= this._vm.attachmentList.length) {
        return
      }
      if (val === 'picture') {
        this.component.name = 'ImageList'
        this.component.type = 'image'
        this.component.text = '图片'
        this.accept = 'image/*'
      }
      if (val === 'video') {
        this.component.name = 'VideoList'
        this.component.type = 'video'
        this.component.text = '视频'
        this.accept = 'video/mp4'
      }
      if (val === 'file') {
        this.component.name = 'FileList'
        this.component.type = 'file'
        this.component.text = '文件'
        this.accept = '.txt, .csv, .pdf, .ppt, .pptx, .xlsx, .xls, .doc, .docx'
      }
      if (val === 'link') {
        this.component.name = 'Link'
        this.component.type = 'link'
        this.component.text = '添加链接'
        this.accept = ''
      }
      this.dialog.show = true
    },
    uploadImage(params) {
      this.dialog.uploading = true
      const formData = new FormData()
      formData.append('file', params.file)
      let action = 'add'
      if (this.component.type !== 'image') {
        action = 'addMedia'
        formData.append('mediaType', this.component.type)
      }
      wework_media[action](formData).then(response => {
        this.uploadSuccess(response)
      }).catch(() => {
        this.dialog.uploading = false
      })
    },
    uploadSuccess() {
      this.dialog.uploading = false
      this.$refs.component.crud.refresh()
    },
    removeAttachment(index) {
      this._vm.attachmentList.splice(index, 1)
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.limit > this._vm.attachmentList.length) {
            const _form = Object.assign({}, this.form)
            this._vm.attachmentList.push(_form)
            this.dialog.show = false
          }
        } else {
          return false
        }
      })
    },
    editLink() {

    }
  }
}
</script>
<style lang="scss" scoped>
.function_button {
  display: flex;
  &.disabled{
    li {
      color: #b6babf;
      background: #f0f2f5;
      border-color: #dfe2e6;
      text-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
  li {
    width: 78px;
    height: 78px;
    border: 1px solid #e1e2e6;
    &+li {
      margin-left: -1px;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    i {
      font-size: 20px;
    }
    div {
      margin-top: 5px;
      line-height: 1;
    }
  }
}
.el-dialog__title {
  display: flex;
}
.assets-list {
  background-color: rgb(245, 247, 250);
  align-items: center;
  border-radius: 2px;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  padding: 6px 12px;
  width: 100%;
  margin-top: 12px;
  justify-content: space-between;
  .name {
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
    white-space: nowrap;
    i {
      margin-right: 5px;
    }
  }
  .action {
    display: inline-block;
    i {
      cursor: pointer;
      margin: 0px 5px;
    }
  }
}
</style>
