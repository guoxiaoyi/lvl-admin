<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-button type="success" :disabled="crud.page.total >= 20" @click="crud.toAdd">
          <i class="fa fa-plus" /> 添加流程
        </el-button>
        <i class="fa fa-info-circle" style="margin: 0px 3px;" />最多可以设置20个流程
      </div>
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="排序" width="50px" />
            <el-table-column label="流程名称" prop="name" />
            <el-table-column label="图片">
              <template slot-scope="scope">
                <CustomImage :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px'}" />
              </template>
            </el-table-column>
            <el-table-column label="流程描述" prop="desc" />
            <el-table-column prop="action" label="操作">
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
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片">
          <el-button type="success"><i class="fa fa-plus" /> 添加图片</el-button>
        </el-form-item>
        <el-form-item label="流程描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" />
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
import CustomImage from '@/components/Image'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import product from '@/api/product'
import product_process from '@/api/product_process'

const defaultForm = {
  desc: '',
  imageList: [],
  name: '',
  id: ''
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
    return CRUD({ title: '生产加工流程', url: `/lmp/admin/api/product/${this.parent.$route.params.id}/product_process`, crudMethod: { ...product_process }})
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: `流程名称不能为空`, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: `流程描述不能为空`, trigger: 'blur' }
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
    breadcrumb.push({ title: '生产加工流程' })
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
    }
  }
}
</script>
