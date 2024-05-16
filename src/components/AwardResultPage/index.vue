<template>
  <div class="preview-award-result">
    <nav-header />
    <div class="content" :style="getBgStyle">
      <img :src="form.bannerImageUrl" class="banner">
      <div v-for="(item, index) in extraJson" :key="index" class="buttons" :style="getStyle(item)">
        <el-row v-if="item.items.length" type="flex" :gutter="parseInt(item.gutter)" style="flex-wrap: wrap;">
          <el-col v-for="(button, _index) in item.items" :key="_index" :span="toInt(item.span)" :style="getGutter(item.gutter)" :class="getRowClass(item.items, toInt(item.span), _index)">
            <img :src="button.pictureUrl" style="width: 100%; vertical-align: middle;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="copyright">
      <img src="@/assets/logo_for_mobile_footer.png">
    </div>
  </div>
</template>

<script>
import navHeader from './nav-header.vue'
export default {
  components: {
    navHeader
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    extraJson: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    getBgStyle() {
      return `background: url('${this.form.bgImageUrl}') no-repeat top center; ${this.form.bgColor ? `background-color: ${this.form.bgColor};` : ''} background-size: cover;`
    }
  },
  methods: {
    getStyle(item) {
      return `${this.getPadding(item.padding)}${this.getMargin(item.margin)}`
    },
    getMargin(value) {
      return `margin-top: ${value}px;`
    },
    getPadding(value) {
      return `padding: ${value}px;`
    },
    getGutter(value) {
      return `padding-top: ${parseInt(value) / 2}px; padding-bottom: ${parseInt(value) / 2}px;`
    },
    getRowClass(data, span, index) {
      const totalItems = data.length
      if (span === 24) {
        return {
          'first-row': index === 0,
          'last-row': index === totalItems - 1
        }
      } else if (span === 12) {
        const itemsPerRow = 24 / span
        const isFirstRow = index < itemsPerRow
        const isLastRow = index >= totalItems - (totalItems % itemsPerRow === 0 ? itemsPerRow : totalItems % itemsPerRow);
        return {
          'first-row': isFirstRow,
          'last-row': isLastRow
        }
      }
      return {}
    },
    toInt(value) {
      return parseInt(value)
    }
  }
}
</script>

<style lang="scss" scoped>

.preview-award-result {
  width: 100%;
  height: 640px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  .content {
    flex: 1;
    .banner {
      width: 100%;
      vertical-align: middle;
    }
    .buttons {
      width: 100%;
      overflow: hidden;
    }
  }
  .copyright {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 15px 0;
    img {
      width: 107px;
    }
  }
  .buttons {
    .first-row { padding-top: 0 !important;}
    .last-row { padding-bottom: 0 !important;}
  }
}

</style>
