<template>
  <div class="app-container">
    <div v-if="detail.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，<router-link v-if="detail.id" :to="{ name: 'ActivityShow', params: {activityId: detail.id }}">点击返回主活动</router-link>
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.meta.title }}
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <step v-if="detail.state === 'pending'" :active="4" :activity="detail" />
        <div class="panel panel-default new-show">
          <div class="panel-heading">
            <h4 class="panel-title">基本信息</h4>
          </div>
          <div class="panel-body">
            <Base :detail="detail" />
          </div>
          <div v-if="checkPer(['activity_update'])" class="panel-footer">
            <router-link :to="{ name: 'ActivityEdit', params: { activityId: $route.params.activityId}}" class="el-button el-button--success">修改基本设置</router-link>
          </div>
        </div>
        <Advanced :detail="detail" />

        <div v-if="detail.awardEnabled" class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">活动奖项</h4>
          </div>
          <div class="panel-body">
            <LflTable :list="awards">
              <table class="table table-bordered table-hover" style="margin-bottom: 0;">
                <thead>
                  <tr>
                    <th>奖项</th>
                    <th>图片</th>
                    <th>奖品</th>
                    <th>礼品类型</th>
                    <th>{{ detail.suiteAwardEnabled ? '奖品数量' : '已中奖/奖品总数' }}</th>
                    <th>礼品库存</th>
                    <th>抽奖规则</th>
                    <th style="width: 100px;">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in awards" :key="item.id + 'awards'" :data-id="item.id">
                    <td label="奖项" prop="title"> {{ item.title }} </td>
                    <td label="图片">
                      <CustomImg :image="item.goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
                    </td>
                    <td label="奖品">
                      <router-link v-if="checkPer(['good_read']) && !item.goods.deletedAt && account.main" :to="{name: 'GoodsShow', params: {goodsId: item.goods.id}}" class="name">
                        {{ item.goods.name }}
                      </router-link>
                      <div v-else><span v-if="item.goods.deletedAt">[已删]</span> {{ item.goods.name }}</div>
                      <goods-price :detail="item.goods" />
                    </td>
                    <td label="礼品类型">{{ item.goods.typeName }}</td>
                    <td :label="detail.suiteAwardEnabled ? '奖品数量' : '已中奖/奖品总数'">
                      <template v-if="detail.suiteAwardEnabled">
                        {{ item.quantity }}
                      </template>
                      <template v-else>
                        {{ item.winCount }}/{{ item.quantity }}
                      </template>
                    </td>
                    <td label="礼品库存" :class="{danger: !item.inStock}">
                      <router-link v-if="account.main || checkPer(['good_stock_changes'])" :to="{name: 'GoodsStockChange', params: {goodsId: item.goods.id }}">
                        <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
                          <i v-if="!item.inStock" class="fa fa-warning" />
                        </el-tooltip>
                        {{ item.goods.stockQuantity }}
                        <i class="fa fa-edit" />
                      </router-link>
                      <span v-else>
                        {{ (account.isInspector && item.goods.stockQuantity > 0) ? ' > 0' : item.goods.stockQuantity }}
                      </span>
                    </td>
                    <td label="抽奖规则" prop="ruleDesc" :class="{danger: item.type === 'LocationAward' && !activity.regionRequired}">
                      <el-tooltip class="item" effect="dark" content="本活动“精准位置收集”功能已关闭，此抽奖规则不可用。如需使用，请至活动高级设置页，开启“精准位置收集”" placement="top">
                        <a v-if="item.type === 'LocationAward' && !activity.regionRequired"> <i class="fa fa-warning" style="color: #da120e; cursor: pointer;" /> 不可用</a>
                      </el-tooltip>
                      <div v-html="item.ruleDesc" />
                    </td>
                    <td label="创建时间">
                      {{ item.createdAt }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </LflTable>
          </div>
          <div class="panel-footer">
            <router-link :to="{ name: 'ActivityAwards', params: { activityId: $route.params.activityId}}" class="el-button el-button--success">修改奖项</router-link>
          </div>
        </div>
        <div v-if="detail.awardEnabled" class="panel panel-default new-show">
          <div class="panel-heading">
            <h4 class="panel-title">活动页面</h4>
          </div>
          <div class="panel-body">
            <table class="table table-loose table-hover" style="margin-bottom: 0;">
              <tbody>
                <tr>
                  <td>
                    {{ $t(`page.show.banner_type['${detail.page.bannerType}']`) }}
                  </td>
                  <td>
                    <template v-if="detail.page.bannerType === 'video_code'">
                      <div v-html="detail.page.videoCode" />
                    </template>
                    <template v-if="detail.page.bannerType === 'video_file'">
                      <div class="lfl-video lfl-mobile__store">
                        <video
                          id="video"
                          controls
                          loop
                          :src="detail.page.videoUrl"
                          :poster="detail.page.videoImgUrl"
                          playsinline="playsinline"
                          webkit-playsinline=""
                          x5-video-player-type="h5"
                          x5-video-player-fullscreen="true"
                          x5-video-orientation="portrait"
                          width="100%"
                        />
                      </div>

                    </template>
                    <template v-if="detail.page.bannerType === 'img'">
                      <ActivityBanner :item="{ pageBannerUrl: detail.page.bannerUrl, pageBannerDefault: detail.page.bannerDefault }" :custom-style="{ width: '320px' }" :custom-class="['img-thumbnail']" />
                    </template>
                  </td>
                </tr>
                <tr v-if="detail.page.bgImgUrl">
                  <td>
                    {{ $t('page.bg_img') }}
                  </td>
                  <td>
                    <el-image :src="detail.page.bgImgUrl" style="width: 320px; max-width: 320px;" />
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('page.description') }}</td>
                  <td>
                    <template v-if="detail.page.description">
                      <div v-html="detail.page.description" />
                    </template>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="panel-footer">
            <router-link :to="{ name: 'ActivityEditPage', params: { activityId: $route.params.activityId}}" class="el-button el-button--success"><i class="fa fa-magic" /> 修改活动页面</router-link>
          </div>
        </div>
        <div class="alert alert-warning" role="alert">
          <h4><i class="fa fa-alert-warning" /> 注意：</h4>
          <ul>
            <li>除活动类型外，其他活动信息，奖项礼品，活动页面等，创建完后仍可修改。</li>
          </ul>
        </div>
        <div>
          <el-button type="success" @click="confirm">确认创建活动</el-button>
          <el-button @click="$router.push({ name: 'ActivityEditPage', params: { activityId: $route.params.activityId }})">上一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import activity_awards from '@/api/awards'

import ActivityBanner from '@/components/ActivityBanner'
import Step from './components/step.vue'
import Base from './components/base.vue'
import Advanced from './components/Advance.vue'
import LflTable from '@/components/LflTable'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'

import { mapGetters } from 'vuex'
export default {
  components: {
    Step,
    Base,
    Advanced,
    LflTable,
    CustomImg,
    GoodsPrice,
    ActivityBanner
  },
  data() {
    return {
      detail: {
        page: {}
      },
      awards: []
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData'])
  },
  async mounted() {
    this.detail = this.activityData

    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.detail.title, path: { name: 'ActivityEdit', params: { activityId: this.$route.params.activityId }}},
      { title: '确认' }
    ])
    activity_awards.index({ activityId: this.$route.params.activityId }).then(response => {
      this.awards = response.data
    })
  },
  methods: {
    confirm() {
      if (confirm('确认并创建此活动？')) {
        activities.confirm({ id: this.$route.params.activityId }).then(response => {
          this.$router.push({ name: 'ActivityWizardConfirm', params: { activityId: this.$route.params.activityId }})
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.danger {
  background-color: #f2dede;
}

</style>
