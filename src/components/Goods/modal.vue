<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      :before-close="handlerClose"
      width="960px"
      title="选择礼品"
      top="10vh"
    >
      <div class="list-header">
        <div class="category-group">
          <div v-for="cat in categories" :key="cat.key" class="category" :class="{ current: category === cat.key }" @click="category = cat.key">
            {{ cat.value }}
          </div>
        </div>
        <div>
          <el-button type="text" @click="crud.refresh()"><i class="fa fa-refresh" /> 刷新</el-button>
        </div>
      </div>
      <div class="flex">
        <el-form ref="filterForm" :inline="true" size="small" label-width="70px" class="select-product-form" @submit.native.prevent>
          <el-form-item label="关键词">
            <el-input v-model="query.blurry" />
          </el-form-item>
          <el-form-item v-if="!['point', 'suite_card'].includes(category)" label="类型">
            <el-select v-model="query.typeIn" placeholder="选择类型" :clearable="!(typeIn[category] && typeIn[category].length > 0)">
              <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="crud.toQuery()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to="{name: 'GoodsListNew'}" target="_blank" class="el-button el-button--success">新建礼品</router-link>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel panel-default">
        <el-table v-loading="crud.loading" :data="crud.data">
          <el-table-column label="礼品名称" prop="name" width="230px">
            <template slot-scope="scope">
              <div class="flex items-center">
                <custom-img :image="scope.row.imageList[0]" :size="{width: '30px', height: '30px' }" />
                <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name">
                  {{ scope.row.name }}
                </router-link>
                <span v-else class="name">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="category === 'red_pack'" label="红包类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'suite_card'" label="所属套卡" prop="suiteCardName" width="150px" />
          <el-table-column v-if="category === 'other'" label="礼品类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'coupon'" label="卡券类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'red_pack'" label="红包金额" prop="par" width="150px">
            <template slot-scope="scope">
              {{ toPrice(scope.row.par) }}元
            </template>
          </el-table-column>
          <el-table-column label="积分额" prop="pointsPar" />
          <el-table-column v-if="category !== 'suite_card'" label="自动确认" prop="autoConfirm">
            <template slot-scope="scope">
              {{ scope.row.autoConfirm ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="stockQuantity" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <slot name="action" :data="scope.row" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :size="8" />
    </el-dialog>
  </div>
</template>

<script>

/*
  2023-09-01 新增一种 suite_card 套卡
  礼品有四大类型:
    [{ key: 'red_pack', value: '红包' },
     { key: 'other', value: '礼品' },
     { key: 'point', value: '积分' },
     { key: 'coupon', value: '优惠券' },
     { key: 'suite_card', value: '套卡' }]
  props:
    show.sync: Boolean    控制组件显示
       except: Array      不显示哪些类型按钮, 数组中的元素为 四大类型中的key
       typeIn: Object     大分类下的小类 数据类型为 Object, key为四大类型中的 key(red_pack other point coupon)

  例:
    except: ['red_pack', 'other'] 不显示 红包, 礼品
    typeIn: { red_pack: [{ value: '小额红包', key: 'Good::CashGood' }] }
            该参数为满足只显示某个大类型下的小类, 当小类只有1个时，typeIn下拉不可清空
            例如： 只显示 红包 下的 小额红包
            接口查询条件为 category=red_pack&typeIn=Good::CashGood
*/
import CustomImg from '@/components/Image/goods'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/DialogPagination'
import goods from '@/api/goods'
const categories = [{ key: 'red_pack', value: '红包' }, { key: 'other', value: '礼品' }, { key: 'point', value: '积分' }, { key: 'coupon', value: '优惠券' }, { key: 'suite_card', value: '套卡' }]
export default {
  components: { pagination, CustomImg },
  mixins: [presenter(), header(), crud()],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    except: {
      type: Array,
      default: () => { return [] }
    },
    typeIn: {
      type: Object,
      default: () => { return {} }
    },
    hasSuiteCard: {
      type: Boolean,
      default: false
    }
  },
  cruds() {
    return CRUD({ title: '礼品列表', url: '/lmp/v2/admin/gift_goods', query: { category: null, typeIn: null }, size: 8 })
  },
  data() {
    return {
      categories: [],
      category: null,
      typeList: []
    }
  },
  watch: {
    category(newValue) {
      const category = newValue === 'all' ? null : newValue
      this.crud.query.category = category
      if (this.typeIn[newValue] && this.typeIn[newValue].length === 1) {
        this.crud.query.typeIn = this.typeIn[newValue][0]['key']
      } else {
        this.crud.query.typeIn = null
      }
      this.crud.toQuery()
      this.initTypes(category)
    }
  },
  mounted() {
    this.categories = categories.filter(i => !this.except.includes(i.key))
    this.category = this.categories[0]['key']
    this.crud.query.category = this.category
    if (this.typeIn[this.category] && this.typeIn[this.category].length === 1) {
      this.crud.query.typeIn = this.typeIn[this.category][0]['key']
    }
    // this.crud.refresh()
    // this.initTypes(this.category)
  },
  methods: {
    initTypes(category = null) {
      if (this.typeIn[category]) {
        this.typeList = this.typeIn[category]
      } else {
        goods.types({ category }).then(({ data }) => {
          this.typeList = data
        })
      }
    },
    handlerClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-left: 10px;
}
.category-group {
  .category {
    display: inline-block;
    background: #F4F4F4;
    border-radius: 4px;
    padding: 12px 14px;
    color: #333333;
    cursor: pointer;
    margin-right: 5px;
    &.current {
      background: #F34541;
      color: #FFF;
    }
  }
}
.list-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.select-product-form {
  display: flex;
  .el-form-item.el-form-item--small {
    display: inline-flex;
  }
}
</style>
