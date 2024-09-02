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
                    <p>{{ scope.row.specLabel || '-' }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单位/码级别" prop="tunitTypeText">
              <template slot-scope="scope">
                {{ scope.row.tunitTypeText || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="二维码类型" prop="qrType">
              <template slot-scope="scope">
                {{ scope.row.qrType | qrTypeFilter }}
              </template>
            </el-table-column>
            <el-table-column label="活动/序号">
              <template slot-scope="scope">
                <p v-if="scope.row.activityId">
                  <router-link :to="{ name: 'ActivityShow', params: { activityId: scope.row.activityId }}">
                    {{ scope.row.activityTitle }}
                  </router-link>
                </p>
                <p v-else>-</p>
                <p v-if="scope.row.qrType === 'TUnit'">
                  <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.tunitId }}">
                    {{ scope.row.tunitSnText }}
                  </router-link>
                </p>
                <p v-if="scope.row.qrType === 'Unit'">
                  <router-link :to="{ name: 'UnitShow', params: { id: scope.row.unitId }}">
                    {{ scope.row.unitSnText }}
                  </router-link>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" min-width="200px">
              <template slot-scope="scope">
                <div v-html="scope.row.note" />
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
  filters: {
    qrTypeFilter(str) {
      return { Unit: '活动码', TUnit: '追溯码' }[str] || str
    }
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
