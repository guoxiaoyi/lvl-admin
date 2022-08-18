<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-button type="success" @click="crud.toAdd">
          <i class="fa fa-plus" /> 添加原材料
        </el-button>
      </div>
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="编号" prop="code" />
            <el-table-column label="图片">
              <template slot-scope="scope">
                <CustomImage :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px'}" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" />
            <el-table-column label="供应商" prop="supplier" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.toEdit(scope.row)"> 编辑 </el-button>
                <span> - </span>
                <el-button type="text" @click="crud.doDelete(scope.row)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="imageList">
          <el-button type="success"><i class="fa fa-plus" /> 添加图片</el-button>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" />
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
import tab from '@/components/Tabs/product'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import product from '@/api/product'
import CustomImage from '@/components/Image'
import product_materials from '@/api/product_materials'
const defaultForm = {
  code: '',
  imageIds: [],
  name: '',
  supplier: ''
}
export default {
  components: {
    tab,
    pagination,
    TotalPage,
    CustomImage
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '原材料', url: `/lmp/admin/api/product/${this.parent.$route.params.id}/product_material`, crudMethod: { ...product_materials }})
  },

  data() {
    return {
      rules: {
        name: [
          { required: true, message: `名称不能为空`, trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: `供应商不能为空`, trigger: 'blur' }
        ],
        code: [
          { required: true, message: `编号不能为空`, trigger: 'blur' },
          { min: 2, message: `编号过短（最短为 2 个字符）`, trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    const breadcrumb = [
      { title: '产品列表', path: { name: 'ProductIndex' }}
    ]
    await product.show(this.$route.params.id).then(response => {
      this.result = response.data
      breadcrumb.push({ title: this.result.name, path: { name: 'ProductShow', params: { id: this.result.id }}})
    })
    breadcrumb.push({ title: '产品原材料' })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.beforeToAdd]() {
      this.form.id = this.$route.params.id
    },
    [CRUD.HOOK.beforeToEdit]() {
      delete this.form.createdAt
      delete this.form.position
      delete this.form.productId
      delete this.form.updatedAt
      delete this.form.imageList
    }
  }
}
</script>
