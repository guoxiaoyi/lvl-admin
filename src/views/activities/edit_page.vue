<template>
  <div class="app-container">
    <div v-if="detail.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，<router-link v-if="detail.parentId" :to="{ name: 'ActivityShow', params: {activityId: detail.parentId }}">点击返回主活动</router-link>
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
              <div class="panel-heading">
                <PageEditTitle :page="page" />
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="24%" :rules="rules" :model="form">
                  <el-form-item :ref="var2LowerCase('navbar_hidden')" :label="$t('page.navbar_hidden')" prop="navbar_hidden">
                    <el-switch v-model="form.navbar_hidden" />
                  </el-form-item>
                  <el-form-item v-if="detail.type !== 'AntiFakeActivity'" :ref="var2LowerCase('activity_desc_show_enabled')" :label="$t('page.activity_desc_show_enabled')" prop="activity_desc_show_enabled">
                    <el-switch v-model="form.activity_desc_show_enabled" />
                  </el-form-item>
                  <template v-if="page[var2LowerCase('has_banner')]">
                    <template v-if="detail[var2LowerCase('award_enabled')]">
                      <el-form-item :ref="var2LowerCase('award_record_enabled')" :label="$t('page.award_record_enabled')" prop="award_record_enabled">
                        <el-switch v-model="form.award_record_enabled" />
                        <p class="help-block">开启后，在活动页面滚动显示中奖消息（中奖数据仅为展示活动效果，非真实数据）</p>
                      </el-form-item>
                      <el-form-item v-if="form.award_record_enabled" :ref="var2LowerCase('award_record_mode')" :label="$t('page.award_record_mode')" prop="award_record_mode">
                        <el-radio-group v-model="form.award_record_mode">
                          <el-radio label="danmu">{{ $t('page.attrbutes.award_record_mode.danmu') }}</el-radio>
                          <el-radio label="marquee">{{ $t('page.attrbutes.award_record_mode.marquee') }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </template>
                    <el-form-item :ref="var2LowerCase('banner_hidden')" :label="$t('page.banner_hidden')" prop="banner_hidden">
                      <el-switch v-model="form.banner_hidden" />
                    </el-form-item>
                    <template v-if="!form.banner_hidden">
                      <el-form-item :ref="var2LowerCase('banner_type')" :label="$t('page.banner_type')" prop="banner_type">
                        <el-radio-group v-model="form.banner_type">
                          <el-radio label="img">{{ $t('page.attrbutes.banner_type.img') }}</el-radio>
                          <el-radio v-if="checkPer(['video_manage'])" label="video_file">{{ $t('page.attrbutes.banner_type.video_file') }}</el-radio>
                          <el-radio label="video_code">{{ $t('page.attrbutes.banner_type.video_code') }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item v-if="checkPer(['video_manage']) && form.banner_type === 'video_file'" :ref="var2LowerCase('video_id')" prop="video_id">
                        <div v-if="form.video_img_url" class="video-item">
                          <div class="thumbnail">
                            <el-image :src="form.video_img_url" />
                            <div class="video-del" @click="form.video_id = null; form.video_img_url = null">
                              <i class="fa fa-times-circle fa-lg" />
                            </div>
                          </div>
                        </div>
                        <el-button type="success" @click="videoDialog = true"><i class="fa fa-plus" /> 添加视频</el-button>
                        <p class="help-block">视频不能超过10M，格式：MP4</p>
                      </el-form-item>
                      <el-form-item v-if="form.banner_type === 'video_code'" :ref="var2LowerCase('video_code')" :label="$t('page.video_code')" prop="video_code">
                        <el-input v-model="form.video_code" type="textarea" :rows="5" />
                        <p class="help-block">将视频上传至其他视频网站后（推荐哔哩哔哩），打开视频找到左下角分享，复制嵌入代码，粘贴到此处即可。</p>
                      </el-form-item>
                      <el-form-item v-if="form.banner_type === 'img'" :ref="var2LowerCase('banner')" :label="$t('page.banner')" prop="banner">
                        <table style="width: 320px;">
                          <tbody>
                            <tr>
                              <td>
                                <ActivityBanner :item="{ pageBannerUrl: form.banner_url, pageBannerDefault: form.banner_default }" :custom-style="{ width: '160px' }" :custom-class="['img-thumbnail']" />
                                <el-upload
                                  action="#"
                                  accept="image/*"
                                  :data="{column: 'banner'}"
                                  :show-file-list="false"
                                  :http-request="uploadFile"
                                >
                                  <el-button :loading="bannerLoading" type="success" size="medium">上传</el-button>
                                </el-upload>
                              </td>
                              <td class="text-center">
                                <!-- <a data-confirm="确定吗?" rel="nofollow" data-method="patch" href="/admin/activities/1353/reset_banner"></a> -->
                                <el-button type="text" @click="reset('reset_banner')"><i class="fa fa-refresh" /> 还原</el-button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p class="help-block">图片不能超过2M，格式：png，jpg，gif</p>
                      </el-form-item>
                    </template>
                  </template>
                  <el-form-item :ref="var2LowerCase('bg_img')" :label="$t('page.bg_img')" prop="bg_img">
                    <table style="width: 320px;">
                      <tbody>
                        <tr>
                          <td style="width: 240px;">
                            <img v-if="form.bg_img_url" :src="form.bg_img_url" class="img-thumbnail" style="width: 160px">
                            <el-upload
                              action="#"
                              accept="image/*"
                              :data="{column: 'bg_img'}"
                              :show-file-list="false"
                              :http-request="uploadFile"
                            >
                              <el-button :loading="bgImgLoading" type="success" size="medium">上传</el-button>
                            </el-upload>

                          </td>
                          <td class="text-center">
                            <!-- <a data-confirm="确定吗?" rel="nofollow" data-method="patch" href="/admin/activities/1353/reset_banner"></a> -->
                            <el-button type="text" @click="reset('reset_bg_img')"><i class="fa fa-trash-o" /> 还原</el-button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p class="help-block">图片不能超过2M，尺寸：750 x 1200px，格式：png，jpg，gif</p>
                  </el-form-item>
                  <el-form-item :ref="var2LowerCase('music')" :label="$t('page.music')" prop="music">
                    <table style="width: 320px;">
                      <tbody>
                        <tr>
                          <td>
                            <audio v-if="form.music_url" :src="form.music_url" controls="controls" style="width: 230px" />
                            <el-upload
                              action="#"
                              accept="audio/*"
                              :data="{column: 'music'}"
                              :show-file-list="false"
                              :http-request="uploadFile"
                            >
                              <el-button :loading="musicLoading" type="success" size="medium">上传</el-button>
                            </el-upload>
                          </td>
                          <td class="text-center">
                            <el-button v-if="form.music_url" type="text" @click="reset('reset_music')"><i class="fa fa-trash-o" /> 删除</el-button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p class="help-block">文件不能超过1M，格式：MP3</p>
                  </el-form-item>
                  <el-form-item :ref="var2LowerCase('bg_color')" :label="$t('page.bg_color')" prop="bg_color">
                    <div class="flex">
                      <div style="width: 258px;">
                        <el-color-picker v-model="form.bg_color" />
                      </div>
                      <el-button type="text" @click="form.bg_color = form.default_bg_color"><i class="fa fa-refresh" /> 还原</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item :ref="var2LowerCase('front_color')" :label="$t('page.front_color')" prop="front_color">
                    <el-color-picker v-model="form.front_color" />
                  </el-form-item>
                  <el-form-item v-if="detail[var2LowerCase('award_enabled')]" :ref="var2LowerCase('raffled_miss')" :label="$t('page.raffled_miss')" prop="raffled_miss">
                    <el-input v-model="form.raffled_miss" :placeholder="page[var2LowerCase('default_raffled_miss')] || '再接再厉，祝您下次中奖'" />
                    <p class="help-block">未中奖时显示，最多20个字符</p>
                  </el-form-item>
                  <component :is="camelToSnake(detail.page.type)" v-if="lookup_template.includes(camelToSnake(detail.page.type))" :form="form" />
                  <el-form-item v-if="detail.type === 'UnitsActivity' && detail[var2LowerCase('award_enabled')]" :ref="var2LowerCase('display_taken_good')" :label="$t('activities.display_taken_good')">
                    <el-switch v-model="form.display_taken_good" />
                    <p class="help-block">关闭后已领奖二维码扫码后不显示已领奖品具体信息</p>
                  </el-form-item>
                  <template v-if="detail.page[var2LowerCase('description_enabled')]">
                    <el-form-item :ref="var2LowerCase('publisher_name')" :label="$t('activities.publisher_name')">
                      <el-input v-model="form.publisher_name" />
                      <p class="help-block">活动发行方，默认为公众号名称</p>
                    </el-form-item>
                    <el-form-item :ref="var2LowerCase('description')" :label="$t('activities.description')">
                      <!-- <el-input v-model="form.description" type="textarea" :rows="10" /> -->
                      <Tinymce ref="editor" v-model="form.description" :height="400" />
                      <p class="help-block">活动说明, 将在活动页面显示。请描述活动内容，奖项设置等信息。</p>
                    </el-form-item>
                  </template>
                  <hr>
                  <template v-if="detail.state === 'pending'">
                    <el-button type="success" :loading="loading" @click="submit">保存，并下一步</el-button>
                    <router-link :to="{ name: detail.awardEnabled ? 'ActivityAwards' : $activityRouterName(activityData.type, 'ActivityAdvanceEdit'), params: { activityId: this.$route.params.activityId }}" class="el-button">上一步</router-link>
                  </template>
                  <template v-else>
                    <el-button v-if="checkPer(['activity_update'])" type="success" :loading="loading" @click="submit">保存</el-button>
                  </template>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <SelectVideo v-if="checkPer(['video_manage'])" :show.sync="videoDialog" @selectChange="selectdVideo" />
  </div>
</template>

<script>
import activities from '@/api/activities'
import activities_page from '@/api/activities_page'
import amazon from '@/api/amazon'
import Tab from '@/components/Tabs/activity.vue'
import PageEditTitle from './components/edit_page/index.vue'
import ActivityBanner from '@/components/ActivityBanner'
import SelectVideo from '@/components/Assets/video.vue'
import Tinymce from '@/components/Tinymce'
import Step from './components/step.vue'

import anti_fake4_page from './components/edit_page/anti_fake4_page.vue'
import checkin_b_page from './components/edit_page/checkin_page.vue'
import code_page from './components/edit_page/code_page.vue'
import image_page from './components/edit_page/image_page.vue'
import jtw_red_pack_popup_page from './components/edit_page/jtw_red_pack_popup_page.vue'
import password_page from './components/edit_page/password_page.vue'
import red_pack_popup_page from './components/edit_page/red_pack_popup_page.vue'
import subscribe_page from './components/edit_page/subscribe_page.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    Tab,
    Step,
    PageEditTitle,
    ActivityBanner,
    SelectVideo,
    Tinymce,
    anti_fake4_page,
    checkin_b_page,
    code_page,
    image_page,
    jtw_red_pack_popup_page,
    password_page,
    red_pack_popup_page,
    subscribe_page
  },
  data() {
    return {
      detail: {
        userTags: [],
        page: { }
      },
      videoDialog: false,
      page: {},
      previewUrl: '',
      rules: {
        raffle_wish: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        raffled_award: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        // raffled_miss: [
        //   { required: true, message: '不能为空', trigger: 'blur'}
        // ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      bannerLoading: false,
      bgImgLoading: false,
      musicLoading: false,
      loading: false,
      form: {
        activity_desc_show_enabled: false,
        award_hidden: false,
        award_record_enabled: false,
        award_record_mode: 'danmu',
        banner_hidden: false,
        banner_id: null,
        banner_url: null,
        banner_default: true,
        banner_type: null,
        bg_color: null,
        bg_img_id: null,
        bg_img_url: null,
        checkin_desc: null,
        company_url: null,
        description: null,
        description_enabled: false,
        display_taken_good: false,
        front_color: null,
        image_id: null,
        music_id: null,
        music_url: null,
        navbar_hidden: null,
        password: null,
        publisher_name: null,
        raffled_award: null,
        raffled_miss: null,
        raffle_wish: null,
        video: null,
        video_code: null,
        video_file_id: null,
        video_id: null,
        video_type: 'video_code',
        video_img_url: null,
        default_bg_color: null,
        default_raffled_miss: null,
        can_edit_page_images: false
      },
      lookup_template: [
        'anti_fake4_page',
        'checkin_b_page',
        'code_page',
        'image_page',
        'jtw_red_pack_popup_page',
        'password_page',
        'red_pack_popup_page',
        'subscribe_page'
      ]
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData'])
  },
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: this.$activityBreadName(this.activityData.type) + '列表', path: { name: this.activityData.type === 'AntiFakeActivity' ? 'AntiFakes' : 'ActivityIndex' }},
      { title: this.activityData.state === 'pending' ? '设置活动页面' : this.activityData.title }
    ])
    await this.fetch()
  },
  mounted() {

  },
  methods: {
    async fetch() {
      this.detail = this.activityData
      this.previewUrl = this.mobilePreviewUrl(this.activityData.mobilePreviewUrl)
      await activities_page.get({ id: this.$route.params.activityId }).then(({ data }) => {
        for (const key in this.form) {
          this.form[key] = data[this.var2LowerCase(key)]
        }
        if (!this.form.bg_color) {
          this.form.bg_color = data[this.var2LowerCase('default_bg_color')]
        }
        if (!this.form.front_color) {
          this.form.front_color = data[this.var2LowerCase('default_front_color')]
        }
        if (!this.form.publisher_name) {
          this.form.publisher_name = this.account.store.name
        }
        this.page = data
      })
    },
    beforeUpload(params) {
      let result = params.file.size / 1024 / 1024 < 2
      let text = ''
      switch (params.data.column) {
        case 'banner':
          result = params.file.size / 1024 / 1024 < 2
          text = '横幅图大小不能超过 2MB!'
          break
        case 'bg_img':
          result = params.file.size / 1024 / 1024 < 2
          text = '背景图大小不能超过 2MB!'
          break
        case 'music':
          result = params.file.size / 1024 / 1024 < 2
          text = '背景音乐大小不能超过 1MB!'
          break
      }
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
      this[this.var2LowerCase(`${params.data.column}_loading`)] = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[this.camelToSnake(`${params.data.column}Id`)] = data.id
        this.form[this.camelToSnake(`${params.data.column}Url`)] = data.imageUrl
        this[this.var2LowerCase(`${params.data.column}_loading`)] = false
        if (params.data.column === 'banner') {
          this.form.banner_default = false
        }
      }).catch(() => {
        this[this.var2LowerCase(`${params.data.column}_loading`)] = false
      })
    },
    selectdVideo(data) {
      this.form.video_img_url = data.imgUrl
      this.form.video_id = data.id
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const form = {}
          for (const key in this.form) {
            form[this.var2LowerCase(key)] = this.form[this.camelToSnake(key)]
          }
          activities_page.edit({ ...form, id: this.$route.params.activityId }).then(({ data }) => {
            window.onbeforeunload = function(e) {
              window.onbeforeunload = null
            }
            this.loading = false
            if (this.detail.state === 'pending') {
              this.$router.push({ name: this.$activityRouterName(this.activityData.type, 'ActivityWizardCheck'), params: { activityId: this.$route.params.activityId }})
            } else {
              window.location.reload()
            }
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    reset(type) {
      if (confirm('确定吗？')) {
        activities_page[type]({ id: this.$route.params.activityId }).then(response => {
          window.location.reload()
        })
      }
    },
    mobilePreviewUrl(url) {
      if (Object.keys(url).length) {
        console.log(url)
        if (!url.includes('mobile/v2')) {
          return url.replace(/mobile/, 'mobile/v2')
        } else {
          return ''
        }
      } else {
        return ''
      }
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
</style>
