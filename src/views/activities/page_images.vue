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
              <iframe id="previewer" :src="detail.mobilePreviewUrl" />
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="panel panel-default">
              <div class="panel-heading flex justify-content__space-between items-center">
                <PageEditTitle :page="page" />
                <el-button type="success" @click="add">
                  <i class="fa fa-plus" /> 添加图片
                </el-button>
              </div>
              <div class="panel-body">
                <table class="table table-bordered table-hover">
                  <thead><tr><th>图片</th><th>类型</th><th>操作</th></tr></thead>
                  <tbody>
                    <tr v-for="(item, index) in list" :key="index">
                      <td>
                        <el-image v-if="!item.attachmentFileName" :src="require('@/assets/activities/'+item.pictureUrl)" fit="scale-down" class="page-image-thumbnail-small" :preview-src-list="[require('@/assets/activities/'+item.pictureUrl)]" />
                        <el-image v-else :src="item.pictureUrl" fit="scale-down" class="page-image-thumbnail-small" :preview-src-list="[item.pictureUrl]" />
                      </td>
                      <td>{{ item.kindText }}</td>
                      <td>
                        <el-button type="text" @click="edit(item)">编辑</el-button>
                        <el-button v-if="!item.isDefault" type="text" @click="del(item)">删除</el-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="status > 0"
      :before-close="handlerClose"
      width="900px"
      title="添加图片"
      top="10vh"
    >
      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
        <el-form-item label="类型" prop="kind">
          <el-select v-model="form.kind">
            <el-option v-for="item in kinds" :key="item.kind" :label="item.kindText" :value="item.kind" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="pictureId">
          <img v-if="form.pictureUrl" :src="form.pictureUrl" class="img-thumbnail" style="width: 160px">
          <el-upload
            action="#"
            accept="image/*"
            :data="{column: 'picture'}"
            :show-file-list="false"
            :http-request="uploadFile"
          >
            <el-button :loading="uploading" type="success" size="medium">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-left">
        <el-button type="success" :loading="loading" @click="submit">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
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
const defaultForm = {
  kind: null,
  pictureUrl: null,
  pictureId: null
}
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
        kind: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        pictureId: {
          required: true, message: '不能为空', trigger: 'blur'
        }
      },
      loading: false,
      list: [],
      customClass: [],
      form: {
        kind: null,
        pictureUrl: null,
        pictureId: null
      },
      kinds: [],
      uploading: false
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' }
    ])
    await this.fetch()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.detail.state === 'pending' ? '设置活动页面' : this.detail.title }
    ])
  },
  mounted() {

  },
  methods: {
    async fetch() {
      await activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
        this.detail = data
        // if (data.state === 'pending') {
        //   this.$router.push({ name: 'ActivityEdit', params: { activityId: this.$route.params.activityId }})
        // }
      })
      await activities_page.get({ id: this.$route.params.activityId }).then(({ data }) => {
        this.page = data
      })
      await activities_page.get_page_image({ id: this.$route.params.activityId }).then(({ data }) => {
        this.list = data
        // for (const key in this.form) {
        //   this.form[key] = data[this.var2LowerCase(key)]
        // }
        // if (!this.form.bg_color) {
        //   this.form.bg_color = data[this.var2LowerCase('default_bg_color')]
        // }
        // if (!this.form.front_color) {
        //   this.form.front_color = data[this.var2LowerCase('default_front_color')]
        // }
        // if (!this.form.publisher_name) {
        //   this.form.publisher_name = this.account.store.name
        // }
        // this.page = data
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
          this.loading = true
          const action = this.form.id ? 'update_page_images' : 'add_page_images'
          activities_page[action]({ ...this.form, activityId: this.$route.params.activityId }).then(({ data }) => {
            window.location.reload()
            this.loading = false
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.status = 0
      this.$refs.form.resetFields()
      this.form = Object.assign({}, defaultForm)
      this.kinds = []
    },
    edit(data) {
      this.status = 1
      this.kinds = [
        { kind: data.kind, kindText: data.kindText }
      ]
      if (data.attachmentFileName) {
        this.form.pictureUrl = data.pictureUrl
      } else {
        this.form.pictureUrl = require('@/assets/activities/' + data.pictureUrl)
      }
      if (data.id) {
        this.form.id = data.id
      }
      this.form.kind = data.kind
    },
    handlerClose() {
      this.cancel()
    },
    add() {
      this.status = 1
      this.page.extraImageKinds.forEach(item => {
        this.kinds.push({ kind: item, kindText: this.$t(`page.${this.camelToSnake(this.page.type)}['${item}']`) })
      })
    },
    del(data) {
      if (confirm('确定吗？')) {
        activities_page.del_page_images({ id: data.id, activityId: this.$route.params.activityId }).then(({ data }) => {
          window.location.reload()
        })
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
.page-image-thumbnail-small {
  max-width: 60px;
  max-height: 30px;
}
</style>
