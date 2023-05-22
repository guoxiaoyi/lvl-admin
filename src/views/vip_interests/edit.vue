<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 添加权益 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="权益图标">
            <el-image style="width: 100px; height: 100px" :src="pictureUrl" fit="cover" class="img-thumbnail">
              <div slot="error" class="image-slot">
                <el-image style="width: 90px; height: 90px" :src="require('@/assets/image_missing.png')" fit="cover" />
              </div>
            </el-image>
            <el-upload
              action="#"
              accept="image/*"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
              :before-upload="beforeImageUpload"
            >
              <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
            </el-upload>
            <div class="help-block">尺寸：100x100px，格式：png，jpg，gif</div>
          </el-form-item>
          <el-form-item label="权益名称" prop="label">
            <el-input v-model="form.label" />
          </el-form-item>
          <el-form-item label="权益说明" prop="description">
            <el-input v-model="form.description" type="textarea" rows="6" />
          </el-form-item>
          <hr>
          <el-button :loading="submitting" size="small" type="success" @click="submit"> 保存 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import vip_interest from '@/api/vip_interests'
import amazon from '@/api/amazon'

export default {
  data() {
    return {
      pictureUrl: null,
      rules: {
        label: [
          { required: true, message: `权益名称不能为空`, trigger: 'blur' }
        ],
        description: [
          { required: true, message: `权益说明不能为空`, trigger: 'blur' }
        ]
      },
      form: {
        label: null,
        description: null,
        pictureId: null
      },
      submitting: false,
      uploading: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员权益', path: { name: 'VipInterestIndex' }},
      { title: `${this.$route.name === 'VipInterestNew' ? '编辑' : '添加'}权益` }
    ])
    if (this.$route.name === 'VipInterestEdit') {
      vip_interest.get(this.$route.params).then(response => {
        this.form.id = response.data.id
        this.form.label = response.data.label
        this.form.description = response.data.description
        this.form.pictureId = response.data.pictureId
        this.pictureUrl = response.data.pictureUrl
      })
    }
  },
  methods: {
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.pictureId = response.data.id
        this.pictureUrl = response.data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    submit() {
      const action = this.$route.name === 'VipInterestEdit' ? 'edit' : 'add'
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          vip_interest[action](this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'VipInterestIndex' })
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },

    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('权益图标大小不能超过 2MB!')
      }
      this.uploading = false
      return isLt2M
    }
  }
}
</script>

<style>

</style>
