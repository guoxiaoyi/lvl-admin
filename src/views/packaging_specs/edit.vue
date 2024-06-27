<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:">
          包装比例管理
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info">
          1. 追溯码最多支持四个层级，一级为最小包装；本包装层级可使用在各产品中，层级单位可在各产品中定义；<br>
          2. 层级包装数量表示上一级包装中本层级包装的个数，例如1箱X6盒X12瓶，二级包装数量填写6，一级包装数量填写12。
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="包装层级">
            <el-select v-model="form.type" placeholder="请选择层级">
              <el-option v-for="item in levels" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
            <p class="help-block">选择产品包装的层级，如：1箱X6瓶，包装层级对应"二级"</p>
            <div class="child-form">
              <el-form-item v-if="['level4'].includes(form.type)" label="四级" prop="level4Num" :rules="[{ required: true, message: '数量不能为空且大于0', trigger: 'blur' }, { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }]">
                <el-input v-model.number="form.level4Num" :disabled="form.type === 'level4'" @input="output" />
              </el-form-item>

              <el-form-item v-if="['level4', 'level3'].includes(form.type)" label="三级" prop="level3Num" :rules="[{ required: true, message: '数量不能为空且大于0', trigger: 'blur' }, { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }]">
                <el-input v-model.number="form.level3Num" :disabled="form.type === 'level3'" @input="output" />
              </el-form-item>

              <el-form-item v-if="['level2', 'level3', 'level4'].includes(form.type)" label="二级" prop="level2Num" :rules="[{ required: true, message: '数量不能为空且大于0', trigger: 'blur' }, { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }]">
                <el-input v-model.number="form.level2Num" :disabled="form.type === 'level2'" @input="output" />
              </el-form-item>

              <el-form-item label="一级" prop="level1Num" :rules="[{ required: true, message: '数量不能为空且大于0', trigger: 'blur' }, { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }]">
                <el-input v-model.number="form.level1Num" :disabled="form.type === 'level1'" @input="output" />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="包装比例关系">
            {{ outputText }}
          </el-form-item>
          <hr>
          <el-button type="success" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import spec_dict from '@/api/spec_dict'

export default {
  data() {
    return {
      form: {
        type: null,
        level1Num: null,
        level2Num: null,
        level3Num: null,
        level4Num: null
      },
      rules: { },
      levels: [],
      outputText: null,
      loading: false
    }
  },
  watch: {
    'form.type'(newLevel) {
      if (newLevel) {
        this.levels.forEach(i => {
          this.form[`${i.key}Num`] = null
        })
        this.form[`${newLevel}Num`] = 1
      }
      this.output()
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '包装比例管理' }
    ])
    spec_dict.type().then(({ data }) => {
      this.levels = data
    })
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          spec_dict.add(this.form).then(({ data }) => {
            this.loading = false
            this.$router.push({ name: 'ProductPackagingSpecs' })
          }).catch(fail => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    output() {
      const originalArray = this.levels.map(level => this.form[`${level.key}Num`])
      console.log(originalArray)
      let index = 0

      // 找到第一个非null元素的位置
      while (index < originalArray.length && originalArray[index] === null) {
        index++
      }

      // 使用slice方法从第一个非null元素开始切割数组
      const filteredArray = originalArray.slice(index)

      // 输出: [1, null, null]
      this.outputText = filteredArray.join(' * ')
    }
  }
}
</script>
