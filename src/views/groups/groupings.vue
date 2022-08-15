<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item style="width: 80%; margin-top: 1px">
          <el-select
            v-model="products"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="addStatus" type="success" @click="toAddGrouping">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="goods.content">
        <el-table-column prop="position" label="排序" width="50">
          <i class="fa fa-arrows" />
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.goodsDto.imageList.length > 0"
              :src="scope.row.goodsDto.imageList[0].small"
              fit="cover"
            />
            <el-image
              v-else
              fit="cover">
              <div slot="error" class="image-slot">
                <img src="@/assets/image_missing.png" alt="" style="width: 100%">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="goodsDto.name" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.goodsDto.onSale" type="success" effect="plain"> 已上架 </el-tag>
            <el-tag v-else type="warning" effect="plain"> 已下架 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="goodsDto.type" width="150" />
        <el-table-column label="价格" width="150">
          <template slot-scope="scope">
            {{ {cash: scope.row.goodsDto.cash, points: scope.row.goodsDto.points } | price }}
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="goodsDto.stockQuantity" width="100" />
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button v-loading="status" type="text" @click="doDelete(scope.row)">从分组中删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import group from '@/api/group'
import { getGoods } from '@/api/store_goods'
import { format_price } from '@/utils'
import Sortable from 'sortablejs'
export default {
  filters: {
    price(value) {
      return format_price(value)
    }
  },
  data() {
    return {
      goods: { },
      loading: false,
      status: false,
      products: [],
      options: [],
      addStatus: false
    }
  },
  mounted() {
    this.fetch()
    this.rowDrop()
  },
  methods: {
    fetch() {
      group.getGroupGoods({ groupId: this.$route.params.id, sort: 'position,asc' }).then(response => {
        this.goods = response
      })
    },
    rowDrop() {
      const _this = this
      this.$nextTick(() => {
        const tbody = document.querySelector('.el-table__body tbody')
        Sortable.create(tbody, {
          handle: '.fa-arrows',
          onEnd({ newIndex, oldIndex }) {
            group.groupGoodsSort({
              id: _this.goods.content[oldIndex].id,
              position: newIndex
            }).then(response => {
              _this.$message({
                message: '排序成功',
                type: 'success'
              })
              _this.goods = {}
              _this.fetch()
            })
          }
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        getGoods({ name: query }).then(response => {
          this.options = response.content.map(item => {
            return { value: item.id, label: item.name.toLowerCase() }
          })
        })
      } else {
        this.options = []
      }
    },
    doDelete(data) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.status = true
        group.delGrouping(data.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetch()
          this.status = false
        })
      }).catch(() => {
      })
    },
    toAddGrouping() {
      this.addStatus = true
      group.addGoodsToGroup({ groupId: this.$route.params.id, goodsList: this.products.map(s => { return { id: s } }) })
        .then(response => {
          this.addStatus = false
          this.fetch()
          this.products = []
          this.options = []
        })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-image{
    display: block;
    width: 50px;
    height: 50px;
  }
  .el-form-item__content, .el-select--small{
    width: 100%;
  }
}
</style>
