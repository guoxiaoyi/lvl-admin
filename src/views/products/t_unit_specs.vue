<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div v-if="checkPer(['t_unit_manage'])" class="panel-heading">
        <el-button type="success" :disabled="crud.page.total >= 20" @click="crud.toAdd">
          <i class="fa fa-plus" /> 新建包装规格
        </el-button>
      </div>
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="产品">
              <template slot-scope="scope">
                <ProductName :product="scope.row.product" :size="{width: '30px', height: '30px'}" />
              </template>
            </el-table-column>
            <el-table-column label="套码规格" prop="specLabel" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button v-if="checkPer(['t_unit_manage'])" type="text" @click="crud.toEdit(scope.row)"> 编辑 </el-button>
                <span v-if="scope.row.canDelete"> - </span>
                <el-button v-if="scope.row.canDelete" type="text" @click="crud.doDelete(scope.row)"> 删除 </el-button>
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
      width="860px"
    >
      <!--  0: {value: "四级套码（如：垛-箱-盒-瓶)", key: "TUnitSpecs::FourLevel"}
            1: {value: "三级套码（如：箱-盒-瓶)", key: "TUnitSpecs::ThreeLevel"}
            2: {value: "二级套码（如：盒-瓶)", key: "TUnitSpecs::TwoLevel"}
            3: {value: "一级套码（如：瓶)", key: "TUnitSpecs::OneLevel"} -->
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="套码层级" prop="type">
          <el-select v-model="form.type" placeholder="请选择" :disabled="crud.status.edit > 0">
            <el-option
              v-for="item in types"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <p class="help-block">选择产品包装的层级, 如: 1箱X6瓶, 对应"二级套码"</p>
        </el-form-item>
        <div class="child-form">
          <el-form-item v-if="['TUnitSpecs::FourLevel'].includes(form.type)" label="四级" prop="type" class="lon_lat" label-width="80px">
            <div class="el-input-group">
              <el-input v-model.number="form.level4Num" :disabled="form.type === 'TUnitSpecs::FourLevel'" />
              <span class="input-group-addon">-</span>
              <el-input v-model="form.level4Label" />
            </div>
          </el-form-item>

          <el-form-item v-if="['TUnitSpecs::ThreeLevel', 'TUnitSpecs::FourLevel'].includes(form.type)" label="三级" prop="type" class="lon_lat" label-width="80px">
            <div class="el-input-group">
              <el-input v-model.number="form.level3Num" :disabled="form.type === 'TUnitSpecs::ThreeLevel'" />
              <span class="input-group-addon">-</span>
              <el-input v-model="form.level3Label" />
            </div>
          </el-form-item>

          <el-form-item v-if="['TUnitSpecs::TwoLevel', 'TUnitSpecs::ThreeLevel', 'TUnitSpecs::FourLevel'].includes(form.type)" label="二级" prop="type" class="lon_lat" label-width="80px">
            <div class="el-input-group">
              <el-input v-model.number="form.level2Num" :disabled="form.type === 'TUnitSpecs::TwoLevel'" />
              <span class="input-group-addon">-</span>
              <el-input v-model="form.level2Label" />
            </div>
          </el-form-item>

          <el-form-item label="一级" prop="type" class="lon_lat" label-width="80px">
            <div class="el-input-group">
              <el-input v-model.number="form.level1Num" :disabled="form.type === 'TUnitSpecs::OneLevel'" />
              <span class="input-group-addon">-</span>
              <el-input v-model="form.level1Label" />
            </div>
          </el-form-item>

        </div>
        <el-form-item label="扫码减库存" prop="retailOutEnabled">
          <el-switch v-model="form.retailOutEnabled" />
          <p class="help-block">开启后, 用户扫关联的活动码减库存</p>
        </el-form-item>
        <div v-if="form.retailOutEnabled" class="child-form">
          <el-form-item label="默认库存单位">
            <el-select v-model="form.stockLevel" placeholder="请选择">
              <el-option
                v-for="item in [{key: 1, value: '一级'}, {key: 2, value: '二级'}, {key: 3, value: '三级'}, {key: 4, value: '四级'}]"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="扫码减库存">
            <el-input v-model="form.retailOutLimit">
              <template slot="prepend">库存单位中有</template>
              <template slot="append">个活动码被扫</template>
            </el-input>
            <p class="help-block">设定的默认库存单位中关联的活动码领奖数达到设定的数目后, 则扣除库存</p>
          </el-form-item>
        </div>
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
import ProductName from '@/components/Product/Name'
import product from '@/api/product'
import product_t_unit_specs from '@/api/product_t_unit_specs'
const defaultLevel = {
  level1Label: null,
  level1Num: null,
  level2Label: null,
  level2Num: null,
  level3Label: null,
  level3Num: null,
  level4Label: null,
  level4Num: null
}
const defaultForm = {
  ...defaultLevel,
  retailOutEnabled: false,
  retailOutLimit: null,
  stockLevel: 4,
  type: null
}

