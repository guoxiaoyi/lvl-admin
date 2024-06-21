<template>
  <el-form-item :label="label" :prop="name" :rules="[{ required: required, message: '请输入' + label, trigger: ['blur'] }]">
    <el-checkbox-group v-model="checkboxValue" :name="name" @change="updateValue">
      <el-checkbox v-for="option in options" :key="option" :label="option">
        {{ option }}
      </el-checkbox>
    </el-checkbox-group>
    <p class="help-block"> {{ placeholder }} </p>
  </el-form-item>
</template>

<script>
export default {
  name: 'CustomCheckboxGroup',
  props: {
    value: {
      type: Array,
      required: true,
      default: () => { return [] }
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
      checkboxValue: []
    }
  },
  watch: {
    value(newVal) {
      this.checkboxValue = newVal
    }
  },
  created() {
    this.checkboxValue = this.value
  },
  methods: {
    updateValue() {
      this.$emit('input', this.checkboxValue)
    }
  }
}
</script>
