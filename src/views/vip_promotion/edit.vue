<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 新建推广 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="名称" prop="label">
            <el-input v-model="form.label" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="来源类型" prop="sourceType">
            <el-select v-model="form.sourceType">
              <el-option v-for="(item, index) in sourceTypeData" :key="item" :value="index" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.sourceType === 'unit_activity'" label="关联活动" prop="relatedContent">
            <el-select
              v-model="form.relatedContent"
              size="small"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteActiveMethod"
              :loading="searchActiveLoading"
            >
              <el-option
                v-for="item in activityList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
                <div class="flex justify-content__space-between items-center">
                  <span>{{ item.title }}</span>
                  <span>{{ item.code }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="form.sourceType === 'wechat'" label="关联自动回复" prop="relatedContent">
            <el-input v-model="relatedContentText" disabled>
              <template slot="append">
                <el-button type="success" @click="wechat.show = true">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-else label="关联链接" prop="relatedContent">
            <el-input v-model="form.relatedContent" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="开关">
            <el-switch v-model="form.state" active-value="enabled" inactive-value="closed" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="loading" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="wechat.show"
      title="选择公众号自动回复"
      width="780px"
    >
      <WxReply @save="selectedWxReply" />
    </el-dialog>
  </div>
</template>

<script>
import activities from '@/api/activities'
import acquisition_promotion from '@/api/acquisition_promotion'
import WxReply from '@/components/VipPromotion/WxReply.vue'
export default {
  components: { WxReply },
  data() {
    return {
      rules: {
        relatedContent: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sourceType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        relatedContent: null,
        label: null,
        sourceType: null,
        state: 'enabled'
      },
      relatedContentText: null,
      sourceTypeData: {},
      searchActiveLoading: false,
      activityList: [],
      wechat: {
        show: false
      },
      loading: false
    }
  },
  watch: {
    'form.sourceType'() {
      this.form.relatedContent = null
      this.relatedContentText = null
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '拉新推广', path: { name: 'VipPromotion' }}, { title: '新建推广' }])
    acquisition_promotion.source_type().then(({ data }) => {
      this.sourceTypeData = data
    })
  },
  methods: {
    remoteActiveMethod(query) {
      if (query !== '') {
        this.searchActiveLoading = true
        setTimeout(() => {
          activities.list({ search: query.toLowerCase(), size: 30 }).then(response => {
            this.searchActiveLoading = false
            this.activityList = response.data.content
          })
        }, 200)
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          acquisition_promotion.add(this.form).then(({ data }) => {
            this.$message.success('创建成功')
            this.loading = false
            this.$router.push({ name: 'VipPromotion' })
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    selectedWxReply(data) {
      this.form.relatedContent = data.id
      this.relatedContentText = data.typeName
      this.wechat.show = false
    }
  }
}
</script>

<style>

</style>
