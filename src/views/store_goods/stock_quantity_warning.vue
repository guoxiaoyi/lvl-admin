<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.blurry" placeholder="SKU或名称" />
            </el-form-item>
            <el-form-item label="上架状态">
              <el-select v-model="query.onSale" clearable>
                <el-option label="已上架" :value="true" />
                <el-option label="已下架" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="query.type" clearable>
                <el-option v-for="(item, index) in types" :key="index" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <TotalPage>
            <el-button type="success" size="mini" :disabled="selected.length === 0" @click="onSale(true)">上架</el-button>
            <el-button type="success" size="mini" :disabled="selected.length === 0" @click="onSale(false)">下架</el-button>
            <el-button type="success" size="mini" :disabled="selected.length === 0" @click="edit_group = true">修改分组</el-button>
          </TotalPage>
          <store-list :data="crud.data" :loading="crud.loading" @selectValue="setSelectedValue">
            <template slot="data" slot-scope="row">
              <el-button type="text" @click="crud.doDelete(row.data)">删除</el-button>
            </template>
          </store-list>
          <pagination />
          <el-dialog :visible.sync="edit_group" :close-on-click-modal="false" :before-close="cancel" :destroy-on-close="true">
            <div slot="title">
              <h4 class="model-title"> 修改分组 <small> 已选商品 {{ selected.length }}</small></h4>
            </div>
            <el-form label-width="80px">
              <el-form-item label="分组选择">
                <el-radio-group v-model="update_group_form.state">
                  <el-radio :label="false">新增(在原有分组上新增分组)</el-radio>
                  <el-radio :label="true">替换(以新选分组替换原有分组)</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="操作选择">
                <el-checkbox-group v-model="update_group_form.groupIds">
                  <el-checkbox v-for="item in groups" :key="item.id" :label="item.id">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" :loading="buttons.status.submit" @click="submit">保存</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/store_goods.vue'
import TotalPage from '@/components/Crud/TotalPage.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import crudGoods from '@/api/store_goods'
import storeList from '@/components/StoreGoods/list.vue'
import group from '@/api/group'
import store_goods from '@/api/store_goods'

export default {
  components: {
    pagination,
    TotalPage,
    storeList,
    tab
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '商品管理', url: '/lmp/v2/admin/store_goods/stock_quantity_warning_all', sort: 'createdAt,desc', crudMethod: { ...crudGoods }})
  },
  data() {
    return {
      types: [],
      selected: [],
      edit_group: false,
      update_group_form: {
        state: false,
        groupIds: []
      },
      buttons: {
        status: {
          submit: false
        }
      },
      groups: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商品列表', path: { name: 'StoreGoodIndex' }}
    ])
    group.index().then(response => {
      this.groups = response.data.content
    })
    store_goods.type().then(response => {
      this.types = response.data
    })
    this.crud.refresh()
  },
  methods: {
    setSelectedValue(data) {
      this.selected = data
    },
    submit() {
      this.buttons.status.submit = true
      const data = this.update_group_form
      data.goodsIds = this.selected.map(i => i.id)
      crudGoods.grouping(data).then(response => {
        this.crud.refresh()
        this.cancel()
      })
    },
    cancel() {
      this.edit_group = false
      this.buttons.status.submit = false
    },
    onSale(state) {
      const goodsIds = this.selected.map(i => i.id)
      crudGoods.on_sale({ state: state, goodsIds: goodsIds }).then(response => {
        this.$message({ message: '更新成功', type: 'success' })
        this.crud.refresh()
        this.cancel()
      })
    }
  }
}
</script>

<style>

</style>
