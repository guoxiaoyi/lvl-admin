<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active">
        <a aria-current="page" href="javascript:void(0)">单码替换</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @keyup.enter.native="crud.toQuery()">
            <div class="date-picker">
              <el-form-item label="操作时间">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery()" />
              </el-form-item>
            </div>
            <el-form-item label="原追溯码">
              <el-input v-model="query.sourceSn" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="新追溯码">
              <el-input v-model="query.targetSn" placeholder="请输入" clearable />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="sourceSn" label="原追溯码" />
            <el-table-column prop="targetSn" label="新追溯码" />
            <el-table-column prop="createdAt" label="操作时间" />
            <el-table-column prop="operatorName" label="操作人" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <div class="alert alert-info">
        包装上追溯码出现缺损、毁坏、或者被抽检时，可以使用本功能替换已缺损、毁坏、无法识别的追溯码，替换成功后，被着换的旧码会自动失效，请谨慎操作。
      </div>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="原追溯码" prop="sourceSn">
          <el-input v-model="form.sourceSn" />
        </el-form-item>
        <el-form-item label="新追溯码" prop="targetSn">
          <el-input v-model="form.targetSn" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
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
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/MorePagination'
import { mapGetters } from 'vuex'
import unit_replace_api from '@/api/unit_replace'
const defaultForm = {
  name: null,
  phone: null,
  province: null,
  city: null,
  district: null,
  addr: null,
  isDefault: true
}

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '追溯码替换', url: '/lmp/v2/admin/unit_replace', crudMethod: { ...unit_replace_api }})
  },
  data() {
    return {
      rules: {
        sourceSn: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        targetSn: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  watch: {
    activeButton() {
      if (this.activeButton.show && this.activeButton.action === 't_unit_replace_new') {
        this.crud.toAdd()
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码替换' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterAddCancel]() {
      this.init_button()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.init_button()
    },
    init_button() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    }
  }
}
</script>

<style>

</style>
