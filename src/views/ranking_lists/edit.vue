<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'RankingListEdit' ? '编辑' : '新建' }}排行榜
        </a>
      </li>
    </ul>
    <div v-loading="loading" class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="12">
            <div class="phone-frame" style="margin: 0 auto;">
              <iframe v-if="modal.url" id="previewer" ref="preview" :src="modal.url+'/demo'" />
              <div v-else style="align-items: center; border: solid #eee 1px; width: 100%;height: 100%; justify-content: center; display: flex;">保存后预览排行榜</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title"> 排行榜设置 </div>
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="排行榜名称" prop="title">
                    <el-input v-model="form.title" />
                  </el-form-item>
                  <el-form-item label="显示数量" prop="showCount">
                    <el-input-number v-model="form.showCount" :controls="false" :max="50" />
                    <p class="help-block">显示数量上限为50</p>
                  </el-form-item>
                  <el-form-item label="横幅图">
                    <div class="flex" style="align-items: center;">
                      <el-image v-if="form.bannerUrl" style="width: 160px;" :src="form.bannerUrl" fit="cover" class="img-thumbnail" />
                      <el-image v-else style="width: 160px;" :src="require('@/assets/ranking_list_banner.png')" fit="cover" class="img-thumbnail" />
                      <div style="margin-left: 30px">
                        <el-button type="text" :loading="reseting" @click="reset"><i class="fa fa-refresh" /> 还原</el-button>
                      </div>
                    </div>
                    <el-upload
                      action="#"
                      accept="image/*"
                      :show-file-list="false"
                      :http-request="listenUploadImageLimit"
                      :before-upload="beforeImageUpload"
                    >
                      <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
                    </el-upload>
                    <p class="help-block">尺寸：750 x 240px，格式：png，jpg，gif</p>
                  </el-form-item>
                  <el-form-item label="背景色">
                    <el-color-picker v-model="form.bgColor" />
                  </el-form-item>
                  <el-form-item label="指标">
                    <el-radio-group v-model="form.orderType">
                      <el-radio label="orders_count">兑奖次数</el-radio>
                      <el-radio label="par_sum">红包金额</el-radio>
                      <el-radio label="points_sum">积分额</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="时间范围" class="content-full">
                    <el-radio-group v-model="form.timeRange">
                      <el-radio label="today">今日</el-radio>
                      <el-radio label="yesterday">昨日</el-radio>
                      <el-radio label="before_7_days">近7天</el-radio>
                      <el-radio label="before_30_days">近30天</el-radio>
                      <el-radio label="before_90_days">近90天</el-radio>
                      <el-radio label="custom">自定义</el-radio>
                    </el-radio-group>
                    <el-col v-if="form.timeRange === 'custom'" :span="11">
                      <el-date-picker
                        v-model="date"
                        style="margin-top: 5px;"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        :picker-options="elPickerOptions()"
                        @change="changeDatePicker"
                      />
                    </el-col>
                  </el-form-item>
                  <el-form-item label="活动" class="content-full">
                    <el-radio-group v-model="form.activitySelectType">
                      <el-radio label="by_id">多选活动</el-radio>
                      <el-radio label="by_tag">活动标签</el-radio>
                    </el-radio-group>
                    <div v-if="form.activitySelectType === 'by_id'" style="margin-top: 5px;">
                      <el-select
                        v-model="form.activityIds"
                        size="small"
                        clearable
                        filterable
                        placeholder="默认为全部活动"
                        multiple
                      >
                        <el-option
                          v-for="item in activityList"
                          :key="item.id"
                          :label="item.title"
                          :value="item.id"
                        />
                      </el-select>
                    </div>
                    <div v-if="form.activitySelectType === 'by_tag'" style="margin-top: 5px;">
                      <el-select
                        v-model="form.activityTagIds"
                        size="small"
                        clearable
                        filterable
                        placeholder="请输入"
                        multiple
                      >
                        <el-option
                          v-for="item in tagList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="地区" class="el-address">
                    <el-select v-model="form.province" placeholder="请选择" filterable clearable @change="changeProvince">
                      <el-option
                        v-for="item in province"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <el-select v-model="form.city" placeholder="请选择" filterable clearable style="margin-left: 10px;">
                      <el-option
                        v-for="item in city"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="说明" class="content-full">
                    <Tinymce v-if="richLoading" ref="editor" v-model="form.description" :height="300" />
                  </el-form-item>
                </el-form>
                <div v-if="checkPer(['micro_page_manage'])">
                  <hr>
                  <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
                  <el-button v-if="$route.name !== 'RankingListDup'" :type="form.published ? '' : 'success'" :loading="submitting" @click="submit(!form.published)">{{ form.published === true ? '取消' : '' }}发布</el-button>
                  <el-button v-if="['RankingListEdit'].includes($route.name)" @click="preview">预览</el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      width="880px"
      title="预览"
      append-to-body
      :visible.sync="modal.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame">
          <iframe id="previewer" :src="modal.url+'/demo'" />
        </div>
        <div class="home_page_edit">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>排行榜链接</h4>
              <div v-if="!form.published">
                当前排行榜未发布，发布后可复制链接并查看二维码。
              </div>
              <div v-else>
                <el-input ref="copyUrl" v-model="modal.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                <el-input v-model="modal.url" :disabled="true">
                  <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr ref="Qrcode" :text="modal.url" class="img-thumbnail" :size="150" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import ranking_lists from '@/api/ranking_lists'
