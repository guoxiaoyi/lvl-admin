<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
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
            <el-select v-model="form.selectedLevel" placeholder="请选择层级">
              <el-option v-for="item in levels" :key="item" :label="item" :value="item" />
            </el-select>
            <p class="help-block">选择产品包装的层级，如：1箱X6瓶，包装层级对应"二级"</p>
            <div class="child-form">
              <el-form-item
                v-for="(item, index) in reversedLevels(form.selectedLevel)"
                :key="item"
                :label="`${item}级数量`"
                :prop="`quantities.${item - 1}`"
                :rules="[
                  { required: true, message: '数量不能为空且大于0', trigger: 'blur' },
                  { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
                ]"
              >
                <el-input v-if="index !== 0" v-model.number="form.quantities[item - 1]" placeholder="请输入数量" @input="updateOutput" />
                <el-input v-else v-model.number="form.quantities[item - 1]" :disabled="true" />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="包装比例关系">
            {{ output }}
          </el-form-item>
          <hr>
          <el-button type="success" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        selectedLevel: null,
        quantities: []
      },
      rules: {},
      levels: [4, 3, 2, 1],
      output: null,
      quantityRules: [
        { required: true, message: '数量不能为空且大于0', trigger: 'blur' },
        { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
      ]
    }
  },
  watch: {
    'form.selectedLevel'(newLevel) {
      if (newLevel) {
        this.form.quantities = Array(newLevel).fill(null) // 根据选择的层级动态设置数量数组长度
        this.form.quantities[newLevel - 1] = 1 // 设置最高级数量为1
        this.updateOutput();
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '包装比例管理' }
    ])
  },
  methods: {
    reversedLevels(level) {
      if (!level) return [];
      return this.levels.slice(this.levels.length - level);
    },
    updateOutput() {
      const selectedLevels = this.reversedLevels(this.form.selectedLevel);
      this.output = selectedLevels.map(level => this.form.quantities[level - 1]).join(' * ');
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateOutput();
          alert('表单提交成功');
        } else {
          alert('请确保所有数量均不为空且大于0');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
