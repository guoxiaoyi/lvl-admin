<template>
  <div class="app-container">
    <div v-if="detail.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，<router-link v-if="detail.id" :to="{ name: 'ActivityShow', params: {activityId: detail.id }}">点击返回主活动</router-link>
    </div>
    <Tab :activity="detail" />
    <div class="panel panel-default">
      <div class="panel-body">
        <Step v-if="detail.state === 'pending'" :active="3" :activity="detail" />
        <el-row>
          <el-col :span="10">
            <div class="phone-frame" style="margin: 0 auto;">
              <iframe id="previewer" :src="previewUrl" />
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="panel panel-default">
              <div class="panel-heading flex justify-content__space-between items-center">
                <PageEditTitle :page="page" />
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="页面样式">
                    <el-radio-group v-model="form.type">
                      <el-radio label="default">默认</el-radio>
                      <el-radio label="custom">自定义</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="页面名称">
                    <el-input v-model="form.title" />
                  </el-form-item>
                  <el-form-item label="横幅图">
                    <el-upload
                      action="#"
                      accept="image/*"
                      :data="{column: 'bannerImage'}"
                      :show-file-list="false"
                      :http-request="uploadFile"
                    >
                      <el-button :loading="bannerLoading" type="success" size="medium">上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="背景图">
                    <el-upload
                      action="#"
                      accept="image/*"
                      :data="{column: 'bgImage'}"
                      :show-file-list="false"
                      :http-request="uploadFile"
                    >
                      <el-button :loading="bgLoading" type="success" size="medium">上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="自定义按钮">
                    <div v-for="(item, index) in form.extraJson" :key="index" class="child-form">
                      <el-form-item label="显示样式">
                        <el-radio-group v-model="item.span">
                          <el-radio label="24">一行一个</el-radio>
                          <el-radio label="12">一行两个</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="上间距">
                        <el-slider v-model="item.margin[0]" show-input />
                      </el-form-item>
                      <el-form-item label="页面边距">
                        <el-slider v-model="item.padding[0]" show-input />
                      </el-form-item>
                      <el-form-item label="间隔">
                        <el-slider v-model="item.gutter" show-input />
                      </el-form-item>
                      <el-form-item v-for="(button, _index) in item.items" :key="_index">
                        {{ button }}
                      </el-form-item>
                      <el-button type="success" size="medium" @click="addButton(index)">新增</el-button>
                    </div>
                    <el-button type="success" @click="addGroup">增加组</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import activities_page from '@/api/activities_page'
import amazon from '@/api/amazon'
import Tab from '@/components/Tabs/activity.vue'
import PageEditTitle from './components/edit_page/index.vue'
import Step from './components/step.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    Tab,
    Step,
    PageEditTitle
  },
  data() {
    return {
      status: 0,
      detail: {
        userTags: [],
        page: { }
      },
      page: { },
      previewUrl: '',
      rules: {
      },
      loading: false,
      form: {
        type: 'custom',
        title: null,
        bannerImageId: null,
        bgImageId: null,
        extraJson: []
      },
      uploading: false,
      bannerLoading: false,
      bgLoading: false
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData'])
  },
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.state === 'pending' ? '设置活动页面' : this.activityData.title }
    ])
    this.fetch()
  },
  mounted() {

  },
  methods: {
    async fetch() {
      this.detail = this.activityData
      this.previewUrl = this.mobilePreviewUrl(this.activityData.mobilePreviewUrl)
      await activities_page.get({ id: this.$route.params.activityId }).then(({ data }) => {
        this.page = data
      })
    },
    uploadFile(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(123456)
        }
      })
    },
    mobilePreviewUrl(url) {
      if (Object.keys(url).length) {
        if (!url.includes('mobile/v2')) {
          return url.replace(/mobile/, 'mobile/v2')
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    addGroup() {
      this.form.extraJson.push({
        type: 'buttons',
        span: null,
        margin: [10],
        padding: [0],
        gutter: 0,
        items: [
          { type: null, link: null, pictureId: null, pictureUrl: null }
        ]
      })
    },
    addButton(index) {
      this.form.extraJson[index]['items'].push({ type: null, link: null, pictureId: null, pictureUrl: null })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item__content {
    width: auto;
  }
  .el-image {
    display: block;
  }
}
.thumbnail {
  position: relative;
  display: block;
  padding: 4px;
  margin-bottom: 20px;
  line-height: 1.428571429;
  background-color: #FBFBFB;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.2s ease-in-out;
  width: 100px;
  img {
    vertical-align: middle;
  }
}
.fa-lg {
  font-size: 1.33333333em;
  line-height: 0.75em;
  vertical-align: -15%;
  cursor: pointer;
}
.video-del {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #da120e;
}
.page-image-thumbnail-small {
  max-width: 60px;
  max-height: 30px;
}
</style>
