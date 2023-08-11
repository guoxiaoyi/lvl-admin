<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="收货人" prop="name">
              <template slot-scope="scope">
                {{ scope.row.name }} <el-tag v-if="scope.row.isDefault" effect="dark" type="success">默认</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="电话" prop="phone" />
            <el-table-column label="地址" prop="phone">
              <template slot-scope="scope">
                {{ scope.row.provinceName }} {{ scope.row.cityName }} {{ scope.row.districtName }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
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
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="地区" prop="city">
          <el-cascader
            v-model="regionArray"
            :options="regionData"
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="form.addr" type="textarea" />
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch v-model="form.isDefault" />
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
import tab from '@/components/Tabs/store_set.vue'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import dict_region from '@/api/dict_region'
import addresses from '@/api/addresses'
import { mapGetters } from 'vuex'
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
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '地址', url: '/lmp/v2/admin/address', sort: ['isDefault,desc'], crudMethod: { ...addresses }})
  },
  data() {
    return {
      regionArray: [],
      regionData: [],
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        city: [
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
      if (this.activeButton.show && this.activeButton.action === 'add_address') {
        this.crud.toAdd()
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '收货地址管理 ' }])
    this.crud.refresh()
    dict_region.tree().then(response => {
      this.regionData = response.data.children
    })
  },
  methods: {
    [CRUD.HOOK.beforeToCU](crud, form) {
      if (form.provinceDict && form.cityDict && form.districtDict) {
        this.regionArray = [form.provinceDict.id, form.cityDict.id, form.districtDict.id]
      }
    },
    [CRUD.HOOK.beforeValidateCU](crud, form) {
      this.form.province = this.regionArray[0]
      this.form.city = this.regionArray[1]
      this.form.district = this.regionArray[2]
      // this.regionArray = [form.provinceDict.id, form.cityDict.id, form.districtDict.id]
    },
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

<style lang="scss" scoped>
::v-deep {
  .el-cascader {
    width: 100%;
  }
}
</style>
