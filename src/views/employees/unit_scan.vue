<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'EmployeesShow'}"> <router-link :to="{name: 'EmployeesShow', params: {id: $route.params.id}}">员工详情</router-link> </li>
      <li :class="{'active': $route.name === 'RebateChildUser'}"><router-link :to="{name: 'RebateChildUser', params: {id: $route.params.id}}">关联用户</router-link> </li>
      <li :class="{'active': $route.name === 'RebateUnitScan'}"><router-link :to="{name: 'RebateUnitScan', params: {id: $route.params.id}}">关联产品</router-link> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="关联时间" prop="updatedAt" />
            <el-table-column label="产品/规格" prop="productName">
              <template slot-scope="scope">
                <div class="flex items-center">
                  <img v-if="scope.row.productImageUrl" class="product-image" :src="scope.row.productImageUrl">
                  <img v-else class="product-image" :src="require('@/assets/image_missing.png')">
                  <div style="margin-left: 10px;">
                    <router-link :to="{name: 'ProductShow', params: { id: scope.row.productId } }" class="product-name">
                      {{ scope.row.productName }}
                    </router-link>
                    <p>{{ scope.row.specLabel }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单位/码级别" prop="tunitTypeText" />
            <el-table-column label="追溯码">
              <template slot-scope="scope">
                <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.tunitId }}">
                  {{ scope.row.tunitSnText }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note">
              <template slot-scope="scope">
                {{ scope.row.note || '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import employee from '@/api/employee'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '员工列表', url: `/lmp/v2/admin/employee/${this.parent.$route.params.id}/unit_scan`, sort: 'id,desc', crudMethod: { ...employee }})
  },
  async mounted() {
    await employee.get(this.$route.params).then(response => {
      this.employee = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '员工列表', path: { name: 'EmployeesIndex' }},
      { title: this.employee.user.name || '员工详情' }
    ])
    this.crud.refresh()
  }
}
</script>

<style lang="scss" scoped>

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
p {
  margin: 0;
}
</style>
