<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="invoiceForm" size="small" label-width="16.6666%" :rules="invoice_rules" :model="invoice_form">
          <el-form-item label="发票抬头" prop="title">
            <el-input v-model="invoice_form.title" placeholder="请填写您营业执照上的全称" />
          </el-form-item>
          <el-form-item label="发票类型" prop="invoiceType">
            <el-radio-group v-model="invoice_form.invoiceType">
              <el-radio label="company_general_vat_invoice">增值税普通发票</el-radio>
              <el-radio label="special_vat_invoice">增值税专用发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="税务登记号" prop="registerNo">
            <el-input v-model="invoice_form.registerNo" placeholder="请填写您税务登记证上的编号" />
          </el-form-item>
          <el-form-item label="基本开户银行名称" prop="bank">
            <el-input v-model="invoice_form.bank" placeholder="请填写您开户许可证上的开户银行" />
          </el-form-item>
          <el-form-item label="基本开户账号" prop="bankNo">
            <el-input v-model="invoice_form.bankNo" placeholder="请填写您开户许可证上的银行账号" />
          </el-form-item>
          <el-form-item label="注册场所地址" prop="operatingLicenseAddress">
            <el-input v-model="invoice_form.operatingLicenseAddress" placeholder="请填写您营业执照上的注册地址" />
          </el-form-item>
          <el-form-item label="注册固定电话" prop="operatingLicensePhone">
            <el-input v-model="invoice_form.operatingLicensePhone" placeholder="请填写您公司有效的联系电话" />
          </el-form-item>
          <el-form-item v-if="invoice_form.invoiceType === 'special_vat_invoice'" label="一般纳税人资格凭证" prop="generalTaxpayerQualificationCertificateId">
            <div v-if="!generalTaxpayerQualificationCertificateUrl" class="flex" style="margin-bottom: 10px;">
              <div>示例</div>
              <div class="flex-item flex">
                <el-image :src="require('@/assets/invoice_certificate1.png')" class="img-thumbnail" fit="cover" :preview-src-list="[require('@/assets/invoice_certificate1.png')]" style="margin-left: 10px" />
                <el-image :src="require('@/assets/invoice_certificate2.png')" class="img-thumbnail" fit="cover" :preview-src-list="[require('@/assets/invoice_certificate2.png')]" style="margin-left: 10px" />
              </div>
            </div>
            <el-image v-if="generalTaxpayerQualificationCertificateUrl" :src="generalTaxpayerQualificationCertificateUrl" class="img-thumbnail" fit="cover" :preview-src-list="[generalTaxpayerQualificationCertificateUrl]" />
            <el-upload
              action="#"
              accept="image/*"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="uploading" type="success" size="medium">上传</el-button>
            </el-upload>
            <!-- <el-input v-model="invoice_form.generalTaxpayerQualificationCertificateId" /> -->
            <p class="help-block">
              尺寸：小于5MB，格式：png，jpg<br>
              一般纳税人资格凭证为下列材料之一：<br>
              - 经主管税务机关下发的《一般纳税人资质认定税务通知书》，或；<br>
              - 经主管税务机关核对后退还给贵司留存的《增值税一般纳税人资格登记表》（注：主管税务机关需签字并盖章同意），或；<br>
              - 从（省/当地）电子税务局网站上查询到的带有完整公司名称的一般纳税人资质截屏；<br>
            </p>
          </el-form-item>
          <el-form-item label="选择发票收件地址" prop="addressId">
            <el-select v-model="invoice_form.addressId" clearable filterable>
              <el-option
                v-for="item in crud.data"
                :key="item.id"
                :value="item.id"
                :label="`${item.provinceName}, ${item.cityName}, ${item.districtName} ${item.addr}, ${item.name}, ${item.phone}`"
              >
                <span>{{ `${item.provinceName}, ${item.cityName}, ${item.districtName} ${item.addr}, ${item.name}, ${item.phone}` }} </span>
              </el-option>
            </el-select>
            <p class="help-block">列表中没有想要的地址？<el-button type="text" @click="crud.toAdd()">点击新建地址</el-button></p>
          </el-form-item>
        </el-form>
        <el-divider />
        <el-button :loading="submitting" type="success" @click="submit">{{ $route.name === 'InvoiceNew' ? '创建发票' : '保存' }}</el-button>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="地区" prop="city">
          <!-- <el-input v-model="form.code" /> -->
          <el-cascader
            v-model="regionArray"
            :options="regionData"
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="form.addr" type="textarea" />
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch v-model="form.isDefault" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/bank_card.vue'
import invoice from '@/api/invoice'
import addresses from '@/api/addresses'
import dict_region from '@/api/dict_region'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import amazon from '@/api/amazon'

const defaultForm = {
  name: null,
  phone: null,
  province: null,
  city: null,
  district: null,
  addr: null,
  isDefault: true
}

export default {
  components: {
    tabs
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '地址', url: '/lmp/v2/admin/address', size: 100, crudMethod: { ...addresses }})
  },

  data() {
    return {
      submitting: false,
      uploading: false,
      invoice_rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        invoiceType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        registerNo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      invoice_form: {
        title: null,
        invoiceType: 'company_general_vat_invoice',
        registerNo: null,
        addressId: null,
        bank: null,
        operatingLicensePhone: null,
        bankNo: null,
        operatingLicenseAddress: null,
        generalTaxpayerQualificationCertificateId: null
      },
      generalTaxpayerQualificationCertificateUrl: null,
      regionArray: [],
      regionData: [],
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账务设置' }])
    this.crud.refresh()
    dict_region.tree().then(response => {
      this.regionData = response.data.children
    })
    if (this.$route.name === 'InvoiceEdit') {
      invoice.show().then(({ data }) => {
        this.invoice_form = data
        this.generalTaxpayerQualificationCertificateUrl = data.generalTaxpayerQualificationCertificateUrl
      })
    }
  },
  methods: {
    [CRUD.HOOK.beforeToCU](crud, form) {
      if (form.provinceDict && form.cityDict && form.districtDict) {
        this.regionArray = [form.provinceDict.id, form.cityDict.id, form.districtDict.id]
      }
    },
    [CRUD.HOOK.beforeValidateCU](crud, form) {
      this.form.province = this.regionArray[0]
      this.form.city = this.regionArray[1]
      this.form.district = this.regionArray[2]
    },
    submit() {
      this.$refs['invoiceForm'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'InvoiceEdit' ? 'edit' : 'add'
          invoice[action](this.invoice_form).then(async({ data }) => {
            this.submitting = false
            this.$router.push({ name: 'Invoice' })
          }).catch(fail => {
            this.submitting = false
          })
        }
      })
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      amazon.tmp(formData).then(({ data }) => {
        this.invoice_form.generalTaxpayerQualificationCertificateId = data.id
        this.generalTaxpayerQualificationCertificateUrl = data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-cascader {
    width: 100%;
  }
}
.img-thumbnail {
  width: 100px;
  height: 100px;
}
</style>
