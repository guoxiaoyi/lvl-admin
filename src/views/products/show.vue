<template>
  <div class="panel panel-default new-show">
    <div class="panel-body table-responsive">
      <table v-if="Object.keys(result).length" class="table table-loose table-hover">
        <tr>
          <td>产品代码</td>
          <td> {{ result.code || '-' }} </td>
        </tr>
        <tr>
          <td>价格</td>
          <td> {{ result.price }} </td>
        </tr>
        <tr>
          <td>图片</td>
          <td>
            <div v-if="result.imageList.length">
              <el-image
                v-for="image in result.imageList"
                :key="'img_'+image.id*Math.floor(Math.random() * 26)"
                style="width: 70px; height: 70px"
                :src="image.url"
                fit="fit"
                class="img-thumbnail product-thumbnail-middle img-show-thumbnail"
              />
            </div>
            <el-image
              v-else
              style="width: 70px; height: 70px"
              :src="require('@/assets/image_missing.png')"
            />
          </td>
        </tr>
        <tr>
          <td>规格</td>
          <td>{{ result.spec }}</td>
        </tr>
        <tr>
          <td>产品名称</td>
          <td> {{ result.name }} </td>
        </tr>
        <tr>
          <td>商品条码</td>
          <td> {{ result.ean13 }}</td>
        </tr>
        <tr>
          <td>描述</td>
          <td> {{ result.description }} </td>
        </tr>
        <tr>
          <td>产品链接</td>
          <td> {{ result.url }} </td>
        </tr>
        <tr>
          <td>生产商</td>
          <td> {{ result.firm }} </td>
        </tr>
        <tr>
          <td>地址</td>
          <td> {{ result.address }} </td>
        </tr>
        <tr>
          <td>产地</td>
          <td> {{ result.origin }} </td>
        </tr>
        <tr>
          <td>电话</td>
          <td>{{ result.phone }}</td>
        </tr>
        <tr v-for="(item, index) in result.customFieldValues" :key="'custom_field_'+index">
          <td>{{ item.customField.label }}</td>
          <td v-if="['CustomField::CheckBoxes', 'CustomField::CheckBoxes'].includes(item.customField.type)">
            <!-- {{ item.value ? item.value.join() : '' }} -->
            {{ item.value | arrayToStr }}
          </td>
          <td v-if="['CustomField::Select', 'CustomField::String', 'CustomField::CitizenId'].includes(item.customField.type)">
            {{ item.value }}
          </td>
          <td v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
            <a v-if="item.pictureUrl" :href="item.pictureUrl" target="_blank" class="activity_forms_image_a">
              <el-image
                style="width: 100px; height: 100px"
                :src="item.pictureUrl"
              />
            </a>
            <div v-else>
              -
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="Object.keys(result).length && checkPer(['product_list'])" class="panel-footer">
      <router-link :to="{ name: 'ProductEdit', params: { id: result.id }}" class="el-button el-button--success">
        修改
      </router-link>
    </div>
  </div>
</template>
<script>
const isArray = (obj) => Array.isArray(obj)
export default {
  filters: {
    arrayToStr(str) {
      if (isArray(str)) {
        return str.join(',')
      } else {
        return str
      }
    }
  },
  props: {
    result: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>
<style scoped>
.img-show-thumbnail {
  margin-right: 5px;
}
.img-thumbnail {
  padding: 0;
}
</style>
