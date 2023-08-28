<template>
  <div>
    <el-form ref="form" label-width="85px">
      <div class="add-item flex">
        <div class="thumb-image" @click="show = true">
          <img v-if="values.data.image_url" :src="values.data.image_url">
          <img v-else :src="require('@/assets/add.png')" style="width: 30px; height: 30px;">
          <span v-if="values.data.image_url">更换图片</span>
        </div>
        <div class="flex-item">
          <el-form-item label="跳转地址" class="content-full">
            <Link :item="values.data" />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <selectImage :show.sync="show" @selectChange="selectd" />
  </div>
</template>

<script>
import Link from '../Link'
import selectImage from '@/components/Assets/image.vue'
export default {
  components: { Link, selectImage },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    selectd(data) {
      this.values.data.image_url = data.url
      this.values.data.image_id = data.id
    }
  }
}
</script>

<style>

</style>
