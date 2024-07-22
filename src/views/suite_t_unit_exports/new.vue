<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 生成套码 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div id="level_t_unit_exports_new_help" class="alert alert-info collapse in" role="alert">
          <ul>
            <li>1. 追溯码最多支持四个层级，一级码为最小包装；根据指定的规格按套生成并建立关联，生成后会扣除二维码额度；</li>
            <li>2. 开启【关联活动码】后，会对一级码生成相应的活动码；活动码在新建活动时扣除额度，导出时不扣除。</li>
          </ul>
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="包装比例" prop="unitSpecId">
            <el-select v-model="form.unitSpecId" placeholder="请选择">
              <el-option v-for="item in labels" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <!-- <el-select v-model="form.unitSpecId" clearable filterable remote :remote-method="remoteMethod" :loading="searchLoading" reserve-keyword>
              <el-option v-for="(item, index) in tTnitSpecList" :key="index" :label="item.product.name" :value="item.id">
                <div class="flex items-center justify-content__center">
                  <el-image
                    v-if="item.product.imageList[0]"
                    style="width: 20px; height: 20px; margin-right: 5px"
                    :src="item.product.imageList[0]['url']"
                    fit="fit"
                  />
                  <el-image v-else style="width: 20px; height: 20px; margin-right: 5px" :src="require('@/assets/image_missing.png')" />
                  <div style="flex: 1">
                    {{ item.product.name }} {{ item.specLabel }}
                  </div>
                </div>
              </el-option>
            </el-select> -->
            <p class="help-block">请选择包装比例，没有要选择的包装比例，<router-link :to="{ name: 'ProductPackagingSpecs' }" target="_blank">点击新建</router-link></p>
          </el-form-item>
          <el-form-item label="生产批次" prop="unitBatchId">
            <el-select v-model="form.unitBatchId" clearable filterable remote :remote-method="remoteMethodBatch" :loading="searchBatchLoading" reserve-keyword>
              <el-option v-for="item in tUnitBatches" :key="item.code" :label="item.code" :value="item.id" />
            </el-select>
            <p class="help-block">没有要选择的批次，<a target="blank" href="/admin/t_unit_batches/new">点击新建</a></p>
          </el-form-item>
          <el-form-item label="二维码余额">
            <el-statistic group-separator="," :value="account.store.unitsBalance" />
          </el-form-item>
          <el-form-item label="追溯码开始序号">
            {{ snStart }}
          </el-form-item>
          <el-form-item label="生成套数" prop="unitSpecAmount">
            <el-input v-model="form.unitSpecAmount" placeholder="请输入该批套码数量" onkeyup="value = value.replace(/^0|[^0-9]/g, '')">
              <template slot="append">套</template>
            </el-input>
            <p class="help-block">生成需要喷印或粘贴到包装上的套码数量</p>
          </el-form-item>
          <el-form-item label="关联活动码">
            <el-switch v-model="form.packUnitsEnabled" />
            <p class="help-block">开启后，同步生成并关联活动码，用于追溯码活动。</p>
          </el-form-item>
          <el-form-item v-if="form.unitSpecId" label="层级数量预览">
            <div class="panel panel-default" style="line-height: 1.4;">
              <table class="table table-bordered table-hover">
                <thead style="line-height: 1.4;">
                  <tr>
                    <th>规格层级单位</th>
                    <th v-for="(item, index) in levels_data.level_text" :key="index">{{ levels_data.levels_data[item]['label'] }}</th>
                    <td v-if="form.packUnitsEnabled">活动码</td>
                    <th>总计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>数量</td>
                    <td v-for="(item, index) in levels_data.level_text" :key="index">
                      {{ levels_data.levels_data[item]['quantity'] * form.unitSpecAmount || '-' }}
                    </td>
                    <td v-if="form.packUnitsEnabled">
                      {{ levels_data.levels_data[levels_data.level_text[levels_data.level_text.length-1]]['quantity'] * form.unitSpecAmount || '-' }}
                    </td>
                    <td>{{ total || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">确认生成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import suite_t_unit_exports from '@/api/suite_t_unit_exports'
import t_unit_spec from '@/api/t_unit_spec'
import t_unit_batches from '@/api/v2_t_unit_batches'
import spec_dict from '@/api/spec_dict'
import { sn_start } from '@/api/t_unit'

function calculateBoxQuantities(levelString) {
  const levels = levelString.split('x').map(Number)
  const quantities = {}
  let cumulativeProduct = 1
  const data = {
    levels_data: {},
    level_text: []
  }
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  // 单次循环遍历每个层级，从最内层到最外层
  for (let i = 0; i < levels.length; i++) {
    cumulativeProduct *= levels[i] // 更新累积乘积
    const index = levels.length - i
    quantities[`level${index}`] = {
      quantity: cumulativeProduct,
      label: `${chineseNumbers[index]}级`
    }
    data.level_text.push(`level${index}`)
  }
  data.levels_data = quantities
  const totalQuantity = Object.values(data.levels_data).reduce((sum, level) => {
    return sum + level.quantity
  }, 0)
  data.quantity = totalQuantity
  return data
}

export default {
  data() {
    return {
      form: {
        unitSpecId: null,
        unitBatchId: null,
        unitSpecAmount: null,
        packUnitsEnabled: false,
        note: null
      },
      searchLoading: false,
      searchBatchLoading: false,
      submitting: false,
      rules: {
        unitSpecId: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        unitSpecAmount: {
          required: true, message: '不能为空', trigger: 'blur'
        }
      },
      tTnitSpecList: [],
      tUnitBatches: [],
      snStart: null,
      levels_data: {
        levels_data: {},
        level_text: []
      },
      labels: []
    }
  },
  computed: {
    ...mapGetters(['account']),
    total() {
      let sum = this.levels_data.level_text.map(item => {
        return this.levels_data.levels_data[item].quantity * this.form.unitSpecAmount
      }).reduce(function(a, b) {
        return a + b
      }, 0)

      if (this.form.packUnitsEnabled) {
        sum += this.levels_data.levels_data[this.levels_data.level_text[this.levels_data.level_text.length - 1]]['quantity'] * this.form.unitSpecAmount
      }
      return sum
    }
  },
  watch: {
    'form.unitSpecId'(newValue) {
      if (newValue) {
        t_unit_batches.index({ specDictId: newValue, state: 'pending' }).then(response => {
          this.tUnitBatches = response.data.content
        })

        const level = this.labels.find(i => i.id === newValue)
        this.levels_data = calculateBoxQuantities(level.label)

        // t_unit_spec.levels_data({ id: newValue }).then(({ data }) => {
        //   this.levels_data = data
        // })
        // levels_data
        // {
        //   quantity: 7,
        // levels_data: {
        // level1: { quantity: 4, },
        // level3: { quantity: 1, },
        // level2: { quantity: 2, }
        // },
        //   level_text: [ level3, level2, level1 ]
        // }

        // this.form.unitBatchId = null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码生成', path: { name: 'SuiteTunitExportIndex' }},
      { title: '生成套码' }
    ])
    t_unit_spec.index().then(response => {
      this.tTnitSpecList = response.data.content
    })
    if (!this.account.store.hasUnitUnzipPwd) {
      this.$confirm('为了您的二维码数据安全，请先前往安全设置页面，设置二维码解压密码。', '安全提示', {
        confirmButtonText: '前往设置',
        showCancelButton: false,
        confirmButtonClass: '',
        closeOnClickModal: false,
        type: 'warning',
        center: true
      }).then(() => {
        this.$router.push({ name: 'StoreSecuritySetting' })
      }).catch(() => {
      })
    }
    sn_start().then(({ data }) => {
      this.snStart = data
    })
    spec_dict.list().then(({ data }) => {
      this.labels = data
    })
  },
  methods: {
    remoteMethod(query) {
      this.searchLoading = true
      setTimeout(() => {
        t_unit_spec.index({ name: query.toLowerCase() }).then(response => {
          this.searchLoading = false
          this.tTnitSpecList = response.data.content
        })
      }, 200)
    },
    remoteMethodBatch(query) {
      this.searchBatchLoading = true
      setTimeout(() => {
        t_unit_batches.index({ code: query, specDictId: this.form.unitSpecId, state: 'pending' }).then(response => {
          this.searchBatchLoading = false
          this.tUnitBatches = response.data.content
        })
      }, 200)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (confirm('确认并生成追溯码，会从您的账户中扣除相应二维码额度，且无法退还，请确认数量正确无误。')) {
            this.submitting = true
            suite_t_unit_exports.add(this.form).then(({ data }) => {
              this.$router.push({ name: 'SuiteTunitExportIndex' })
              this.submitting = false
            }).catch(fail => {
              this.submitting = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-statistic {
    color: #3c763d;
    font-size: 18px;
    font-weight: bold;
  }
  .el-input-group__prepend, .el-input-group__append {
    background: #EEE !important;
    border-color: #CCC !important;
    color: #555 !important;
  }
}
</style>
