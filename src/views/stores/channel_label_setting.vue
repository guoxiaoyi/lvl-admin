<template>
  <div>
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          <h4>渠道别名设置说明：</h4>
          <ul>
            <li>1. 可进行各层级渠道别名设置，若不进行设置，则默认名称为【总部】、【一级渠道】、【二级渠道】、【三级渠道】、【终端店】。</li>
            <li>2. 若进行别名更改，可选择【汉字】、【数字】、【字母】、【下划线】进行编辑，别名最多可使用5个字符。</li>
          </ul>
        </div>

        <el-table :data="crud.data" :loading="crud.loading">
          <el-table-column label="渠道类型" prop="typeName"></el-table-column>
          <el-table-column label="渠道别名" prop="label"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :loading="crud.status.cu === 2" @click="crud.toEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title" width="580px">
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-form-item label="渠道">
          <b>{{form.typeName}}</b>
        </el-form-item>
        <el-form-item label="渠道别名" prop="label">
          <el-input :maxlength="5" v-model="form.label"></el-input>
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
const defaultForm = {
  label: null,
  type: null
}
import channel_setting from '@/api/channel_setting'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import tab from "@/components/Tabs/settings.vue";
export default {
  components: {
    tab
  },
  data(){
    return {
      rules: {
        name: [
          { type: true, message: '类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '渠道类型设置', url: '/lmp/admin/api/channel_label_setting', props: {noParams: true}, crudMethod: { ...channel_setting }})
  },

  mounted(){
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      {title: '渠道设置'},
      {title: '渠道类型设置', path: {name: 'ChannelNew'}},
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
