<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="tagForm">
          <el-form-item label="下单用户预设标签" prop="tagIds">
            <el-select
              v-if="loading"
              v-model="tagForm.tagIds"
              size="small"
              multiple
              filterable
              placeholder="请输入"
            >
              <el-option v-for="(item, index) in tags" :key="index" :label="item.name" :value="item.id" />
            </el-select>
            <p class="help-block"> 用户商城下单后，会给该用户打上相应的标签，或<el-button type="text" @click="crud.toAdd()">新建用户标签。</el-button> </p>
          </el-form-item>
          <hr>
          <el-button v-if="checkPer(['store_point_setting'])" type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/freight.vue'
import tag from '@/api/tag'
import point_store from '@/api/point_store'
import CRUD, { presenter, crud, form } from '@crud/crud'
const defaultForm = { name: null, type: 'UserTag' }
export default {
  components: {
    tab
  },
  mixins: [presenter(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '标签', url: '/lmp/admin/api/tag', sort: 'createdAt,asc', size: '200', crudMethod: { ...tag }})
  },
  data() {
    return {
      rules: {},
      tagForm: {
        tagIds: []
      },
      submitting: false,
      tags: [],
      loading: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商城设置' }
    ])
    await point_store.point_store_user_tags().then(response => {
      this.tagIds = response.data
      this.tagForm.tagIds = response.data.map(i => i.id)
    })
    await tag.all({ type: 'UserTag' }).then(response => {
      this.tags = response.data
    })
    const tags = []
    await this.tagIds.forEach(item => {
      if (!this.tags.map(t => t.id).includes(item)) {
        tags.push(item)
      }
    })
    this.tags = this.tags.concat(tags)
    this.loading = true
  },
  methods: {
    submit() {
      this.submitting = true
      point_store.point_store_user_tags_setting(this.tagForm).then(response => {
        this.submitting = false
        this.$message.success('保存成功')
      }).catch(_err => {
        this.submitting = false
      })
    },
    [CRUD.HOOK.afterSubmit]() {
      tag.all({ type: 'UserTag' }).then(response => {
        this.tags = response.data
      })
    }
  }
}
</script>
