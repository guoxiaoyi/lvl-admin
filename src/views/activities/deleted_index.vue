<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          活动回收站
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @keyup.enter.native="crud.toQuery()">
            <el-form-item label="搜索" prop="printingState">
              <el-input v-model="query.search" placeholder="名称/CODE" />
            </el-form-item>

            <el-form-item label="活动类别" prop="type">
              <el-select v-model="query.type" clearable>
                <el-option v-for="item in typeKind" :key="item.key" :label="item.text" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="互动类型" prop="type">
              <el-select v-model="query.pageType" clearable filterable>
                <el-option v-for="item in pageKind" :key="item.key" :label="item.text" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="起止时间" prop="startAtByDate">
              <el-date-picker
                v-model="query.startAtByDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endAtByDate">
              <el-date-picker
                v-model="query.endAtByDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="活动标签">
              <el-select
                v-model="query.tagIds"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="primary" @click="crud.toQuery()">筛选</el-button>
                <el-button @click="crud.resetQuery()"> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="活动图片" width="180px">
              <template slot-scope="scope">
                <ActivityBanner :item="{ pageBannerUrl: scope.row.pageBannerUrl, pageBannerDefault: scope.row.pageBannerDefault }" />
              </template>
            </el-table-column>
            <el-table-column label="活动标题/标签" prop="title" min-width="120px">
              <template slot-scope="scope">
                <p>[已删]{{ scope.row.title }}</p>
                <p class="text-muted">{{ scope.row.code }}</p>
              </template>
            </el-table-column>
            <el-table-column label="活动类别/互动类型" prop="title" width="140px">
              <template slot-scope="scope">
                <p>{{ scope.row.typeText }}</p>
                <p class="text-muted">{{ scope.row.pageTypeText }}</p>
              </template>
            </el-table-column>
            <el-table-column label="起止时间" prop="startAt" width="140px">
              <template slot-scope="scope">
                <p>{{ scope.row.startAt }}</p>
                <p>{{ scope.row.endAt }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态/抽奖进度" prop="state" width="120px">
              <template slot-scope="scope">
                <el-tag type="info" effect="plain">已删除</el-tag>
                <p style="margin-top: 5px;">
                  <el-progress v-if="scope.row.state !== 'pending'" :text-inside="true" :stroke-width="16" :percentage="scope.row.rafflePercentage" status="success" />
                </p>
              </template>
            </el-table-column>
            <el-table-column label="码量/号段" prop="amount" width="160px">
              <template slot-scope="scope">
                <p>码量: {{ scope.row.amount }}</p>
                <div v-if="scope.row.snRanges.length">号段:
                  <span v-if="scope.row.snRanges.length <= 1">{{ scope.row.snRanges[0]['startSn'] }} ~ {{ scope.row.snRanges[0]['endSn'] }}</span>
                  <el-tooltip v-else placement="top">
                    <div slot="content">
                      <span v-for="(item, index) in scope.row.snRanges" :key="index">{{ item['startSn'] }} ~ {{ item['endSn'] }} [{{ item.count }}]<br></span>
                    </div>
                    <span style="cursor: pointer;">{{ scope.row.snRanges[0]['startSn'] }} ~ {{ scope.row.snRanges[0]['endSn'] }}...</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="可见管理员">
              <template slot-scope="scope">
                {{ scope.row.accounts }}
              </template>
            </el-table-column>
            <el-table-column label="删除时间" prop="deletedAt" width="140px" />
            <el-table-column v-if="checkPer(['su', 'store:inspector'])" label="操作" prop="action">
              <template slot-scope="scope">
                <a :href="`/lmp/v2/management/inspect?storeId=${scope.row.storeId}&path=${encodeURIComponent(`/admin/activities/${scope.row.id}`)}`" target="_blank">查看</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
              <template slot-scope="scope">
                <el-button type="text" :loading="loading.includes(scope.row.id)" @click="restore(scope.row)">恢复</el-button>
                <el-button type="text" :loading="loading.includes(scope.row.id)" @click="toDelete(scope.row)">彻底删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import ActivityBanner from '@/components/ActivityBanner'
import activities from '@/api/activities'
import tags from '@/api/tag'
export default {
  components: {
    pagination,
    ActivityBanner
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '活动回收站', url: '/lmp/v2/admin/activity/deleted_index', sort: 'id,desc' })
  },
  data() {
    return {
      loading: [],
      typeKind: [
        { key: 'Activity', text: '单码活动' },
        { key: 'UnitsActivity', text: '一物一码活动' },
        { key: 'AntiFakeActivity', text: '防伪溯源码' },
        { key: 'InvitingActivity', text: '分享有礼' },
        { key: 'SharingActivity', text: '分享活动' }
      ],
      pageKind: [
        { key: 'WheelPage', text: '大转盘' },
        { key: 'AwardPage', text: '扫码中奖' },
        { key: 'Award2Page', text: '扫码中奖' },
        { key: 'ScratchPage', text: '刮刮卡' },
        { key: 'PointPage', text: '扫码送积分' },
        { key: 'RedPackPage', text: '扫码送红包' },
        { key: 'RedPack2Page', text: '扫码送红包' },
        { key: 'ShakePage', text: '摇一摇' },
        { key: 'PasswordPage', text: '口令红包' },
        { key: 'NineTilesPage', text: '九宫格' },
        { key: 'ImagePage', text: '自定义活动图' },
        { key: 'YeluoliPage', text: '叶罗丽' },
        { key: 'HaiXinPage', text: '海欣情感文案红包' },
        { key: 'SubscribePage', text: '关注领红包' },
        { key: 'AntiFakePage', text: '产品防伪' },
        { key: 'AntiFake2Page', text: '产品防伪2' },
        { key: 'AntiFake3Page', text: '产品防伪3' },
        { key: 'AntiFake4Page', text: '产品防伪-视频' },
        { key: 'ProductRedPack2Page', text: '防伪红包' },
        { key: 'SharingPage', text: '分享后领奖' },
        { key: 'SharingRedPackPage', text: '分享领红包' },
        { key: 'QuickRedPackPage', text: '一键领红包' },
        { key: 'RedPackPopupPage', text: '开红包' },
        { key: 'CheckinPage', text: '日历签到' },
        { key: 'RainPage', text: '红包雨' },
        { key: 'RainBPage', text: '红包雨B' },
        { key: 'ProductRedPackPage', text: '红包产品信息' },
        { key: 'EggPage', text: '砸金蛋' },
        { key: 'CodePage', text: '验证码页面' },
        { key: 'HongChuanPage', text: '自定义产品验证码' },
        { key: 'DistinguishGenuinePage', text: '验证码查真伪' },
        { key: 'DistinguishGenuineAwardPage', text: '验证码查真伪抽奖' },
        { key: 'Wheel3dPanelPage', text: '旋转台' },
        { key: 'JinHuiCodePage', text: '自定义产品验证码2' },
        { key: 'JinHuiProductPage', text: '自定义产品' },
        { key: 'TurnOverPage', text: '幸运翻牌' },
        { key: 'TurnOverBPage', text: '翻牌赢好礼' },
        { key: 'TurnOverCodePage', text: '验证码幸运翻牌' },
        { key: 'JtwRedPackPopupPage', text: '京文投开红包' },
        { key: 'ChaogeTurnOverPage', text: '槟榔翻牌' },
        { key: 'ZxfTurnOverPage', text: '槟榔翻牌2' },
        { key: 'LjjyTurnOverPage', text: '龙江家园' },
        { key: 'XunYuZiJiangAntiFakePage', text: '鲟鱼子酱防伪' },
        { key: 'XunYuZiJiangAntiFakebPage', text: '鲟鱼子酱防伪2' },
        { key: 'WheelBPage', text: '大转盘 B' },
        { key: 'NineTilesBPage', text: '九宫格 B' },
        { key: 'SlotMachinePage', text: '欢乐老虎机' },
        { key: 'SlotMachine32Page', text: '欢乐老虎机32' },
        { key: 'LassoPage', text: '幸运套圈' },
        { key: 'MoneyPage', text: '疯狂数钱' },
        { key: 'SurpriseRedPackPage', text: '复购红包' }
      ],
      tagList: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '活动回收站' }])
    this.crud.refresh()
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
  },

  methods: {
    restore(data) {
      this.loading.push(data.id)
      activities.restore(data).then(response => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.$message.success('恢复成功')
        this.crud.refresh()
      }).catch(fail => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.crud.refresh()
      })
    },
    toDelete(data) {
      if (confirm('确认彻底删除？彻底删除后将无法恢复。')) {
        activities.real_delete(data).then(response => {
          this.loading = this.loading.filter(i => i !== data.id)
          this.$message.success('删除成功')
          this.crud.refresh()
        }).catch(fail => {
          this.loading = this.loading.filter(i => i !== data.id)
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
p { margin: 0;}
</style>
