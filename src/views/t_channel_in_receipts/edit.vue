<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ `${title}出库单` }}
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="入库单号" prop="code">
            <el-input v-model="form.code" />
            <p class="help-block">系统自动生成，可手动输入已有单号</p>
          </el-form-item>
          <el-form-item label="入库类型" prop="inOutType">
            <el-select v-model="form.inOutType" clearable placeholder="请选择" :disabled="$route.name === 'TChannelInReceiptEdit'">
              <el-option
                v-for="item in in_out_type_list"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <hr>
          <el-button :loading="submitting" type="success" @click="submit">
            保存
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import t_channel_receipt from '@/api/t_channel_receipt'
import channels from '@/api/channels'
import t_channel_receipt_in from '@/api/t_channel_receipt_in'
import { orderCode } from '@/utils'

export default {
  data() {
    return {
      form: {
        autoInReceipt: false,
        autoInType: null,
        code: null,
        inChannelId: null,
        inOutType: null,
        note: ''
      },
      rules: {
        code: { required: true, message: '入库单号不能为空', trigger: 'blur' },
        inOutType: { required: true, message: '入库类型不能为空', trigger: 'blur' }
      },

      in_out_type_list: [],
      channel_list: [],
      in_channel_list: [],

      searchLoading: false,
      submitting: false,

      title: this.$route.name === 'TChannelInReceiptEdit' ? '修改' : '新建'
    }
  },

  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '入库单列表', path: { name: 'TChannelInReceiptIndex' }},
      { title: `${this.title}入库单` }
    ])

    await t_channel_receipt.in_out_type({ type: 'TChannelInReceipt' }).then(response => {
      this.in_out_type_list = response.data
    })

    await channels.index().then(response => {
      this.in_channel_list = response.data.content
    })

    if (this.$route.name === 'TChannelInReceiptEdit') {
      await t_channel_receipt.show(this.$route.params.id).then(response => {
        this.form = {
          id: response.data.id,
          code: response.data.code,
          inOutType: response.data.inOutType,
          note: response.data.note
        }
      })
    } else {
      this.form.code = `RK${orderCode(new Date())}`
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channel_list = response.data
          })
        }, 200)
      } else {
        this.channel_list = []
      }
    },
    remoteMethodIn(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.in_channel_list = response.data
          })
        }, 200)
      } else {
        this.channel_list = []
      }
    },
    submit() {
      const action = this.$route.name === 'TChannelInReceiptNew' ? 'add' : 'edit'
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.autoInReceipt) {
            delete this.form.autoInType
          }
          this.submitting = true
          t_channel_receipt_in[action](this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'TUnitsInTUnitBatches', params: { id: response.data.id }})
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    }
  },
}
</script>
