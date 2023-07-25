<template>
  <div>
    <el-form ref="form" label-width="68px">
      <el-form-item label="选择模板" class="content-full">
        <el-radio-group v-model="values.block">
          <el-radio label="goods_group_img">大图</el-radio>
          <el-radio label="goods_group">一行两个</el-radio>
          <el-radio label="goods_group_one_column">一行一个</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="添加商品" class="content-full">
        <el-radio-group v-model="values.data.style">
          <el-radio label="item">商品</el-radio>
          <el-radio label="group">分组</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="values.data.style === 'item'" label="选择商品" class="content-full">
        <div v-for="(item, index) in values.data.items" :key="index" class="goods-item-preview">
          <router-link :to="{ name: 'StoreGoodShow', params: { id: item.id }}" target="_blank">
            <img v-if="item.image.indexOf('http') === 0" :src="item.image">
            <custom-img :image="picture(item)" :size="{width: '50px', height: '50px' }" />
            <!-- <img v-else :src="require('@/assets/default_images/'+item.image)"> -->
          </router-link>

          <span class="goods-item-delete" @click="delGoodsItem(item, index)">
            <i class="el-icon-close" />
          </span>
        </div>
        <div class="goods-item-add goods-item--disable-drag" @click="modal.show = true"> + </div>
      </el-form-item>
      <el-form-item v-if="values.data.style === 'group'" label="礼品分组" class="content-full">
        <el-select v-model="form.groupIds" filterable @change="selectGroup">
          <el-option v-for="item in groups" :key="item.id + 'groups'" :label="item.name" :value="item.id" />
        </el-select>
        <div class="selected_goods_wrapper">
          <div v-for="(item, index) in group_names" :key="index + ((new Date()).getTime()) + 'group'" class="flex add-item">
            <span class="add-group-text">{{ item }}</span>
            <span class="remove-item" @click="delGoodsGroup(item, index)">
              <i class="el-icon-close" />
            </span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      v-if="modal.show"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      width="800px"
      top="10vh"
    >
      <div slot="title">
        <div class="tabs-nav">
          <div> 已上架商品 </div>
          <div class="form-search" style="display: block;">
            <input v-model="query.blurry" type="text">
            <button @click="crud.toQuery()">搜索</button>
          </div>
        </div>
      </div>
      <div class="table-bordered">
        <el-table v-loading="crud.loading" :data="crud.data">
          <el-table-column label="标题">
            <template slot-scope="scope">
              <el-checkbox v-model="form.ids" :label="scope.row.id" @change="checked => change(checked, scope.row)">
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
              </el-checkbox>
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
      <div slot="footer" class="text-center" style="padding: 10px 0;">
        <el-button type="success" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import DialogPagination from '@crud/DialogPagination'
import CustomImg from '@/components/Image/goods'
import group from '@/api/group'
import store_goods from '@/api/store_goods'

