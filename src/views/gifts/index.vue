<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          礼品采购
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="gift-container-header">
          <div class="gift-categories">
            <span
              class="gift-category"
              :class="{current: current_category === ''}"
              @click="fetchAll({})"
            >
              全部
            </span>
            <span v-for="item in categories" :key="item.index" class="gift-category" :class="{current: current_category === item.id}" @click="tab({categoryId: item.id, page: 0})">
              {{ item.name }}
            </span>
          </div>
          <div class="gift-search">
            <input v-model="blurry" type="text" placeholder="请输入商品名称">
            <div class="gift-search-btn" @click="search()"><i class="fa fa-search" /></div>
          </div>
        </div>
        <div class="gift-sort">
          <div @click="giftSort">价格排序
            <span>
              <i :class="{'current': (sort == 'sellingPrice,asc')}" class="fa fa-sort-asc" />
              <i :class="{'current': (sort == 'sellingPrice,desc')}" class="fa fa-sort-desc" />
            </span>
          </div>
          <a class="el-button el-button--success el-button--mini" @click="() => downloadFile('/lgp/admin/api/gift/download')">导出 </a>
        </div>
        <div v-if="!loading" class="gift-container-body">
          <LflTable :list="gifts.content">
            <div class="flex flex-wrap">
              <div v-for="(item, index) in gifts.content" :key="index" class="col-1-5">
                <div class="gift-items">
                  <div class="gift-item">
                    <div
                      class="gift-img"
                      :style="'background-image: url('+item.slideImage[0].globalImage.url+')'"
                      @click="getDetail(item.id)"
                    />
                    <span class="gift-name">
                      {{ item.name }}
                    </span>
                    <div>
                      <p>市场价: <span class="refPrice">{{ item.refPrice.toFixed(2) }}</span></p>
                      <p>采购价: <span class="purchasingPrice">{{ item.sellingPrice.toFixed(2) }}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LflTable>
        </div>
        <div class="gift-container-footer">
          <ul class="pagination pagination-sm">
            <li v-for="index of gifts.totalPages" :key="index" :class="{active: (index-1 == page)}">
              <a href="javascript:void(0)" @click="pagination(index)">{{ index }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog
      width="920px"
      title="商品详情"
      append-to-body
      :visible.sync="modal"
      top="8vh"
    >
      <div v-if="modal" class="flex">
        <div>
          <div class="phone-frame">
            <div style="width: 410px; height: 640px; overflow-y: scroll;">
              <div class="gift-content">
                <div class="detail-slide">
                  <div class="slide-image" :style="'background-image: url('+currentSlideImage+')'" />
                </div>
                <div class="detail">
                  <div class="item-name">{{ gift.name }}</div>
                  <div class="item-price">市场价<span>{{ gift.refPrice.toFixed(2) }}元</span></div>
                </div>
                <div class="detail-description">
                  <div class="group-title"> 礼品详情 </div>
                  <div v-html="gift.description" />
                </div>
              </div>
            </div>
            <div class="phone-home-btn" />
          </div>
        </div>
        <div class="gift-detail" style="width: 400px">
          <div class="detail-info">
            <h3 style="margin-top: 0; line-height: 24px;">{{ gift.name }}</h3>
            <div class="detail-info-list">
              <p>市场价: <span class="refPrice"><small>￥</small>{{ gift.refPrice.toFixed(2) }}</span></p>
              <p>采购价: <span class="purchasingPrice"><small>￥</small>{{ gift.sellingPrice.toFixed(2) }}</span></p>
              <p>重要提示：产品如有质量问题或使用咨询，请拨打售后服务热线：010-86468682</p>
            </div>
            <div class="detail-type">
              <p v-if="gift.chargeType === 0">类型:  <span class="label label-primary">{{gift.specName}}</span> </p>
            </div>
            <div class="add_button">
              <div
                :class="{disabled: gift.activityGoods}"
                class="gift_add_button"
                @click="addListItem(`activity_good;${gift.id};${gift.activityGoods}`)"
              >
                {{ gift.activityGoods ? '已' : '' }}添加到活动礼品
              </div>
              <div
                v-if="account.store.pointStoreEnabled"
                :class="{disabled: gift.storeGoods}"
                class="gift_add_button"
                @click="addListItem(`store_good;${gift.id};${gift.storeGoods}`)"
              >
                {{ gift.storeGoods ? '已' : '' }}添加到商城商品
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gifts from '@/api/gifts.js'
import { mapGetters } from 'vuex'
import LflTable from '@/components/LflTable'
export default {
  components: {
    LflTable
  },
  data() {
    return {
      current_category: '',
      blurry: '',
      categories: [],
      gift: {},
      previewSlideImages: [],
      currentSlideImageIndex: 0,
      button_disabled: false,
      gifts: { },
      loading: true,
      sort: 'sellingPrice,asc',
      page: 0,
      modal: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    currentSlideImage() {
      return this.previewSlideImages[this.currentSlideImageIndex]
    }
  },
  watch: {
    sort() {
      this.fetch()
    },
    gift() {
      this.previewSlideImages = this.gift.slideImage.map(images => images.globalImage.url)
    },
    gifts: {
      handler: function(newval, oldVal) {
        console.log(newval)
      },
      deep: true
    }
  },
  mounted() {
    const breadcrumb = [{ title: '礼品采购', path: { name: 'StoreGoodIndex' }}]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.fetch()
    gifts.categories().then(data => {
      this.categories = data
    })
  },
  methods: {
    fetchAll() {
      this.blurry = ''
      this.fetch()
    },
    fetch(params) {
      params = { onSale: true, sort: this.sort, blurry: this.blurry, ...params }
      this.loading = true
      this.current_category = parseInt(params.categoryId) >= 0 ? parseInt(params.categoryId) : ''
      gifts.index(params).then(response => {
        this.gifts = response
        this.loading = false
      })
    },
    tab(params) {
      this.page = 0
      this.fetch(params)
    },
    pagination(page) {
      this.page = page - 1
      this.fetch({ page: this.page, categoryId: this.current_category })
    },
    search() {
      this.page = 0
      this.fetch()
    },
    giftSort(sort) {
      this.page = 0
      switch (this.sort) {
        case 'sellingPrice,asc':
          this.sort = 'sellingPrice,desc'
          break
        case 'sellingPrice,desc':
          this.sort = 'sellingPrice,asc'
          break
      }
    },
    getDetail(id) {
      // $('#gift-detail').modal('show');
      // $("#gift-detail .alert.alert-success.alert-dismissible").remove()
      gifts.show({ id }).then(data => {
        this.modal = true
        this.gift = data
      })
    },
    addListItem(command) {
      console.log(command)
      if (!this.button_disabled) {
        this.button_disabled = true
        const params = command.split(';')
        const goods = {
          activity_good: {
            name: '礼品列表',
            url: '/admin/goods',
            text: '采购库存'
          },
          store_good: {
            name: '商品列表',
            url: '/admin/store_goods',
            text: '设置售价并采购库存'
          }
        }

        if (params[2] === 'true') {
          return true
        }

        gifts.add({
          prototypeId: params[1],
          kind: params[0]
        }).then(response => {
          this.$message({
            type: 'success',
            duration: 6000,
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `该商品已添加到${goods[params[0]]['name']}，前往 <a href="${goods[params[0]]['url']}" style="color: #F34541">${goods[params[0]]['name']}</a> ${goods[params[0]]['text']}`
          })
          this.button_disabled = false
          gifts.show({ id: params[1] }).then(data => {
            this.gift = data
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-container-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #F4F4F4;
  padding-bottom: 10px;
  .gift-search {
    width: 210px;
    height: 44px;
    border: 1px solid #F34541;
    border-radius: 2px;
    background: #FFF;
    display: flex;
    input {
      width: 160px;
      outline: 0;
      border: none;
      padding: 0;
      text-indent: 10px;
    }
    .gift-search-btn {
      width: 50px;
      display: flex;
      background: #F34541;
      color: #FFF;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
.gift-sort {
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
  div {
    cursor: pointer;
    display: inline-block;
  }
  span {
    display: inline-flex;
    position: relative;
    i {
      color: #999999;
      &.current {
        color: #000;
      }
      &.fa-sort-asc {
        position: absolute;
      }
      &.fa-sort-desc { }
    }
  }
}
.gift-categories {
  padding-right: 50px;
  .gift-category {
    display: inline-block;
    background: #F4F4F4;
    border-radius: 4px;
    padding: 12px 14px;
    color: #333333;
    cursor: pointer;
    margin-right: 5px;
    margin-bottom: 5px;
    &.current {
      background: #F34541;
      color: #FFF;
    }
  }
}
.gift-container-body {
  .flex.flex-wrap {
    margin-left: -10px;
    margin-right: -10px;
  }
  .col-1-5 {
    width: 20%;
    .gift-items {
      padding: 10px;
      .gift-item {
        border-radius: 6px;
        background: #FFFFFF;
        border: 1px solid #EEEEEE;
        overflow: hidden;
      }
      .gift-name {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        display: box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        font-size: 14px;
        line-height: 18px;
        height: 38px;
        margin: 10px 13px 3px 13px;
        &+div {
          p {
            margin: 0 13px;
            color: #999999;
            .refPrice {
              text-decoration: line-through;
              margin-bottom: 18px;
            }
            &+p{
              color: #F34541;
              font-size: 16px;
              margin-top: 3px;
              margin-bottom: 13px;
            }
          }
        }
      }
    }
    .gift-img {
      display: block;
      width: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      &:before{
        content: '';
        display: block;
        width: 100%;
        padding-top: 100%;
      }
    }
  }
}
.detail-slide {
  width: 100%;
  .slide-bar {
    margin-top: 16px;
    position: relative;
    padding-left: 30px;
    padding-right: 30px;
    height: 50px;
    .slide-bar-item {
      width: 50px;
      height: 50px;
      &.current {
        border: 2px solid #409EFF;
        box-sizing: border-box;
      }
      &+.slide-bar-item {
        margin-left: 10px;
      }
    }
  }
  .left, .right {
    width: 20px;
    height: 50px;
    cursor: pointer;
    position: absolute;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .slide-image {
    width: 100%;
    padding-top: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
.detail-description {
  ::v-deep {
    img, video{
      max-width: 100%;
    }
    video {
      height: 198.5625px;
    }
  }
}
.gift-detail {
  display: flex;
  .detail-info {
    flex: 1;
    margin-left: 20px;
    h3 {
      font-size: 18px;
      color: #303133;
      margin-bottom: 30px;
    }
    .add_button {
      margin-bottom: 20px;
      .gift_add_button {
        background: #F34541;
        border-radius: 4px;
        display: inline-block;
        padding: 8px 15px;
        color: #FFF;
        cursor: pointer;
        &+.gift_add_button {
          margin-left: 20px;
        }
        &.disabled {
          background: #DDD;
        }
      }
    }
  }
  .detail-info-list {
    padding: 24px 20px;
    background: #f8f8f8;
    p {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  .detail-type {
    padding: 24px 20px;
    margin-bottom: 20px;
    p {
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 10px;
      span {
        vertical-align: middle;
      }
    }
  }
  .refPrice, .purchasingPrice {
    margin-left: 10px;
  }
  .purchasingPrice {
    color: #F34541;
    font-size: 30px;
    small {
      font-size: 14px;
    }
  }
  &+.divider {
    height: 30px;
    background: #EEE;
    margin-top: 26px;
    border-bottom: 1px solid #F34541;
    span {
      display: inline-flex;
      background: #F34541;
      color: #FFF;
      font-size: 14px;
      align-items: center;
      height: 100%;
      padding: 0px 10px;
    }
  }
}
.gift-content {
  width: 375px;
  min-height: 640px;
  border: solid #eee 1px;
  .detail {
    margin-top: 10px;
    padding: 10px;
    padding-top: 0;
    .item-price {
      color: #999;
      font-size: 14px;
      span {
        color: #FF4429;
        margin-left: 2px;
        text-decoration: line-through;
      }
    }
    .item-name {
      color: #333;
      font-size: 14px;
    }
  }
  .detail-description {
    .group-title {
      display: flex;
      font-size: 16px;
      color: #333333;
      align-items: center;
      margin-bottom: 10px;
      &:before {
        display: block;
        width: 3px;
        height: 18px;
        content: '';
        background: #F34541;
        margin-right: 5px;
        border-radius: 3px;
      }
    }
    padding: 10px;
    border-top: 8px solid #f8f8f8;
  }
}

.pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius:4px
}

.pagination > li {
    display:inline
}

.pagination > li > a, .pagination > li > span {
    position: relative;
    float: left;
    padding: 6px 12px;
    line-height: 1.428571429;
    text-decoration: none;
    color: #da120e;
    background-color: #fff;
    border: 1px solid #ddd;
    margin-left:-1px
}

.pagination > li:first-child > a, .pagination > li:first-child > span {
    margin-left: 0;
    border-bottom-left-radius: 4px;
    border-top-left-radius:4px
}

.pagination > li:last-child > a, .pagination > li:last-child > span {
    border-bottom-right-radius: 4px;
    border-top-right-radius:4px
}

.pagination > li > a:hover, .pagination > li > a:focus, .pagination > li > span:hover, .pagination > li > span:focus {
    color: #920c09;
    background-color: #eeeeee;
    border-color:#ddd
}

.pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {
    z-index: 2;
    color: #fff;
    background-color: #F34541;
    border-color: #F34541;
    cursor:default
}

.pagination > .disabled > span, .pagination > .disabled > span:hover, .pagination > .disabled > span:focus, .pagination > .disabled > a, .pagination > .disabled > a:hover, .pagination > .disabled > a:focus {
    color: #777777;
    background-color: #fff;
    border-color: #ddd;
    cursor:not-allowed
}

.pagination-lg > li > a, .pagination-lg > li > span {
    padding: 10px 16px;
    font-size:18px
}

.pagination-lg > li:first-child > a, .pagination-lg > li:first-child > span {
    border-bottom-left-radius: 6px;
    border-top-left-radius:6px
}

.pagination-lg > li:last-child > a, .pagination-lg > li:last-child > span {
    border-bottom-right-radius: 6px;
    border-top-right-radius:6px
}

.pagination-sm > li > a, .pagination-sm > li > span {
    padding: 5px 10px;
    font-size:12px
}

.pagination-sm > li:first-child > a, .pagination-sm > li:first-child > span {
    border-bottom-left-radius: 3px;
    border-top-left-radius:3px
}

.pagination-sm > li:last-child > a, .pagination-sm > li:last-child > span {
    border-bottom-right-radius: 3px;
    border-top-right-radius:3px
}
</style>
