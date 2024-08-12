<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"><a href="javascript: void(0)">邀请有礼设置</a></li>
      <li><a href="javascript: void(0)">推广海报</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="邀请有礼">
            <el-switch v-model="form.enabled" />
            <p class="help-block">开启后，会员在个人中心可以看到邀请有礼入口。新会员在审核通过后，遊请人可以得到相应奖励</p>
          </el-form-item>
          <el-form-item label="可邀请人">
            <el-radio-group v-model="form.kind">
              <el-radio label="all">全部会员</el-radio>
              <el-radio label="tag">特定标签会员</el-radio>
              <el-radio label="level">特定等级会员</el-radio>
            </el-radio-group>
            <p class="help-block">仅所选标签用户可见本邀请有礼活动</p>
          </el-form-item>
          <el-form-item label="奖励礼品" prop="rewardGoodId">
            <el-input v-model="rewardGoods.name" :disabled="true">
              <template slot="append">
                <el-button type="success" @click="goodsModal = true">选择</el-button>
              </template>
            </el-input>
            <p class="help-block">选择核销后奖励礼品，列表中没有想要的礼品？点击<router-link :to="{ name: 'GoodsListNew'}" target="_blank">新建礼品</router-link></p>
            <div v-if="Object.keys(rewardGoods).length" class="panel panel-default" style="line-height: 1.4; margin-top: 15px;">
              <el-table :data="[rewardGoods]">
                <el-table-column label="图片" prop="imageList" width="80px">
                  <template slot-scope="scope">
                    <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
                  </template>
                </el-table-column>
                <el-table-column label="名称">
                  <template slot-scope="scope">
                    <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name">
                      {{ scope.row.name }}
                    </router-link>
                    <span v-else>{{ scope.row.name }}</span>
                    <goods-price :detail="scope.row" />
                  </template>
                </el-table-column>
                <el-table-column label="类型" prop="typeName" width="120px" />
                <el-table-column label="库存" prop="stockQuantity" width="80px" />
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="邀请标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="邀请描述">
            <el-input v-model="form.description" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="邀请图片">
            <el-image style="width: 100px; height: 100px" :src="pictureUrl" fit="cover" class="img-thumbnail">
              <div slot="error" class="image-slot">
                <el-image style="width: 90px; height: 90px" :src="require('@/assets/image_missing.png')" fit="cover" />
              </div>
            </el-image>
            <el-upload
              action="#"
              accept="image/*"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
              :before-upload="beforeImageUpload"
            >
              <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
            </el-upload>
            <div class="help-block">尺寸：100x100px，格式：png，jpg，gif</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <goods-dialog v-if="goodsModal" :show.sync="goodsModal" :except="['other', 'coupon']" :type-in="typeIn">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </goods-dialog>
  </div>
</template>
<script>
import GoodsDialog from '@/components/Goods/modal.vue'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'
import amazon from '@/api/amazon'
export default {
  components: { GoodsDialog, CustomImg, GoodsPrice },
  data() {
    return {
      form: {

      },
      rules: {},
      rewardGoods: {},
      goodsModal: false,
      pictureUrl: null,
      uploading: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼设置' }])
  },
  methods: {
    select(data) {
      this.goodsModal = false
      this.rewardGoods = data
      this.form.rewardGoodId = data.id
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('权益图标大小不能超过 2MB!')
      }
      this.uploading = false
      return isLt2M
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.pictureId = response.data.id
        this.pictureUrl = response.data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    }
  }
}
</script>

<style>

</style>
