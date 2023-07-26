<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          编辑套卡
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="套卡名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="卡片数量" prop="name">
            <el-input-number v-model="form.suiteSpec" :controls="false" :disabled="$route.name === 'SuiteCardEdit'" :min="2" />
            <p class="help-block">设置套卡内卡片数量，可设置范围2-6</p>
          </el-form-item>
          <el-form-item label="套卡封面图" prop="name">
            <div class="flex">
              <div style="margin-right: 20px;">
                <el-image v-if="form.coverImgFileName" :src="form.coverImgUrl" class="img-thumbnail activity-thumbnail-middle" fit="cover" :preview-src-list="[form.coverImgUrl]" />
                <el-image v-else :src="require('@/assets/ex_banner.png')" class="img-thumbnail activity-thumbnail-middle" fit="cover" :preview-src-list="[require('@/assets/ex_banner.png')]" />
              </div>
              <el-button v-if="$route.name === 'SuiteCardEdit'" :loading="resetLoading" type="text" @click="reset_cover_img"><i class="fa fa-refresh" /> 还原</el-button>
            </div>
            <el-upload
              action="#"
              accept="image/*"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="uploading" type="success" size="medium">上传</el-button>
            </el-upload>
            <p class="help-block">尺寸：400 x 400px，格式：png，jpg，gif</p>
          </el-form-item>
          <el-form-item label="集齐奖励" prop="name">
            <el-input v-model="form.good.name" :disabled="true">
              <template slot="append">
                <el-button type="success" @click="goodsModal = true">选择</el-button>
              </template>
            </el-input>
            <p class="help-block">设置集齐套卡后奖励礼品；列表中没有想要的礼品？<router-link :to="{ name: 'GoodsNew'}" target="_blank">点击新建礼品</router-link></p>
          </el-form-item>
          <el-form-item label="兑换结束日期" prop="name">
            <el-date-picker v-model="form.expiresAt" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" />
            <p class="help-block">设置兑换奖励结束日期。</p>
          </el-form-item>
          <el-form-item v-if="$route.name === 'SuiteCardEdit'" label="套卡状态" prop="name">
            <el-switch v-model="form.enabled" />
            <p class="help-block">套卡启用后，可在活动中配置套卡内卡片作为礼品。</p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </div>
    <goods-dialog :show.sync="goodsModal">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </goods-dialog>
  </div>
</template>

<script>
import suite_cards from '@/api/suite_cards'
import amazon from '@/api/amazon'
import GoodsDialog from '@/components/Goods/modal.vue'
const defaultForm = {
  name: null,
  suiteSpec: null,
  goodId: null,
  expiresAt: null,
  enabled: false,
  pictureId: null,
  good: {},
  childCards: []
}
export default {
  components: { GoodsDialog },
  data() {
    return {
      goodsModal: false,
      uploading: false,
      submitting: false,
      form: Object.assign({}, defaultForm),
      rules: {},
      resetLoading: false
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'SuiteCardIndex' }}]
    if (this.$route.name === 'SuiteCardEdit') {
      await suite_cards.show({ ...this.$route.params }).then(({ data }) => {
        this.form = data
        breadcrumb.push({ title: data.name, path: { name: 'SuiteCardShow', params: { id: data.id }}})
      })
      breadcrumb.push({ title: '编辑套卡' })
    } else {
      breadcrumb.push({ title: '新建套卡' })
    }
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'SuiteCardEdit' ? 'edit' : 'add'
          suite_cards[action](this.form).then(async({ data }) => {
            this.$message.success(this.$route.name === 'SuiteCardEdit' ? '更新成功' : '创建成功')
            if (this.$route.name === 'SuiteCardEdit') {
              this.$router.push({ name: 'SuiteCardShow', params: { id: this.$route.params.id }})
            } else {
              this.$router.push({ name: 'SuiteCardShow', params: { id: data.id }})
            }
            this.submitting = false
          }).catch(fail => {
            this.submitting = false
          })
        }
      })
    },
    select(data) {
      this.form.good = data
      this.form.goodId = data.id
      this.goodsModal = false
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      amazon.tmp(formData).then(({ data }) => {
        this.form.pictureId = data.id
        this.form.coverImgUrl = data.imageUrl
        this.form.coverImgFileName = data.fileFileName
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    reset_cover_img() {
      if (confirm('确定吗?')) {
        this.resetLoading = true
        suite_cards.reset_cover_img({ id: this.form.id }).then(({ data }) => {
          this.resetLoading = false
          this.form.pictureId = null
          this.form.coverImgUrl = null
          this.form.coverImgFileName = null
        }).catch(fail => {
          this.resetLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-thumbnail-middle {
  width: 160px;
  vertical-align: middle;
}
</style>