export default {
  components: {
    tab,
    pagination,
    TotalPage,
    ProductName
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '包装规格', url: `/lmp/admin/api/product/${this.parent.$route.params.id}/t_unit_specs`, crudMethod: { ...product_t_unit_specs }})
  },
  data() {
    return {
      types: [],
      rules: {

      }
    }
  },
  watch: {
    'form.type'() {
      if (this.crud.status.add > 0) {
        switch (this.form.type) {
          case 'TUnitSpecs::FourLevel': {
            Object.keys(defaultLevel).forEach(i => {
              this.form[i] = null
            })
            this.form.level4Num = 1
            break
          }
          case 'TUnitSpecs::ThreeLevel': {
            Object.keys(defaultLevel).forEach(i => {
              this.form[i] = null
            })
            this.form.level3Num = 1
            break
          }
          case 'TUnitSpecs::TwoLevel': {
            Object.keys(defaultLevel).forEach(i => {
              this.form[i] = null
            })
            this.form.level2Num = 1
            break
          }
          case 'TUnitSpecs::OneLevel': {
            Object.keys(defaultLevel).forEach(i => {
              this.form[i] = null
            })
            this.form.level1Num = 1
            break
          }
        }
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
    breadcrumb.push({ title: '包装规格管理' })

    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
    product_t_unit_specs.type().then(response => {
      this.types = response.data
    })
  },
  methods: {
    [CRUD.HOOK.beforeToAdd]() {
      this.form.type = 'TUnitSpecs::FourLevel'
      this.form.id = this.$route.params.id
    },
    [CRUD.HOOK.beforeSubmit]() {
      switch (this.form.type) {
        case 'TUnitSpecs::ThreeLevel': {
          delete this.form.level4Label
          delete this.form.level4Num
          break
        }
        case 'TUnitSpecs::TwoLevel': {
          delete this.form.level4Label
          delete this.form.level4Num
          delete this.form.level3Label
          delete this.form.level3Num
          break
        }
        case 'TUnitSpecs::OneLevel': {
          delete this.form.level4Label
          delete this.form.level4Num
          delete this.form.level3Label
          delete this.form.level3Num
          delete this.form.level2Label
          delete this.form.level2Num
          break
        }
      }
      ['canDelete', 'createdAt', 'product', 'productId', 'specLabel', 'updatedAt'].forEach(k => {
        delete this.form[k]
      })
    }
  }
}
</script>
<style scoped lang="scss">
.child-form {
  margin-left: 120px;
  padding: 10px;
  width: calc(80% + 10px);
}
::v-deep {

  .lon_lat .el-form-item__content .el-input-group,
  .el-address .el-form-item__content {
    display: flex;
  }
  .lon_lat .el-input:first-child .el-input__inner{
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .lon_lat .el-input:last-child .el-input__inner{
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .lon_lat .input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lon_lat {
    margin-right: 150px;
  }
  .lon_lat+.lon_lat {
    margin-left: 50px;
    margin-right: 100px;
  }
  .lon_lat+.lon_lat+.lon_lat {
    margin-left: 100px;
    margin-right: 50px;
  }
  .lon_lat+.lon_lat+.lon_lat+.lon_lat {
    margin-left: 150px;
    margin-right: 0px;
  }
}
</style>
