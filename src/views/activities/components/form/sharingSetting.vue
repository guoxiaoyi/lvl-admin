<template>
  <div>
    <h5>分享设置</h5>
    <hr>
    <el-form-item label="分享标题" prop="sharingTitle">
      <el-input v-model="form.sharingTitle" />
      <p class="help-block">设置分享标题</p>
    </el-form-item>
    <el-form-item label="分享描述">
      <el-input v-model="form.sharingDesc" />
      <p class="help-block">分享描述</p>
    </el-form-item>
    <el-form-item label="分享链接" prop="sharingLink">
      <el-input v-model="form.sharingLink" />
      <p class="help-block">设置分享有效的链接（链接格式如: http://www.lifanli.cn）</p>
    </el-form-item>
    <el-form-item label="分享图片" prop="sharingImgId">
      <el-image
        v-if="form.sharingImgUrl"
        class="img-thumbnail activity-thumbnail-middle"
        fit="cover"
        :src="form.sharingImgUrl"
        :preview-src-list="[form.sharingImgUrl]"
        style="width: 120px"
      />
      <el-upload
        action="#"
        accept="image/*"
        :data="{column: 'sharingImg'}"
        :show-file-list="false"
        :http-request="upload"
      >
        <el-button :loading="uploading" type="success" size="medium">上传</el-button>
      </el-upload>
      <p class="help-block">设置分享图片，尺寸：320 x 320px，格式：png，jpg</p>
    </el-form-item>
  </div>
</template>

<script>
import amazon from '@/api/amazon'
export default {
  props: {
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    },
    form: {
      type: Object,
      default: () => {
        return {
          sharingTitle: null
        }
      }
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
        console.log(this.form)
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    }
  }
}
</script>

<style>

</style>
