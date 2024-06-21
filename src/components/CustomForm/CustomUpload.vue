<template>
  <el-form-item :label="label" :prop="name">
    <img v-if="!value.pictureUrl" :src="require('@/assets/image_missing.png')" class="img-thumbnail">
    <el-image
      v-else
      :src="value.pictureUrl"
      class="img-thumbnail"
      :preview-src-list="[value.pictureUrl]"
      fit="cover"
    />
    <el-upload
      action="#"
      accept="image/*"
      :show-file-list="false"
      :http-request="uploadFile"
    >
      <el-button :loading="loading" type="success" size="medium">上传</el-button>
    </el-upload>
    <p class="help-block">{{ placeholder }}</p>
  </el-form-item>
</template>

<script>
import amazon from '@/api/amazon'
export default {
  name: 'CustomUpload',
  props: {
    value: {
      type: Object,
      default: () => { return {} }
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    beforeUpload(params) {
      const result = params.file.size / 1024 / 1024 < 2
      const text = '大小不能超过 2MB!'
      if (!result) {
        this.$message.error(text)
      }
      return result
    },
    uploadFile(params) {
      if (!this.beforeUpload(params)) {
        return
      }
      const formData = new FormData()
      formData.append('file', params.file)
      this.loading = true
      amazon.tmp(formData).then(({ data }) => {
        this.loading = false
        this.value.pictureId = data.id
        this.value.pictureUrl = data.imageUrl
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.img-thumbnail {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
