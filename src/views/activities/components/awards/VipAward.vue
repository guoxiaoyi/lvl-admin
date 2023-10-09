<template>
  <div>
    <el-form-item label="会员等级" prop="vipLevelIds" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
      <el-select v-model="_award_form.form.vipLevelIds" multiple>
        <el-option
          v-for="item in vipLevels"
          :key="item.id+'levels'"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import CustomPercentage from './CustomPercentage.vue'
import vip_level from '@/api/vip_level'

const defaultForm = {
  vipLevelIds: []
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage
  },
  data() {
    return {
      vipLevels: []
    }
  },
  mounted() {
    vip_level.list().then(response => {
      this.vipLevels = response.data
    })
    if (this._award_form.action === 'add') {
      Object.keys(defaultForm).forEach(k => {
        this._award_form.form[k] = defaultForm[k]
      })
    }
  }
}
</script>
