<template>
  <div style="padding: 10px 20px;">
    <el-form label-width="80px" label-position="left">
      <CustomForm ref="customFieldsRef" :form.sync="form" :fields="result.data.customForm" edit="preview" />
      <div class="text-center">
        <div class="submit">提交</div>
      </div>
    </el-form>
    <slot name="config" />
    <slot name="functionBtn" />
  </div>
</template>

<script>
import CustomForm from '@/components/CustomForm'
export default {
  inject: ['_micro_page_edit_vm'],
  provide() {
    return {
      _micro_page_template_vm: this
    }
  },
  components: {
    CustomForm
  },
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: []
    }
  },
  computed: {
    result() {
      return this._micro_page_edit_vm['content'][this.index]
    }
  }
}
</script>

<style lang="scss" scoped>
.submit {
  width: 80%;
  text-align: center;
  line-height: 38px;
  border-radius: 30px;
  background: #F34541;
  margin: 25px auto 10px;
  color: #FFF;
  font-size: 14px;
}

</style>
