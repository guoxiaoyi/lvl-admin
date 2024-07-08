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
            <Sticky :sticky-top="20">
              <div class="phone-frame" style="margin: 0 auto;">
                <nav-header v-if="isDisabled" />
                <img v-if="isDisabled" src="@/assets/default_award_result.jpg" style="width: 100%;">
                <AwardResultPage v-else :form="form" :extra-json="extraJson" />
                <div class="phone-home-btn" />
              </div>
            </Sticky>
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
                      <el-radio label="DEFAULT">默认</el-radio>
                      <el-radio label="CUSTOM">自定义</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="页面名称">
                    <el-input v-model="form.title" :disabled="isDisabled" />
                  </el-form-item>
                  <el-form-item label="横幅图">
                    <table style="width: 320px">
                      <tr>
                        <td style="width: 240px">
                          <img v-if="form.bannerImageUrl" :src="form.bannerImageUrl" class="img-thumbnail" style="width: 160px">
                        </td>
                        <td>
                          <el-button v-if="form.bannerImageUrl" type="text" @click="reset('bannerImage')"><i class="fa fa-trash-o" /> 还原</el-button>
                        </td>
                      </tr>
                    </table>
                    <el-upload
                      action="#"
                      accept="image/*"
                      :data="{column: 'bannerImage'}"
                      :show-file-list="false"
                      :http-request="uploadFile"
                    >
                      <el-button :loading="bannerImageLoading" :disabled="isDisabled" type="success" size="medium">上传</el-button>
                    </el-upload>
                    <p class="help-block">尺寸：640 x 240px，格式：png，jpg，gif</p>
                  </el-form-item>
                  <el-form-item label="背景图">
                    <table style="width: 320px">
                      <tr>
                        <td style="width: 240px">
                          <img v-if="form.bgImageUrl" :src="form.bgImageUrl" class="img-thumbnail" style="width: 160px; height:100px; object-fit: cover;">
                        </td>
                        <td>
                          <el-button v-if="form.bgImageUrl" type="text" @click="reset('bgImage')"><i class="fa fa-trash-o" /> 还原</el-button>
                        </td>
                      </tr>
                    </table>
                    <el-upload
                      action="#"
                      accept="image/*"
                      :data="{column: 'bgImage'}"
                      :show-file-list="false"
                      :http-request="uploadFile"
                    >
                      <el-button :loading="bgImageLoading" :disabled="isDisabled" type="success" size="medium">上传</el-button>
                    </el-upload>
                    <p class="help-block">尺寸：750 x 1200px，格式：png，jpg，gif</p>
                  </el-form-item>
                  <el-form-item label="背景色" class="content-full">
                    <div class="flex">
                      <el-color-picker v-model="form.bgColor" :disabled="isDisabled" />
                      <el-button type="text" class="reset" :disabled="isDisabled" @click="form.bgColor = null">重置</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="自定义按钮">
                    <draggable v-model="extraJson" filter=".add-item" :disabled="isDisabled">
                      <div v-for="(item, index) in extraJson" :key="index" class="child-form">
                        <el-form-item label="显示样式">
                          <div class="flex flex-item justify-content__space-between">
                            <el-radio-group v-model="item.span" :disabled="isDisabled" class="flex items-center">
                              <el-radio :label="24">一行一个</el-radio>
                              <el-radio :label="12">一行两个</el-radio>
                            </el-radio-group>
                            <el-button type="text" :disabled="isDisabled" @click="delGroup(index)">删除</el-button>
                          </div>
                        </el-form-item>
                        <el-form-item label="上间距">
                          <el-slider v-model="item.margin" show-input :disabled="isDisabled" :max="1000" />
                        </el-form-item>
                        <el-form-item label="页面边距">
                          <el-slider v-model="item.padding" show-input :disabled="isDisabled" :max="500" />
                        </el-form-item>
                        <el-form-item label="间隔">
                          <el-slider v-model="item.gutter" show-input :disabled="isDisabled" :max="500" />
                        </el-form-item>
                        <draggable v-model="item.items" filter=".remove-item" :disabled="isDisabled" @start="drag=true" @end="drag=false">
                          <div v-for="(button, _index) in item.items" :key="_index" class="add-item flex">
                            <div v-if="item.items.length > 1" class="remove-item" @click="remove(index, _index)" />
                            <div class="thumb-image" @click="() => { if (isDisabled) { return } show = true; groupIndex = index; itemIndex = _index;}">
                              <img v-if="button.pictureUrl" :src="button.pictureUrl">
                              <img v-else :src="require('@/assets/add.png')" style="width: 30px; height: 30px;">
                              <span v-if="button.pictureUrl">更换图片</span>
                            </div>
                            <div class="flex-item">
                              <el-form-item label="跳转地址" class="content-full">
                                <Link :item="button" :disabled="isDisabled" />
                              </el-form-item>
                            </div>
                          </div>
                        </draggable>
                        <el-button type="success" size="medium" :disabled="buttonsCount >= 12 || isDisabled" @click="addButton(index)">新增</el-button>
                      </div>
                    </draggable>
                    <el-button type="success" :disabled="buttonsCount >= 12 || isDisabled" @click="addGroup">增加组</el-button>
                  </el-form-item>
                  <!-- 如果有id 显示 ，如果没有id 并且 form.type === 'DEFAULT' 不显示  -->
                  <template v-if="!(!form.id && form.type === 'DEFAULT')">
                    <hr>
                    <el-button type="success" :loading="loading" @click="submit">保存</el-button>
                  </template>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <SelectImage :show.sync="show" @selectChange="selectd" />
  </div>
