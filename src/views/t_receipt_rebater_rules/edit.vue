<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'TReceiptRebaterRulesEdit' ? '编辑' : '新建' }}返利规则
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <h5>基本设置</h5>
          <el-form-item label="返利标题" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startAt">
            <el-date-picker
              v-model="form.startAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="'00:00:00'"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endAt">
            <el-date-picker
              v-model="form.endAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="'23:59:59'"
            />
          </el-form-item>
          <el-form-item label="产品/规格" prop="unitSpecId">
            <el-select v-model="form.unitSpecId" placeholder="请选择" clearable filterable :disabled="disabled">
              <el-option
                v-for="(item, index) in unitSpec"
                :key="'unit' + index"
                :label="item.product.name+ ' '+ item.specLabel"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <h5>返利设置</h5>
          <el-form-item label="返利包装层级" prop="unitLevel">
            <el-select v-model="form.unitLevel" placeholder="请选择" clearable filterable :disabled="disabled">
              <el-option
                v-for="(item, index) in unitLevel"
                :key="'unitLevel' + index"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道类型" prop="channelType">
            <el-select v-model="form.channelType" placeholder="请选择" clearable filterable :disabled="disabled">
              <el-option
                v-for="(item, index) in channelType"
                :key="'channelType' + index"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="返利礼品" prop="goodId">
            <el-select
              v-model="form.goodId"
              size="small"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in goods"
                :key="'goodId' + index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">
              列表中没有想要的礼品？点击
              <router-link :to="{ name: 'GoodsListNew' }" target="_blank">
                新建礼品
              </router-link>
            </p>
          </el-form-item>
          <hr>
          <el-button :loading="submitting" type="success" @click="submit"> 保存 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import product from '@/api/product'
import channels from '@/api/channels'
import product_t_unit_spec from '@/api/product_t_unit_specs'
import { rebater_goods } from '@/api/goods'
import t_receipt_rebater_rules from '@/api/t_receipt_rebater_rules'
export default {
  data() {
    return {
      unitSpec: [],
      unitLevel: [],
      channelType: [],
      goods: [],
      form: {
        id: null,
        name: null,
        startAt: '',
        endAt: '',
        unitSpecId: null,
        note: null,
        goodId: null,
        unitLevel: null,
        channelType: null
      },
      rules: {
        name: [
          { required: true, message: `返利标题不能为空`, trigger: 'blur' }
        ],
        startAt: [
          { required: true, message: `开始时间不能为空`, trigger: 'blur' }
        ],
        endAt: [
          { required: true, message: `结束时间不能为空`, trigger: 'blur' }
        ],
        unitSpecId: [
          { required: true, message: `产品/规格不能为空`, trigger: 'blur' }
        ],
        channelType: [
          { required: true, message: `渠道类型不能为空`, trigger: 'blur' }
        ],
        unitLevel: [
          { required: true, message: `返利包装层级不能为空`, trigger: 'blur' }
        ],
        goodId: [
          { required: true, message: `返利礼品不能为空`, trigger: 'blur' }
        ]

      },
      submitting: false,
      searchLoading: false,
      disabled: false
    }
  },
  watch: {
    'form.unitSpecId'(newVal, oldVal) {
      if (newVal) {
        product_t_unit_spec.label({ id: newVal }).then(response => {
          this.unitLevel = response.data
        })
      } else {
        this.unitLevel = []
        this.form.unitLevel = null
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '返利规则', path: { name: 'TReceiptRebaterRulesIndex' }},
      { title: this.$route.name === 'TReceiptRebaterRulesEdit' ? '编辑返利规则' : '新建返利规则' }
    ])
    product.t_unit_specs().then(response => {
      this.unitSpec = response.data
    })
    channels.type().then(response => {
      this.channelType = response.data.filter(t => t.key !== 'Channels::Level0')
    })

    await rebater_goods().then(response => {
      this.goods = response.data.content
    })
    if (this.$route.name === 'TReceiptRebaterRulesEdit') {
      this.disabled = true
      t_receipt_rebater_rules.show({ id: this.$route.params.id }).then(response => {
        this.form.id = response.data.id
        this.form.name = response.data.name
        this.form.startAt = response.data.startAt
        this.form.endAt = response.data.endAt
        this.form.unitSpecId = response.data.unitSpec.id
        this.form.note = response.data.note
        this.form.goodId = response.data.goods.id
        this.form.unitLevel = response.data.unitLevel
        this.form.channelType = response.data.channelType
        this.goods.push(response.data.goods)
      })
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          rebater_goods({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.goods = response.data.content
          })
        }, 200)
      } else {
        this.goods = []
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        const action = this.$route.name === 'TReceiptRebaterRulesNew' ? 'add' : 'edit'
        if (valid) {
          this.submitting = true
          t_receipt_rebater_rules[action](this.form).then(response => {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
            this.submitting = false
            this.$router.push({ name: 'TReceiptRebaterRulesIndex' })
          }).catch(_error => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>