import dict_region from '@/api/dict_region'
import region_api from '@/api/region'
import tags from '@/api/tag'
import activities from '@/api/activities'
import amazon from '@/api/amazon'
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'

export default {
  components: {
    Tinymce,
    VueQr
  },
  data() {
    return {
      loading: true,
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        showCount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      date: [],
      province: [],
      city: [],
      tagList: [],
      activityList: [],
      searchActiveLoading: false,
      uploading: false,
      reseting: false,
      submitting: false,
      richLoading: false,
      form: {
        name: null,
        showCount: 10,
        bgColor: '#ff5558',
        orderType: 'orders_count',
        activitySelectType: 'by_id',
        timeRange: 'today',
        activityTagIds: [],
        activityIds: [],
        city: null,
        province: null,
        bannerId: null,
        bannerUrl: null,
        description: null
      },
      modal: {
        preview: false,
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    'form.province'() {
      if (!this.form.province) {
        this.form.city = null
      }
      this.getCity(this.form.province)
    }
  },
  async mounted() {
    if (['RankingListDup', 'RankingListNew'].includes(this.$route.name)) {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建排行榜' }])
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '排行榜列表', path: { name: 'RankingListIndex' }}, { title: '编辑排行榜' }])
    }
    dict_region.tree().then(({ data }) => {
      this.regionData = data.children
    })
    this.getProvince()
    await tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    await activities.all().then(response => {
      this.activityList = response.data
    })
    if (['RankingListDup', 'RankingListEdit'].includes(this.$route.name)) {
      ranking_lists.show({ id: this.$route.params.id }).then(({ data }) => {
        this.form = data
        this.richLoading = true
        if (data.startDate || data.endDate) {
          this.date = [data.startDate, data.endDate]
        }
      })
      this.modal.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/ranking_lists/${this.$route.params.id}`
    }
    this.loading = false
  },
  methods: {
    getProvince() {
      region_api.getChildren({}).then(response => {
        this.province = response.data
      }).catch(() => {})
    },
    // remoteActiveMethod(query) {
    //   if (query !== '') {
    //     this.searchActiveLoading = true
    //     setTimeout(() => {
    //       activities.list({ search: query.toLowerCase(), size: 1000 }).then(response => {
    //         this.searchActiveLoading = false
    //         this.activityList = response.data.content
    //       })
    //     }, 200)
    //   }
    // },
    getCity(code) {
      if (code) {
        region_api.getChildren({ code }).then(response => {
          this.city = response.data
        }).catch(() => {})
      }
    },
    changeProvince() {
      this.form.city = null
    },
    changeDatePicker() {
      this.form.startDate = this.date[0]
      this.form.endDate = this.date[1]
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.bannerId = response.data.id
        this.form.bannerUrl = response.data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('横幅图大小不能超过 2MB!')
      }
      this.uploading = false
      return isLt2M
    },
    reset() {
      if (confirm('确定吗?')) {
        this.reseting = true
        ranking_lists.reset_banners({ id: this.$route.params.id }).then(response => {
          this.reseting = false
          window.location.reload()
        })
      }
    },
    submit(b) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const action = ['RankingListDup', 'RankingListNew'].includes(this.$route.name) ? 'add' : 'edit'
          this.submitting = true
          if (this.$route.name === 'RankingListDup') {
            delete this.form.id
          }
          if (b === true || b === false) {
            this.form.published = b
          }
          if (!this.form.province) {
            this.form.city = ''
          }
          ranking_lists[action](this.form).then(response => {
            if (['RankingListDup', 'RankingListNew'].includes(this.$route.name)) {
              this.$router.push({ name: 'RankingListEdit', params: { id: response.data.id }})
            } else {
              // this.$router.push({ name: 'RankingListEdit', params: { id: this.$route.params.id }})
              window.location.reload()
            }
            this.submitting = false
            this.$message.success(`${action === 'edit' ? '更新' : '创建'}成功`)
          }).catch(fail => {
            this.submitting = false
            if (b === true || b === false) {
              this.form.published = !b
            }
          })
        }
      })
    },
    preview() {
      this.modal.preview = true
    },
    copy() {},
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-radio {
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
    }
    .el-address .el-form-item__content {
      display: flex;
    }
  }
  .home_page_edit {
    width: 400px;
    margin-left: 20px;
    .well {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
      padding: 19px;
      margin-bottom: 0px;
      background-color: #F5F5F5;
      border: 1px solid #ededed;
      border-radius: 4px;
    }
  }
</style>
