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
          <el-form-item label="生成单号" prop="code">
            <el-input v-model="form.code" />
            <p class="help-block">系统自动生成，可手动输入已有单号</p>
          </el-form-item>
          <el-form-item label="出库类型" prop="inOutType">
            <el-select v-model="form.inOutType" clearable placeholder="请选择">
              <el-option
                v-for="item in in_out_type_list"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发货方" prop="outChannelId">
            <el-select
              v-model="form.outChannelId"
              size="small"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in channel_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">默认为当前账号渠道，更改发货方即为代该渠道发货</p>
          </el-form-item>
          <el-form-item label="收货方" prop="inChannelId">
            <el-select
              v-model="form.inChannelId"
              size="small"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethodIn"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in in_channel_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">默认为当前账号渠道，更改发货方即为代该渠道发货</p>
          </el-form-item>
          <el-form-item label="快捷入库">
            <el-switch v-model="quickIn" @change="handleQuickInChange" />
          </el-form-item>
          <template v-if="quickIn">
            <el-form-item label="入库方式" :required="quickIn">
              <el-radio-group v-model="inType" @change="handleInTypeChange">
                <el-radio value="auto" label="auto">自动入库</el-radio>
                <el-radio value="oneKey" label="oneKey">一键入库</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="入库类型" prop="autoInType">
              <el-select v-model="form.autoInType" clearable placeholder="请选择">
                <el-option
                  v-for="item in auto_in_type_list"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">
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
import t_channel_receipt_out from '@/api/t_channel_receipt_out'
import { orderCode } from '@/utils'

export default {
  data() {
    return {
      form: {
        autoInReceipt: false,
        autoInReceiptHalf: false,
        autoInType: null,
        code: null,
        inChannelId: null,
        inOutType: null,
        note: '',
        outChannelId: null
      },
      rules: {
        code: { required: true, message: '出库单号不能为空', trigger: 'blur' },
        inOutType: { required: true, message: '出库类型不能为空', trigger: 'blur' },
        outChannelId: { required: true, message: '发货方不能为空', trigger: 'blur' },
        inChannelId: { required: true, message: '收货方不能为空', trigger: 'blur' },
        autoInType: { required: true, message: '自动入库类型不能为空', trigger: 'blur' }
      },

      in_out_type_list: [],
      channel_list: [],
      in_channel_list: [],

      searchLoading: false,
      submitting: false,
      quickIn: false,
      inType: null,
      title: this.$route.name === 'TChannelOutReceiptEdit' ? '修改' : '新建'
    }
  },

  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '出库单列表', path: { name: 'TChannelOutReceiptIndex' }},
      { title: `${this.title}出库单` }
    ])

    await t_channel_receipt.in_out_type({ type: 'TChannelOutReceipt' }).then(response => {
      this.in_out_type_list = response.data
    })
    await t_channel_receipt.in_out_type({ type: 'TChannelInReceipt' }).then(response => {
      this.auto_in_type_list = response.data
    })

    await channels.index().then(response => {
      this.in_channel_list = response.data.content
    })

    if (this.$route.name === 'TChannelOutReceiptEdit') {
      await t_channel_receipt.show(this.$route.params.id).then(response => {
        this.form = {
          id: response.data.id,
          autoInReceipt: response.data.autoInReceipt,
          autoInReceiptHalf: response.data.autoInReceiptHalf,
          autoInType: response.data.autoInType,
          code: response.data.code,
          inChannelId: response.data.inChannel.id,
          inOutType: response.data.inOutType,
          note: response.data.note,
          outChannelId: response.data.outChannel.id
        }
        if (response.data.autoInReceipt || response.data.autoInReceiptHalf) {
          this.quickIn = true
        }
        if (response.data.autoInReceipt) {
          this.inType = 'auto'
        }
        if (response.data.autoInReceiptHalf) {
          this.inType = 'oneKey'
        }
      })
      channels.index({ id: this.form.inChannelId }).then(response => {
        this.in_channel_list = response.data.content
      })
      channels.index({ id: this.form.outChannelId }).then(response => {
        this.channel_list = response.data.content
      })
    } else {
      this.form.code = `CK${orderCode(new Date())}`
      await channels.index({ type: 'Channels::Level0' }).then(response => {
        this.form.outChannelId = response.data.content[0]['id']
        this.channel_list = response.data.content
      })
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
      const action = this.$route.name === 'TChannelOutReceiptNew' ? 'add' : 'edit'
      if (!this.quickIn) {
        delete this.form.autoInType
      }
      if (this.quickIn && !this.inType) {
        this.$message.error('请先选择入库方式')
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          t_channel_receipt_out[action](this.form).then(response => {
            this.submitting = false
            if (action === 'edit') {
              this.$router.push({ name: 'TChannelOutReceiptShow', params: { id: this.$route.params.id }})
            } else {
              this.$router.push({ name: 'TChannelOutReceiptShow', params: { id: response.data.id }})
            }
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    handleQuickInChange() {
      if (!this.quickIn) {
        // 快捷入库关闭时清空相关字段
        this.inType = null
        this.form.autoInReceipt = false
        this.form.autoInReceiptHalf = false
      }
    },
    handleInTypeChange(value) {
      if (value === 'auto') {
        this.form.autoInReceipt = true
        this.form.autoInReceiptHalf = false
      } else if (value === 'oneKey') {
        this.form.autoInReceipt = false
        this.form.autoInReceiptHalf = true
      }
    }
  }
}
</script>
<style>
</style>
