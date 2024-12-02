<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"><router-link :to="{ name: 'InviteRewardsSetting' }">邀请有礼设置</router-link></li>
      <li><router-link :to="{ name: 'InviteRewardsPoster' }">推广海报</router-link></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="邀请有礼">
            <el-switch v-model="form.enabled" />
            <p class="help-block">开启后，会员在个人中心可以看到邀请有礼入口。新会员在审核通过后，遊请人可以得到相应奖励</p>
          </el-form-item>
          <el-form-item label="可邀请人">
            <el-radio-group v-model="form.canInviteType">
              <el-radio label="all">全部会员</el-radio>
              <el-radio label="tag">特定标签会员</el-radio>
              <el-radio label="vip_level">特定等级会员</el-radio>
            </el-radio-group>
            <div v-if="form.canInviteType === 'tag'">
              <el-select v-model="form.tagIds" size="small" clearable filterable placeholder="请输入" multiple>
                <el-option
                  v-for="(item, index) in userTags"
                  :key="index +'_tags'"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div v-if="form.canInviteType === 'vip_level'">
              <el-select v-model="form.vipLevelIds" size="small" clearable filterable placeholder="请输入" multiple>
                <el-option
                  v-for="item in vipLevels"
                  :key="item.id+'levels'"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </div>
            <p class="help-block">{{ canInviteTypeHint }}</p>
          </el-form-item>
          <el-form-item label="奖励礼品" prop="goodId">
            <el-input v-model="rewardGoods.name" :disabled="true">
              <template slot="append">
                <el-button type="success" @click="goodsModal = true">选择</el-button>
              </template>
            </el-input>
            <p class="help-block">发放给邀请人的礼品。 礼品类型支持红包、积分、卡券。列表中没有想要的礼品？点击<router-link :to="{ name: 'GoodsListNew'}" target="_blank">新建礼品</router-link></p>
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
          <el-form-item label="无库停止奖利">
            <el-switch v-model="form.noQuantityStop" />
          </el-form-item>
          <el-form-item label="邀请标题">
            <el-input v-model="form.title" placeholder="你的好友邀你成为VIP会员" />
          </el-form-item>
          <el-form-item label="邀请描述">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="成为会员享专属福利！众多专属活动等你参与！" />
          </el-form-item>
          <el-form-item label="邀请图片">
            <el-image style="width: 100px; height: 100px" :src="pictureUrl" fit="cover" class="img-thumbnail">
              <div slot="error" class="image-slot">
                <el-image style="width: 90px; height: 90px" :src="require('@/assets/image_missing.png')" fit="cover" />
              </div>
            </el-image>
            <el-upload
              action="#"
              accept=".jpg, .jpeg"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
              :before-upload="beforeImageUpload"
            >
              <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
            </el-upload>
            <div class="help-block">设置分享图片，尺寸：320 x 320px，格式：jpg</div>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="loading" @click="submit">保存</el-button>
      </div>
    </div>
    <goods-dialog v-if="goodsModal" :show.sync="goodsModal" :except="['other', 'suite_card']" :type-in="typeIn">
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
import invite_rewards from '@/api/invite_rewards'

import vip_level from '@/api/vip_level'
import tags from '@/api/tag'

export default {
  components: { GoodsDialog, CustomImg, GoodsPrice },
  data() {
    return {
      form: {
        enabled: false,
        canInviteType: null,
        title: null,
        goodId: null,
        description: null,
        pictureId: null,
        tagIds: [],
        noQuantityStop: false,
        vipLevelIds: []
      },
      rules: {},
      rewardGoods: {},
      goodsModal: false,
      pictureUrl: null,
      uploading: false,
      userTags: [],
      vipLevels: [],
      typeIn: {
        red_pack: [{ value: '小额红包', key: 'Good::CashGood' }]
      },
      loading: false
    }
  },
  computed: {
    canInviteTypeHint() {
      return {
        tag: '指定标签用户可见邀请入口，并可邀请会员注册后获的奖励。支持多选标签。',
        vip_level: '指定等级会员可见邀请入口，并可邀请会员注册后获得奖励。支持多选会员等级。'
      }[this.form.canInviteType] || '不限制，所有登录用户均可邀请。'
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼设置' }])
    invite_rewards.getSetting({}).then(({ data }) => {
      this.form = data
      this.pictureUrl = data.imgUrl
      if (data.goodId) {
        this.select(data.goods)
      }
    })
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
    vip_level.list().then(response => {
      this.vipLevels = response.data
    })
  },
  methods: {
    select(data) {
      this.goodsModal = false
      this.rewardGoods = data
      this.form.goodId = data.id
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('邀请图片大小不能超过 1MB!')
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
    },
    submit() {
      this.loading = true
      invite_rewards.edit(this.form).then(({ data }) => {
        this.loading = false
        this.$message.success('保存成功')
      }).catch(fail => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
