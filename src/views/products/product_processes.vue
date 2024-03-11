<template>
  <div>
    <div v-if="checkPer(['product_list'])" class="panel-heading flex justify-content__space-between items-center" style="padding-bottom: 0;">
      <h4>
        <slot name="title">
          生产加工流程
        </slot>
      </h4>
      <el-button type="success" :disabled="crud.page.total >= 20" @click="crud.toAdd">
        <i class="fa fa-plus" /> 添加
      </el-button>
    </div>
    <div class="panel-body">
      <div class="panel panel-default table-responsive" style="margin-bottom: 0;">
        <el-table v-loading="crud.loading" :data="crud.data" class="processes">
          <el-table-column v-if="checkPer(['product_list'])" label="排序" width="80px" align="center">
            <i class="fa fa-arrows" />
          </el-table-column>
          <el-table-column label="图片" width="140px">
            <template slot-scope="scope">
              <CustomImage :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px'}" />
            </template>
          </el-table-column>
          <el-table-column label="流程名称" prop="name" />
          <el-table-column label="流程描述" prop="desc" />
          <el-table-column v-if="checkPer(['product_list'])" prop="action" label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click="crud.toEdit(scope.row)"> 编辑 </el-button>
              <span> - </span>
              <el-button type="text" @click="crud.doDelete(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
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
          <div style="display: flex; flex-wrap: wrap;">
            <el-card
              v-for="(image, index) in form.imageList"
              :key="index"
              shadow="always"
              class="slide-image"
              :body-style="{ padding: '0px', display: 'flex' }"
            >
              <div class="delete-item" @click="removeSlideItem(image)">
                <i class="el-icon-delete-solid" />
              </div>
              <el-image class="image-item" :src="image.url" :preview-src-list="[form.imageList[index]]" fit="cover" />
            </el-card>
          </div>
          <editorImage type="success" @successCBK="setSlideImage" />
        </el-form-item>
        <el-form-item label="流程描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="5" />
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
import CustomImage from '@/components/Image'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import product_process from '@/api/product_process'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import Sortable from 'sortablejs'

const defaultForm = {
  desc: '',
  imageList: [],
  name: '',
  id: '',
  imageIds: [],
  productId: null
}
export default {
  name: 'ProductProcesses',
  components: {
    CustomImage,
    editorImage
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  props: {
    title: {
      type: String,
      default: null
    }
  },
  cruds() {
    return CRUD({ title: this.propsData.title, url: `/lmp/v2/admin/product/${this.parent.$route.params.id}/product_process`, crudMethod: { ...product_process }, sort: 'position,asc' })
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
    this.crud.refresh()
    console.log()
    setTimeout(() => {
      this.$nextTick(() => {
        const _this = this
        const tbody = document.querySelector('.processes tbody')
        const sortable = Sortable.create(tbody, {
          handle: '.fa-arrows',
          onEnd({ newIndex, oldIndex }) {
            product_process.updatePosition({ ..._this.crud.data[oldIndex], position: newIndex }).then(response => {
              _this.$message({
                message: '排序成功',
                type: 'success'
              })
              _this.crud.refresh
            })
          }
        })
        console.log(sortable)
      }, 1000)
    })
  },
  methods: {
    [CRUD.HOOK.beforeToAdd]() {
      this.form.productId = this.$route.params.id
    },
    [CRUD.HOOK.beforeToEdit]() {
      delete this.form.createdAt
      delete this.form.position
      delete this.form.updatedAt
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.imageIds = this.form.imageList.map(img => img.id)
    },
    setSlideImage(image) {
      this.form.imageList.unshift(image)
    },
    removeSlideItem(current) {
      this.form.imageList = this.form.imageList.filter(image => image.id !== current.id)
    }

  }
}
</script>
<style scoped lang="scss">
.slide-image {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
  margin-bottom: 20px;
  .delete-item {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 4;
    color: #FFF;
    background: red;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
  }
  .image-item {
    width: 60px;
    height: 60px;
  }
}
::v-deep {
  .el-card + .el-card {
    margin-top: 0;
  }
  .el-card {
    margin-right: 15px;
  }
}
</style>
