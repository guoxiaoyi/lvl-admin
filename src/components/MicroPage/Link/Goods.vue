<template>
  <div>
    <div class="table-bordered">
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="标题">
          <template slot-scope="scope">
            <el-radio v-model="form.id" :label="scope.row.id" @input="change">
              <div class="flex items-center">
                <custom-img :image="scope.row.imageList[0]" :size="{width: '30px', height: '30px' }" />
                <div style="margin-left: 10px;">
                  <router-link :to="{name: 'StoreGoodShow', params: {id: scope.row.id}}" class="name">
                    {{ scope.row.name }}
                  </router-link>
                  <span v-if="showPar.includes(scope.row.type)" class="text-muted">金额：{{ scope.row.par.toFixed(2) }} 元</span>
                  <span v-if="scope.row.pointsPar > 0" class="text-muted"> 积分额：{{ scope.row.pointsPar.toFixed(2) }} </span>
                </div>
              </div>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180px" prop="createdAt" />
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <router-link target="_blank" :to="{name: 'StoreGoodShow', params: {id: scope.row.id}}">
              预览
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DialogPagination :size="6" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import DialogPagination from '@crud/DialogPagination'
import CustomImg from '@/components/Image/goods'

export default {
  components: { DialogPagination, CustomImg },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '商品管理', url: '/lmp/v2/admin/store_goods', params: { onSale: true }, size: 6 })
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPar: ['Good::Transfer', 'Good::CashGood', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::MobileFee', 'Good::RedPack']
    }
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    change(val) {
      this.form.link_name = this.crud.data.find(item => item.id === val).name
    }
  }
}
</script>

<style lang="scss" scoped>

.table-bordered {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  // display: box;
  -webkit-box-orient: vertical;
  width: 100%;
}

::v-deep {
  .el-radio {
    display: flex;
    width: 100%;
    align-items: center;
  }
}
</style>
