<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        编辑分组
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="280px" class="block-form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="说明" prop="note">
          <el-input v-model="form.note" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="status" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import crudGroup from '@/api/group'
const defaultForm = {id: null, name: null, note: null}
export default {
  data() {
    return {
      form: {id: null, name: null, note: null},
      status: false,
      rules: {
        name: [
          { required: true, message: `请填写名称`, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if(this.$route.name === 'updateGroup') {
      crudGroup.show({id: this.$route.params.id}).then(response => {
        this.form = {
          id: response.id,
          name: response.name,
          note: response.note
        }
      })
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.status = true
          crudGroup[this.$route.name](this.form).then( response => {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            this.status = true
            this.$router.push({name: 'Groups'})
          })
        }
      })

    },
  }
}
</script>
