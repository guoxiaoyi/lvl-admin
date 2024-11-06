<template>
  <div>
    <ScheduleTimeAble />
    <el-form-item label="地区规则">
      <div v-for="(region, index) in _award_form.form.regionRules" :key="region.key" class="flex form-flex">
        <div class="el-custom-input-group">
          <el-form-item style="flex: 0 0 320px">
            <el-cascader
              v-model="region.code"
              :options="regionData"
              :props="{ expandTrigger: 'hover', value: 'id', label: 'name', checkStrictly: true }"
              clearable
              placeholder="请选择地区"
              @change="cascaderChange($event, index)"
            />
          </el-form-item>
          <div class="el-input-group-addon">数量</div>
          <el-form-item :prop="'regionRules.' + index + '.quantity'" :rules="quantityRules">
            <el-input v-model="region.quantity" placeholder="奖品数量" />
          </el-form-item>
          <div class="el-input-group-addon">份</div>
        </div>
        <el-button class="del" @click="remove(region)">删除</el-button>
      </div>
      <div class="flex">
        <el-button :disabled="_award_form.form.regionRules.length > 9" type="success" @click="add">新增地点</el-button>
        <el-upload
          action="#"
          accept=".xlsx"
          :show-file-list="false"
          :http-request="uploadFile"
        >
          <el-button type="success" :loading="uploading" style="margin-left: 10px;">导入</el-button>
        </el-upload>
      </div>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import CustomPercentage from './CustomPercentage.vue'
import ScheduleTimeAble from './ScheduleTimeAble.vue'
import dict_region from '@/api/dict_region'
import * as XLSX from 'xlsx'

export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage,
    ScheduleTimeAble
  },
  data() {
    return {
      areaCode: [],
      regionData: [],
      formattedData: [],
      uploading: false,
      quantityRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        } }
      ]
    }
  },
  created() {
    dict_region.tree().then(response => {
      this.regionData = response.data.children
    })
    if (this._award_form.action === 'add') {
      this._award_form.form.regionRules = [{
        province: null,
        city: null,
        district: null,
        quantity: 0,
        code: []
      }]
    } else {
      const params = ['province', 'city', 'district']
      this._award_form.form.regionRules.forEach(item => {
        item.code = []
        params.forEach(i => {
          if (item[i]) {
            item.code.push(item[i])
          }
        })
      })
    }
  },
  methods: {
    add() {
      this._award_form.form.regionRules.push({
        province: null,
        city: null,
        district: null,
        quantity: 0,
        code: [],
        key: Date.now()
      })
    },
    remove(item) {
      var index = this._award_form.form.regionRules.indexOf(item)
      if (index !== -1) {
        this._award_form.form.regionRules.splice(index, 1)
      }
    },
    cascaderChange(e, index) {
      const params = ['province', 'city', 'district']

      params.forEach((k, i) => {
        this._award_form.form.regionRules[index][k] = e[i] || null
      })
    },
    uploadFile(params) {
      this.uploading = true
      const { file } = params
      if (file) {
        const reader = new FileReader()
        reader.onload = async(e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          await this.formatData(jsonData)
          this.formattedData.forEach(item => {
            this._award_form.form.regionRules.push(item)
          })
          this.uploading = false
        }
        reader.readAsArrayBuffer(file)
      }
    },
    formatData(jsonData) {
      // 忽略标题行，从第2行开始处理数据
      this.formattedData = jsonData.slice(1).map((row) => {
        // 检查是否为空行或数据不足
        if (row.length < 1 || !row[0]) {
          return null // 跳过不完整的数据行
        }
        // 分离省、市、区代码和数量
        const provinceCode = row[0] ? row[0].split('_')[1] : null
        const cityCode = row[1] ? row[1].split('_')[1] : null
        const districtCode = row[2] ? row[2].split('_')[1] : null
        const quantity = row[3] || null

        const code = []

        if (provinceCode) {
          code.push(provinceCode)
        }
        if (cityCode) {
          code.push(cityCode)
        }
        if (districtCode) {
          code.push(districtCode)
        }
        // 生成目标对象
        return {
          province: provinceCode,
          city: cityCode,
          district: districtCode,
          code,
          quantity: quantity
        }
      }).filter(item => item !== null) // 过滤掉空数据
    }
  }
}
</script>

<style lang="scss" scoped>
.form-flex {
  margin-bottom: 15px;
}
.el-custom-input-group {
  flex: 1;
}
::v-deep {
  .del {
    margin-left: 10px;
  }
}
</style>
