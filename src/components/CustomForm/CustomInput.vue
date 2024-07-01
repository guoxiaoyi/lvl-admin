<template>
  <el-form-item :label="label" :prop="name" :rules="[{ required: required, message: '请输入' + label, trigger: 'blur' }]">
    <el-input v-model="inputValue" @input="updateValue" />
    <p class="help-block"> {{ placeholder }} </p>
  </el-form-item>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    required: {
      type: Boolean,
      default: false
    },
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
    placeholder: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      inputValue: null
    }
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal
    }
  },
  created() {
    this.inputValue = this.value
  },
  methods: {
    updateValue() {
      this.$emit('input', this.inputValue)
    }
  }
}
</script>