</template>

<script>
import page_order_result from '@/api/page_order_result.js'
import activities_page from '@/api/activities_page'
import amazon from '@/api/amazon'
import Tab from '@/components/Tabs/activity.vue'
import PageEditTitle from './components/edit_page/index.vue'
import Step from './components/step.vue'
import Link from '@/components/AwardResultPage/link.vue'
import draggable from 'vuedraggable'
import SelectImage from '@/components/Assets/image.vue'
import Sticky from '@/components/Sticky'
import AwardResultPage from '@/components/AwardResultPage'
import navHeader from '@/components/AwardResultPage/nav-header.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Tab,
    Step,
    PageEditTitle,
    Link,
    draggable,
    SelectImage,
    Sticky,
    navHeader,
    AwardResultPage
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
        id: null,
        type: 'DEFAULT',
        title: null,
        bannerImageId: null,
        bgImageId: null,
        bgColor: null,
        extraJson: {}
      },
      bannerImageLoading: false,
      bgImageLoading: false,
      show: false,
      groupIndex: null,
      itemIndex: null,
      extraJson: []
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData']),
    buttonsCount() {
      return this.extraJson.reduce((sum, { items }) => sum + items.length, 0)
    },
    isDisabled() {
      return this.form.type === 'DEFAULT'
    }
  },
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.state === 'pending' ? '设置活动页面' : this.activityData.title }
    ])
    this.fetch()
    page_order_result.show({ activityId: this.$route.params.activityId }).then(({ data }) => {
      this.form = data
      this.beforeShow()
    })
  },
  methods: {
    beforeSubmit() {
      const extraJson = {}
      const hasError = []
      this.extraJson.forEach((element, index) => {
        extraJson[index] = element
        if (element.items.length === 0) {
          hasError.push('按钮组不能为空')
        } else {
          element.items.forEach(btn => {
            if (!btn.pictureId) {
              hasError.push('按钮图片不能为空')
            }
            if (!btn.link_type) {
              hasError.push('跳转地址不能为空')
            }
          })
        }
      })
      this.form.extraJson = extraJson
      if (hasError.length > 0) {
        this.$message.error(hasError[0])
        return false
      } else {
        return true
      }
    },
    beforeShow() {
      Object.keys(this.form.extraJson || {}).forEach(item => {
        this.extraJson.push(this.form.extraJson[item])
      })
    },
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
      this[params.data.column + 'Loading'] = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
        this[params.data.column + 'Loading'] = false
      }).catch(() => {
        this.uploading = false
      })
    },

    submit() {
      if (this.beforeSubmit()) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            page_order_result.edit({ ...this.form, activityId: this.$route.params.activityId }).then(({ data }) => {
              this.loading = false
              this.$message.success('保存成功')
            }).catch(fail => {
              this.loading = false
            })
          }
        })
      }
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
      this.extraJson.push({
        type: 'buttons',
        span: 24,
        margin: 0,
        padding: 0,
        gutter: 0,
        items: [
          { link_name: null, link_type: null, url: null, pictureId: null, pictureUrl: null, id: null }
        ]
      })
    },
    delGroup(index) {
      if (this.isDisabled) {
        return
      }
      if (confirm('确定要删除？本组设置的跳转将同时被删除！')) {
        this.extraJson.splice(index, 1)
      }
    },
    addButton(index) {
      this.extraJson[index]['items'].push({ link_name: null, link_type: null, url: null, pictureId: null, pictureUrl: null })
    },
    remove(x, y) {
      if (this.isDisabled) {
        return
      }
      this.extraJson[x]['items'].splice(y, 1)
    },
    reset(imageType) {
      page_order_result.reset({ activityId: this.$route.params.activityId, imageType }).then(({ data }) => {
        this.form[imageType + 'Url'] = null
        this.form[imageType + 'Id'] = null
      })
    },
    selectd(data) {
      this.extraJson[this.groupIndex]['items'][this.itemIndex]['pictureUrl'] = data.url
      this.extraJson[this.groupIndex]['items'][this.itemIndex]['pictureId'] = data.id
      this.groupIndex = null
      this.itemIndex = null
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

.add-item {
  position: relative;
  background-color: #fff;
  margin: 15px 0;
  padding: 15px;
  border: 1px dashed #e5e5e5;
  align-items: center;
  cursor: pointer;
  .thumb-image {
    width: 60px;
    height: 60px;
    position: relative;
    border: 1px solid #e5e5e5;
    text-align: center;
    color: #999;
    margin-right: 15px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: block;
      width: 100%;
      background: rgba(0,0,0,0.5);
      height: 20px;
      line-height: 20px;
      color: #FFF;
      position: absolute;
      bottom: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .remove-item {
    right: -8px;
    top: -8px;
    background-image: url('~@/assets/remove.png');
    background-size: 35%;
    background-color: #999;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    line-height: 16px;
    text-align: center;
    color: #FFF;
    font-size: 10px;
  }
  ::v-deep {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
  }
}
.child-form {
  cursor: pointer;
}
::v-deep {
  .reset {
    margin-left: 10px;
  }
}
</style>
