<template>
  <div>
    <el-form-item label="标签" prop="tagId" :rules="[{required: true, message: '标签不能为空', trigger: 'blur'}]">
      <el-select v-model="_award_form.form.tagId">
        <el-option
          v-for="(item, index) in userTags"
          :key="index +'_tags'"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import tags from '@/api/tag'
import CustomPercentage from './CustomPercentage.vue'
const defaultForm = {
  tagId: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage
  },
  data() {
    return {
      userTags: []
    }
  },
  mounted() {
    tags.all({ type: 'UserTag' }).then(({ data }) => {
      this.userTags = data
    })
    if (this._award_form.action === 'add') {
      Object.keys(defaultForm).forEach(k => {
        this._award_form.form[k] = defaultForm[k]
      })
    }
  }
}
</script>
