<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li><router-link :to="{ name: 'InviteRewardsSetting' }">邀请有礼设置</router-link></li>
      <li class="active"><router-link :to="{ name: 'InviteRewardsPoster' }">推广海报</router-link></li>
    </ul>
    <div class="panel panel-default">
      <div class="flex" style="margin: 40px 0;">
        <div class="phone-frame" style="margin: 0 auto;">
          <!-- <iframe id="previewer" :src="registerInfo.mobilePreviewUrl" /> -->
          <div class="phone-home-btn" />
        </div>
        <div class="form_wraper">
          <div class="panel panel-default">
            <div class="panel-heading">海报设置</div>
            <div class="panel-body">
              <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                <el-form-item label="头像">
                  <el-radio-group v-model="form.showAvatar">
                    <el-radio :label="true">显示</el-radio>
                    <el-radio :label="false">隐藏</el-radio>
                  </el-radio-group>
                  <p class="help-block">可设置显示或隐藏邀请人头像 </p>
                </el-form-item>
                <el-form-item label="推广海报">
                  <el-image style="width: 100px; height: 100px" :src="pictureUrl" fit="cover" class="img-thumbnail">
                    <div slot="error" class="image-slot">
                      <el-image style="width: 90px; height: 90px" :src="require('@/assets/image_missing.png')" fit="cover" />
                    </div>
                  </el-image>
                  <el-upload
                    action="#"
                    accept=".png"
                    :show-file-list="false"
                    :http-request="listenUploadImageLimit"
                    :before-upload="beforeImageUpload"
                  >
                    <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
                  </el-upload>
                  <p class="help-block">图片不能超过2M，尺寸：1000 x 1500px，格式：png</p>
                </el-form-item>
                <el-form-item label="海报文字">
                  <el-input v-model="form.posterTitle" show-word-limit :maxlength="20" />
                  <p class="help-block">海报文字，最多20个字符</p>
                </el-form-item>
                <hr>
                <el-button type="success" :loading="loading" @click="submit">保存</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amazon from '@/api/amazon'
import invite_rewards from '@/api/invite_rewards'
export default {
  data() {
    return {
      form: {
        showAvatar: true,
        posterTitle: null,
        posterPictureId: null
      },
      rules: {},
      uploading: false,
      pictureUrl: null,
      loading: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼设置' }])
    invite_rewards.getSetting({}).then(({ data }) => {
      this.form.showAvatar = data.showAvatar
      this.pictureUrl = data.posterImgUrl
      this.form.posterTitle = data.posterTitle
      this.form.posterPictureId = null
    })
  },
  methods: {
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('邀请图片大小不能超过 1MB!')
      }
      this.uploading = false
      return isLt2M
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.posterPictureId = response.data.id
        this.pictureUrl = response.data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    submit() {
      this.loading = true
      invite_rewards.poster(this.form).then(({ data }) => {
        console.log(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.form_wraper {
  width: 45vw;
}

</style>
