<template>
  <el-form ref="form" label-width="85px">
    <el-form-item label="选择模板" class="content-full">
      <el-radio-group v-model="values.block">
        <el-radio label="img_navigator">大图文导航</el-radio>
        <el-radio label="img_navigator_small">小图文导航</el-radio>
      </el-radio-group>
    </el-form-item>
    <draggable v-model="values.data" filter=".remove-item" @start="drag=true" @end="drag=false">
      <div v-for="(item, index) in values.data" :key="'navigator-item-' + index" class="add-item flex">
        <div class="remove-item" @click="remove(index)" />
        <div class="thumb-image" @click="show = true; i = index">
          <img v-if="item.image_url" :src="item.image_url">
          <img v-else :src="require('@/assets/add.png')" style="width: 30px; height: 30px;">
          <span v-if="item.image_url">更换图片</span>
        </div>
        <div class="flex-item">
          <el-form-item label="图片标题" class="content-full">
            <el-input v-model="values.data[index]['title']" placeholder="最多5个字" maxlength="5" />
          </el-form-item>
          <el-form-item label="跳转地址" class="content-full">
            <Link :item="item" />
          </el-form-item>
        </div>
      </div>
    </draggable>
    <div v-if="values.data.length < 5" class="flex add-item-btn" style="flex-direction: column;" @click="add">
      <p class="add-image-text"><i class="fa fa-plus" /> 添加一个图文导航(还可添加{{ 5 - values.data.length }}个)</p>
    </div>
    <selectImage :show.sync="show" @selectChange="selectd" />
  </el-form>
</template>

<script>
import Link from '../Link'
import draggable from 'vuedraggable'
import selectImage from '@/components/Assets/image.vue'
export default {
  components: { Link, draggable, selectImage },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      drag: false,
      show: false,
      i: null
    }
  },
  methods: {
    add() {
      this.values.data.push({
        link_name: null,
        link_type: null,
        url: null,
        image_id: null,
        image_url: null,
        title: `导航${this.values.data.length + 1}`
      })
    },
    remove(item) {
      this.values.data.splice(item, 1)
    },
    selectd(data) {
      this.values.data[this.i]['image_url'] = data.url
      this.values.data[this.i]['image_id'] = data.id
      this.i = null
    }
  }
}
</script>
