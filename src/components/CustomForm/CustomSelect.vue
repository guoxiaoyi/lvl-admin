<template>
  <el-form-item :label="label" :prop="name" :rules="[{ required: required, message: '请输入' + label, trigger: ['blur', 'change'] }]">
    <el-select v-model="selectValue" clearable @change="updateValue">
      <el-option
        v-for="option in options"
        :key="option"
        :label="option"
        :value="option"
      />
    </el-select>
    <p class="help-block"> {{ placeholder }} </p>
  </el-form-item>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    value: {
      type: [String, Object],
      default: null
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectValue: null
    }
  },
  watch: {
    value(newVal) {
      this.selectValue = newVal
    }
  },
  created() {
    this.selectValue = this.value
  },
  methods: {
    updateValue() {
      this.$emit('input', this.selectValue)
    }
  }
}
</script>
