<template>
  <div ref="appContainer" class="app-container">
    <el-card>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-select v-model="categoryId" placeholder="全部商品分类" clearable class="giftCategory">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="blurry" placeholder="请输入内容" class="">
            <template slot="append">
              <div class="append-btn">
                <el-button type="warning" icon="el-icon-search" class="search" @click="search"/>
              </div>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div style="width: 800px; margin: 30px auto;">
        <div class="gift-detail">
          <div class="detail-slide">
            <el-image
              fit="cover"
              :src="currentSlideImage"
              class="slide-image"
            />
            <div class="slide-bar">
              <img src="@/assets/gift/left.png" class="left">
              <el-image
                v-for="(image, index) in previewSlideImages"
                :key="index"
                :src="image"
                class="slide-bar-item"
                :class="{current: index == currentSlideImageIndex}"
                :preview-src-list="previewSlideImages"
                @mouseenter="currentSlideImageIndex = index"
              />
              <img src="@/assets/gift/right.png" class="right">
            </div>
          </div>
          <div class="detail-info">
            <h3 style="margin-top: 0; line-height: 24px;">{{ gift.name }}</h3>
            <div class="detail-info-list">
              <p>市场价: <span class="refPrice"><small>￥</small>{{ gift.refPrice }}</span></p>
              <p>采购价: <span class="purchasingPrice"><small>￥</small>{{ gift.sellingPrice }}</span></p>
              <p>重要提示：产品如有质量问题或使用咨询，请拨打售后服务热线：010-86468682</p>
            </div>
            <div class="detail-type">
              <p v-if="gift.chargeType === 0">类型:  <el-tag effect="plain" size="small"> {{gift.specName}}</el-tag></p>
            </div>
            <el-button
              :disabled="gift.activityGoods"
              type="primary"
              @click="addListItem(`activity_good;${gift.id}`)"
            >
              {{ gift.activityGoods ? '已' : '' }}添加到活动礼品
            </el-button>
            <el-button
              :disabled="gift.storeGoods"
              type="primary"
              @click="addListItem(`store_good;${gift.id}`)"
            >
              {{ gift.storeGoods ? '已' : '' }}添加到积分商品
            </el-button>
          </div>
        </div>
        <div class="divider">
          <span>产品详情</span>
        </div>
        <div class="detail-description" v-html="gift.description" />
      </div>
    </el-card>
  </div>
</template>
<script>
import { getGiftInfo, getGiftType } from '@/api/gift'
import { deleteEmptyProperty } from '@/utils'
import { postGoods } from '@/api/goods'
export default {
  data() {
    return {
      gift: { },
      options: [],
      value: '',
      previewSlideImages: [],
      currentSlideImageIndex: 0,
      categories: [],
      categoryId: null,
      blurry: null,
      pageHeight: 0
    }
  },
  computed: {
    currentSlideImage() {
      return this.previewSlideImages[this.currentSlideImageIndex]
    }
  },
  watch: {
    gift() {
      this.previewSlideImages = this.gift.slideImage.map(images => images.globalImage.url)
    },
    categoryId() {
      this.search()
    }
  },
  created() {

  },
  async mounted() {
    await getGiftInfo(this.$route.params).then(response => {
      this.gift = response
    })
    await getGiftType().then(response => {
      this.categories = response
      this.categories.unshift({ name: '全部商品分类', id: 0 })
    })
    const _this = this
    setTimeout(function() {
      _this.pageHeight = _this.$refs.appContainer.offsetHeight
      window.parent.postMessage({
        cmd: 'returnHeight',
        params: {
          success: true,
          data: _this.pageHeight
        }
      }, '*')
    }, 500)
  },
  methods: {
    search() {
      const categoryId = this.categoryId === 0 ? null : this.categoryId
      const query = deleteEmptyProperty({ blurry: this.blurry, categoryId: categoryId })
      this.$router.push({ name: 'GiftIndex', query: query })
    },
    addListItem(command) {
      const params = command.split(';')
      const goods = { 'activity_good': { name: '礼品列表', url: '/admin/goods' }, 'store_good': { name: '商品列表', url: '/admin/store_goods' }}
      postGoods({ prototypeId: params[1], kind: params[0] }).then(response => {
        this.$alert(`该商品已添加到${goods[params[0]]['name']}，点击 <a href="${goods[params[0]]['url']}" style="color: #F34541">${goods[params[0]]['name']}</a> 查看`, '添加完成', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
        getGiftInfo(this.$route.params).then(response => {
          this.gift = response
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-slide {
  width: 350px;
  .slide-bar {
    margin-top: 16px;
    position: relative;
    padding-left: 30px;
    padding-right: 30px;

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
    width: 350px;
    height: 350px;
  }
}
.gift-detail {
  display: flex;

  .detail-info {
    flex: 1;
    margin-left: 20px;
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
}
.divider {
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
.demo-form-inline {
  width: 800px;
  margin: 0 auto;
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

.el-card ::v-deep .el-input-group__append{
  background: #409EFF;
  border-color: #409EFF;
}
.el-card ::v-deep .el-select .el-input__inner {
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
.el-card ::v-deep .el-input__suffix {
  display: none;
}
.el-card ::v-deep .el-input__inner {
  border: 1px solid #409EFF;
}
.el-divider--horizontal {
  margin-left: -20px;
  margin-right: -20px;
}
.detail-description {
  ::v-deep img {
    max-width: 100%;
    width: 100%;
  }
}
.giftCategory {
  width: 160px;
}
</style>
