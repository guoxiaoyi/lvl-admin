<template>
  <div>
    <div v-if="checkPer(['product_list'])" class="panel-heading flex justify-content__space-between items-center" style="padding-bottom: 0;">
      <h4>
        <slot name="title">
          资质信息
        </slot>
      </h4>
      <el-button type="success" @click="crud.toAdd">
        <i class="fa fa-plus" /> 添加
      </el-button>
    </div>
    <div class="panel-body">
      <div class="panel panel-default table-responsive" style="margin-bottom: 0;">
        <el-table v-loading="crud.loading" :data="crud.data">
          <el-table-column label="编号" width="80px" type="index" />
          <el-table-column label="图片" width="140px">
            <template slot-scope="scope">
              <CustomImage :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px'}" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="描述" prop="desc" />
          <el-table-column v-if="checkPer(['product_list'])" label="操作" prop="action" width="120px">
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="imageList">
          <div style="display: flex; flex-wrap: wrap;">
            <el-card v-for="(image, index) in form.imageList" :key="index" shadow="always" class="slide-image" :body-style="{ padding: '0px', display: 'flex' }">
              <div class="delete-item" @click="removeSlideItem(image)">
                <i class="el-icon-delete-solid" />
              </div>
              <el-image class="image-item" :src="image.url" :preview-src-list="[form.imageList[index]]" fit="cover" />
            </el-card>
          </div>
          <editorImage type="success" @successCBK="setSlideImage" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" />
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
import pagination from '@crud/Pagination'
import CustomImage from '@/components/Image'
import product_qualification from '@/api/product_qualification'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'

const defaultForm = {
  code: '',
  imageIds: [],
  name: '',
  desc: '',
  imageList: [],
  productId: null
}
export default {
  components: {
    pagination,
    CustomImage,
    editorImage
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '资质信息', url: `/lmp/v2/admin/product/${this.parent.$route.params.id}/product_qualification`, crudMethod: { ...product_qualification }})
  },

  data() {
    return {
      rules: {
        name: [
          { required: true, message: `名称不能为空`, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: `描述不能为空`, trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    this.crud.refresh()
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
