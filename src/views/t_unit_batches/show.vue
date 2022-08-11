<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td>所属渠道</td>
            <td> {{ result.channel.name }}</td>
          </tr>
          <tr>
            <td>批次号</td>
            <td> {{ result.code }} </td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              <ProductName :product="result.unitSpec.product" />
            </td>
          </tr>
          <tr>
            <td>产品数量</td>
            <td> {{ result.receiptedQuantityLabel }} </td>
          </tr>
          <tr>
            <td>产品代码</td>
            <td>{{ result.unitSpec.product.code }} </td>
          </tr>
          <tr>
            <td>状态</td>
            <td> {{ result.stateName }} </td>
          </tr>
          <tr>
            <td>套码规格</td>
            <td> {{ result.unitSpec.specLabel }} </td>
          </tr>
          <tr>
            <td>创建日期</td>
            <td> {{ result.createdAt }} </td>
          </tr>
          <tr>
            <td>生产日期</td>
            <td> {{ result.producedDate }} </td>
          </tr>
          <tr v-for="(item, index) in result.customFieldValues" :key="index">
            <td>{{ item.customField.label }}</td>
            <td v-if="['CustomField::CheckBoxes', 'CustomField::CheckBoxes'].includes(item.customField.type)">
              {{ item.valueList ? item.valueList.join() : '' }}
            </td>
            <td v-if="['CustomField::Select', 'CustomField::String', 'CustomField::CitizenId'].includes(item.customField.type)">
              {{ item.value}}
            </td>
            <td v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
              <a :href="item.pictureUrl" target="_blank" class="activity_forms_image_a">
                <img :src="item.pictureUrl" style="width: 30px;">
              </a>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td> {{ result.note }} </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer" style="display: flex; justify-content: space-between;">
        <div>
          <router-link
            v-if="result.state === 'pending'"
            :to="{name: 'TUnitBatchesEdit', params: {id: $route.params.id}}"
            class="el-button el-button--default el-button--small"
          >
            修改
          </router-link>
          <router-link
            v-if="result.state === 'pending'"
            :to="{name: 'TChannelOutReceiptTunitNew', params: {id: $route.params.id}}"
            class="el-button el-button--default el-button--small"
          >
            追溯码关联
          </router-link>
        </div>
        <el-button v-if="result.canComplete" type="success" :disabled="modal.disabled" @click="modal.show = true">生产入库</el-button>
      </div>
    </div>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      :title="modal.title"
      width="580px"
    >

      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
        <el-form-item label="入库单号" prop="code">
          <el-input v-model="form.code" />
          <p class="help-block">系统自动生成，可手动输入已有单号</p>
        </el-form-item>
        <el-form-item label="入库类型" prop="inOutType">
          <el-select v-model="form.inOutType" clearable placeholder="请选择" disabled>
            <el-option
              v-for="item in [{value: '生产入库', key: 'product_in'}]"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" :loading="submitting" @click="submit">
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import t_unit_batches from '@/api/t_unit_batches'
import t_channel_receipt_in from '@/api/t_channel_receipt_in'
import tab from '@/components/Tabs/t_unit_batches'
import { orderCode } from '@/utils'
import ProductName from '@/components/Product/Name'

export default {
  components: {
    tab,
    ProductName
  },
  data() {
    return {
      result: {},
      rules: {
        code: { required: true, message: '入库单号不能为空', trigger: 'blur' },
        inOutType: { required: true, message: '入库类型不能为空', trigger: 'blur' },
      },
      modal: {
        show: false,
        title: '新建入库单',
        disabled: false
      },
      form: {
        code: `RK${orderCode(new Date())}`,
        inOutType: 'product_in',
        note: '',
        unitBatchId: null
      },
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '生产批次列表', path: { name: 'TUnitBatchesIndex' }},
      { title: '生产批次详情' }
    ])
    this.fetch()
    t_unit_batches.pack_label(this.$route.params).then(response => {
      console.log(response)
    })
  },
  methods: {
    fetch() {
      t_unit_batches.show(this.$route.params).then(response => {
        this.result = response.data
      })
    },
    submit() {
      this.form.unitBatchId = this.$route.params.id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          t_channel_receipt_in.product_in(this.form).then(response => {
            this.fetch()
            this.submitting = false
            this.cancel()
            this.modal.disabled = true
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.modal.show = false
    }
  }
}
</script>
