<template>
  <div ref="appContainer" class="app-container">
    <el-card>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-row type="flex" justify="space-between">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="categoryId" placeholder="全部商品分类" clearable class="giftCategory">
                <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="blurry" placeholder="请输入内容" class="">
                <template slot="append">
                  <div class="append-btn">
                    <el-button type="warning" icon="el-icon-search" class="search" @click="search" />
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-dropdown @command="sortPrice">
              <span class="el-dropdown-link">
                价格排序<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sellingPrice,asc">从低到高</el-dropdown-item>
                <el-dropdown-item command="sellingPrice,desc">从高到低</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-row>
      </el-form>
      <el-divider />
      <div class="gifts">
        <el-card v-for="(gift, index) in list" :key="index" :body-style="{ padding: '0px', width: '262px'}" class="item" shadow="never">
          <router-link :to="{ name: 'GiftShow', params: { id: gift.id } }">
            <el-image :src="gift.slideImage[0].globalImage.url" class="image" fit="cover" />
          </router-link>
          <div style="padding: 13px;">
            <span class="gift-name">{{ gift.name }}</span>
            <div class="bottom">
              <div>
                <span class="selling-price">￥{{ gift.sellingPrice }}</span>
                <span class="purchasing-price">{{ gift.refPrice }}元</span>
              </div>
              <el-dropdown size="medium" @command="addListItem">
                <el-button type="primary" size="small"> 添加 </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="gift.activityGoods"
                    :command="`activity_good;${gift.id}`"
                  >
                    活动礼品列表
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="gift.storeGoods"
                    :command="`store_good;${gift.id}`"
                  >
                    商城商品列表
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </div>
      <div class="lifanli-pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[20, 50, 100]"
          :total="totalElements"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import { getGift, getGiftType } from '@/api/gift'
import { postGoods } from '@/api/goods'
import { deleteEmptyProperty } from '@/utils'

export default {
  data() {
    return {
      blurry: null,
      list: [],
      categories: [],
      categoryId: null,
      totalElements: 0,
      pageSize: 20,
      currentPage: 0,
      pageHeight: 0,
      sort: 'createdAt,desc'
    }
  },
  watch: {
    categoryId() {
      this.search()
    },
    pageSize() {
      this.fetch()
    },
    sort() {
      this.fetch()
    }
  },
  async mounted() {
    const query = this.$route.query
    this.categoryId = parseInt(query.categoryId) || null
    this.blurry = query.blurry
    await this.fetch()
    await getGiftType().then(response => {
      this.categories = response
      this.categories.unshift({ name: '全部商品分类', id: 0 })
    })
    const _this = this
    setTimeout(function() {
      _this.pageHeight = _this.$refs.appContainer.offsetHeight
      console.log(`data: ${_this.pageHeight}`)
      window.parent.postMessage({
        cmd: 'returnHeight',
        params: {
          success: true,
          data: _this.pageHeight
        }
      }, '*')
    }, 500)
    console.log(`pageHeight: ${_this.$refs.appContainer.offsetHeight}`)
  },
  methods: {
    addListItem(command) {
      const params = command.split(';')
      const goods = { 'activity_good': { name: '礼品列表', url: '/admin/goods' }, 'store_good': { name: '商品列表', url: '/admin/store_goods' }}
      postGoods({ prototypeId: params[1], kind: params[0] }).then(response => {
        this.$alert(`该商品已添加到${goods[params[0]]['name']}，点击 <a href="${goods[params[0]]['url']}" style="color: #F34541">${goods[params[0]]['name']}</a> 查看`, '添加完成', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      })
    },
    async fetch(options) {
      const categoryId = this.categoryId === 0 ? null : this.categoryId
      const params = { sort: this.sort, blurry: this.blurry, categoryId: categoryId, size: this.pageSize, ...options }
      await getGift(deleteEmptyProperty(params)).then(response => {
        this.list = response.content
        this.totalElements = response.totalElements
      })
      console.log('列表请求结束')
    },
    sortPrice(command) {
      this.sort = command
    },
    search() {
      this.fetch()
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(page) {
      this.fetch({ page: page - 1 })
    }
  }
}
</script>
<style lang="scss" scoped>
.gifts {
  display: flex;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-right: -16px;
  margin-top: -10px;
  .item {
    width: 264px;
    margin: 10px;
  }
  .image {
    width: 262px;
    height: 262px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
  }
}
.demo-form-inline {
  .el-form-item {
    margin-bottom: 0;
  }
  .search {
    background: #409EFF;
    border-color: #409EFF;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #FFF;
  }

  .el-dropdown-menu {
    width: 165px;
  }
}
.selling-price {
  font-size: 24px;
  color: #f74d50;
}
.purchasing-price {
  font-size: 16px;
  color: #999;
  margin-left: 5px;
  text-decoration: line-through;
}
.el-card.item {
  border: 1px solid #EEE;
  &:hover {
    border: 1px solid #409EFF;
  }
}
.demo-form-inline ::v-deep .el-input-group__append{
  background: #409EFF;
  border-color: #409EFF;
}
.demo-form-inline ::v-deep .el-select .el-input__inner {
  background: #409EFF;
  color: #FFF;
  &::-webkit-input-placeholder { /* WebKit browsers */
    color: #FFF;
  }

  &::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #FFF;
  }

  &:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #FFF;
  }
}
.demo-form-inline ::v-deep .el-input__suffix {
  display: none;
}
.demo-form-inline ::v-deep .el-input__inner {
  border: 1px solid #409EFF;
}
.el-divider--horizontal {
  margin-left: -20px;
  margin-right: -20px;
}
.giftCategory {
  width: 160px;
}
.gift-name {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  // display: box;
  -webkit-box-orient: vertical;
  font-size: 14px;
  line-height: 18px;
  height: 38px;
}
</style>
