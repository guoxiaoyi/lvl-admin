<template>
  <div ref="appContainer" class="app-container">
    <el-card>
      <el-form ref="form" :model="gift" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="gift.name" />
        </el-form-item>
        <el-form-item label="轮播图片">
          <el-row :gutter="15" type="flex">
            <el-col v-for="(image, index) in previewSlideImages" :key="index" :span="3" :md="3" :xl="2">
              <el-card shadow="always" class="slide-image" :body-style="{ padding: '0px', display: 'flex' }">
                <div class="delete-item" @click="removeSlideItem(image)">
                  <i class="el-icon-delete-solid" />
                </div>
                <el-image class="image-item" :src="image.url" :preview-src-list="[slideImage[index]]" fit="cover" />
              </el-card>
            </el-col>
          </el-row>
          <editorImage v-if="previewSlideImages.length < 5 " type="primary" @successCBK="setSlideImage" />
        </el-form-item>
        <el-form-item label="选择供应商">
          <el-select v-model="gift.refProviderId" placeholder="请选择">
            <el-option v-for="item in provider" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="礼品类型">
          <el-select v-model="gift.categoryId" placeholder="请选择">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="gift.refPrice" />
        </el-form-item>
        <el-form-item label="采购价">
          <el-input v-model="gift.purchasingPrice" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="gift.sellingPrice" />
        </el-form-item>
        <el-form-item label="上架">
          <el-switch v-model="gift.onSale" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="图文详情">
          <Tinymce ref="editor" v-model="gift.description" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import Tinymce from '@/components/Tinymce'
import { getGiftProvider, getGiftType, postGift } from '@/api/gift'
const field = {
  categoryId: null,
  description: null,
  name: null,
  onSale: true,
  purchasingPrice: null,
  refProviderId: null,
  sellingPrice: null,
  slideImage: [],
}

export default {
  components: {
    Tinymce,
    editorImage
  },
  data() {
    return {
      gift: Object.assign({}, field),
      previewSlideImages: [],
      provider: [],
      categories: [],
      pageHeight: 0
    }
  },
  computed: {
    slideImage() {
      return this.previewSlideImages.map(images => images.url)
    }
  },
  watch: {
    previewSlideImages() {
      this.gift.slideImage = this.previewSlideImages.map(images => { return { id: images.id } })
      return
    }
  },
  created() {
    getGiftProvider().then(response => {
      this.provider = response
    })
    getGiftType().then(response => {
      this.categories = response
    })
  },
  mounted() {
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
    setSlideImage(image) {
      this.previewSlideImages.push(image)
    },
    removeSlideItem(current) {
      this.previewSlideImages = this.previewSlideImages.filter(image => image.id !== current.id)
    },
    submit() {
      postGift(this.gift).then(response => {
        console.log(response)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .slide-image {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible;
    margin-bottom: 20px;
    .delete-item {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 4;
      color: #FFF;
      background: red;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
      cursor: pointer;
    }
    .image-item {
      width: 100px;
      height: 100px;
    }
  }
</style>