export default {
  components: { DialogPagination, CustomImg },
  filters: {

  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '商品管理', url: '/lmp/v2/admin/store_goods', params: { onSale: true }, size: 6 })
  },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPar: ['Good::Transfer', 'Good::CashGood', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::MobileFee', 'Good::RedPack'],
      modal: {
        show: false
      },
      form: { ids: [], datas: [], groupIds: null },
      groups: [],
      api_goods: []
    }
  },

  computed: {
    group_names() {
      return this.values.data.group_name ? this.values.data.group_name.split(',') : []
    }
  },
  watch: {
    'modal.show'(newValue) {
      if (newValue) {
        if (this.values.data.items) {
          this.form.ids = Object.values(this.values.data.items).map(i => parseInt(i.id))
          this.form.datas = Object.values(this.values.data.items)
        } else {
          this.values.data.items = {}
        }
      } else {
        this.form.ids = []
        this.form.datas = []
      }
    }
  },

  mounted() {
    this.crud.refresh()
    group.index({ size: 1000, sort: 'createdAt,desc' }).then(response => {
      this.groups = response.data.content
    })
    const { items } = this.values.data

    if (items) {
      this.getGoodsList(Object.values(items).map(i => i.id))
    }
  },
  methods: {
    getGoodsList(data) {
      store_goods.index({ ids: data, size: data.length }).then(({ data }) => {
        this.api_goods = data.content
      })
    },
    add() {

    },
    change(checked, data) {
      if (checked) {
        this.form.datas.push({ id: data.id, image: data.imageList[0]['url'], name: data.name })
      } else {
        this.form.datas = this.form.datas.filter(i => parseInt(i.id) !== parseInt(data.id))
      }
    },
    selectGroup(data) {
      const j = this.values.data.group_name || ''
      const i = this.values.data.group_id || ''
      if (this.trim(j.split(',')).length > 5 && this.trim(i.split(',')).length > 5) {
        this.$message.error('最多添加6个')
        return
      } else {
        // if (this.values.data.group_id.indexOf(current.val()) != -1){
        //     this.notice('请勿重复添加');
        //     return;
        //   }
        console.log(parseInt(data))
        console.log(this.values.data.group_id)
        this.values.data.group_name = this.trim(j.split(',')).concat(this.groups.find(item => item.id === parseInt(data)).name).join(',')
        this.values.data.group_id = this.trim(i.split(',')).concat(this.groups.find(item => item.id === parseInt(data)).id).join(',')
      }
    },
    async submit() {
      // this.values.data.items = {}
      const array = this.form.datas
      this.values.data.items = {}
      for (let index = 0; index < array.length; index++) {
        this.values.data.items[index] = array[index]
      }
      await this.getGoodsList(Object.values(this.values.data.items).map(i => i.id))
      this.modal.show = false
    },
    delGoodsItem(item, index) {
      delete this.values.data.items[index]
      this.$forceUpdate()
    },
    delGoodsGroup(item, index) {
      console.log(index, item)
      // let group_id = this.split_trim(info.data.group_id.split(','))
      // let group_name = this.split_trim(info.data.group_name.split(','))
      // let add_group_btn = ``

      // group_id.splice(_index, 1);
      // group_name.splice(_index, 1);
      // info.data.group_id = group_id.toString();
      // info.data.group_name = group_name.toString();
    },
    picture(data) {
      const item = this.api_goods.find(item => parseInt(item.id) === parseInt(data.id))
      const image = item ? item.imageList : []
      return image[0]
    },
    trim(arr) {
      return arr.filter(function(s) { return s && s.trim() })
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-item-preview {
  display: flex;
  position: relative;
  float: left;
  margin: 5px 10px 5px 0;
  width: 50px;
  height: 50px;
  box-shadow: 0 0 4px 0 rgba(10,42,97,0.2);
  background: #fff;
  a {
    display: block;
    height: 100%;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .goods-item-delete {
    position: absolute;
    width: 16px;
    height: 16px;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -8px;
    top: -8px;
    line-height: 16px;
    cursor: pointer;
    background-size: 35%;
    background-color: #999;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 50%;
    color: #FFF;
    font-size: 10px;
  }
}
.table-bordered {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  ::v-deep {
    .el-checkbox {
      display: flex;
      width: 100%;
      align-items: center;
    }
  }
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
.tabs-nav {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 30px;

  .form-search {
    width: 240px;
    height: 30px;
    position: relative;
    input[type='text'] {
      border: 1px solid #bbb;
      color: #333;
      font-size: 12px;
      border-radius: 2px;
      padding: 0 20px 0 10px;
      height: 30px;
      outline: 0;
      width: 190px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
    button {
      width: 50px;
      height: 30px;
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      border-radius: 2px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-family: inherit;
      border: 1px solid #F34541;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      cursor: pointer;
      transition: all .3s;
      background: #F34541;
      color: #FFF;
    }
  }
}
.add-group-text {
  font-size: 12px;
  line-height: 1.4;
}

</style>
