<template>
  <div class="app-container">
    <div v-if="activity.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，<router-link v-if="activity.id" :to="{ name: 'ActivityShow', params: {activityId: activity.id }}">点击返回主活动</router-link>
    </div>
    <tab :activity="activity" />
    <div class="panel panel-default">
      <div class="panel-body">
        <step v-if="activity.state === 'pending'" :active="2" :activity="activity" />
        <div class="alert alert-info" role="alert" style="display: flex; align-items: baseline;">
          <template v-if="activity[var2LowerCase('suite_award_enabled')]">
            <i class="fa fa-info-circle" style="margin-right: 2px" />
            当前产品包装规格为{{ activity.unitSpec.specLabel }}，可设置一个或多个奖项及数量，最多不超过 {{ activity.unitSpec.level1Num }}个中奖礼品，每{{ activity.unitSpec.level2Label }}都按照同等抽奖规则中奖。
          </template>
          <template v-else>
            <i class="fa fa-info-circle" style="margin-right: 2px" />
            <div>
              <div>
                奖项顺序将影响中奖概率：当总概率大于100%时，仅排在前100%的奖项参与抽奖。
                <a target="blank" href="/lgp/portal/help/articles/4?cid=3">
                  详细说明
                  <small><i class="fa fa-external-link" /></small>
                </a>
              </div>
              <div v-if="activity.page.type === 'SurpriseRedPackPage'">
                &nbsp;&nbsp;&nbsp;&nbsp;特别说明：1.本活动只能配置红包类奖项，奖项最少配置两个。
                <br> &nbsp;&nbsp;&nbsp;&nbsp;<span class="surprise_red_pack_desc">2.奖项必须且最多设置一个规则为“根据上次参与活动时间抽奖”，此奖项排序必须置顶。</span>
              </div>
            </div>
          </template>
        </div>
        <div class="panel panel-default">
          <div class="panel-body flex justify-content__space-between items-center">
            <div class="flex-item">
              <el-button v-if="checkPer(['activity_update'])" type="success" :disabled="crud.data.length >= activity.page.maxAwardsLength" @click="dialog.show = true">
                <i class="fa fa-plus" /> 添加奖项
              </el-button>
              <i class="fa fa-info-circle" style="margin-left: 5px;" /> 最多可以设置 {{ activity.page.maxAwardsLength }} 个奖项
            </div>
            <span class="pull-right amount_shown">
              活动二维码量：<span class="amount">{{ activity.takenAmount }}</span>
            </span>
          </div>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <i class="fa fa-list" /> 共{{ crud.data.length }}项，总中奖概率{{ total_winning_probability_num }}%（仅计算根据奖品数量抽奖概率）
          </div>
          <LflTable v-loading="crud.loading" :list="crud.data">
            <table class="table table-bordered table-hover" style="margin-bottom: 0;">
              <thead>
                <tr>
                  <th v-if="checkPer(['activity_update'])" width="77px">拖拽排序</th>
                  <th>奖项</th>
                  <th>图片</th>
                  <th>奖品</th>
                  <th>礼品类型</th>
                  <th>{{ activity.suiteAwardEnabled ? '奖品数量' : '已中奖/奖品总数' }}</th>
                  <th>礼品库存</th>
                  <th>抽奖规则</th>
                  <th style="width: 100px;">操作</th>
                </tr>
              </thead>
              <draggable v-model="crud.data" element="tbody" handle=".move" @start="drag=true" @end="drag=false" @update="positionAwards">
                <tr v-for="item in crud.data" :key="item.id + 'awards'" :data-id="item.id">
                  <td v-if="checkPer(['activity_update'])" align="center">
                    <div class="move" style="width: 100%; height: 50px; line-height: 50px;">
                      <i class="fa fa-arrows" />
                    </div>
                  </td>
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
                  <td :label="activity.suiteAwardEnabled ? '奖品数量' : '已中奖/奖品总数'">
                    <template v-if="activity.suiteAwardEnabled">
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
                  <td label="操作">
                    <template v-if="activity.state === 'pending' ? checkPer(['activity_create']) : checkPer(['activity_update'])">
                      <el-button type="text" @click="toEdit(item)">编辑</el-button>
                      <el-button v-if="activity.state === 'pending' || !activity.suiteAwardEnabled" type="text" @click="del(item)">删除</el-button>
                    </template>
                    <template v-else>
                      {{ item.createdAt }}
                    </template>
                  </td>
                </tr>
              </draggable>
            </table>
          </LflTable>
        </div>
        <div v-if="activity.state === 'pending'" class="panel-footer">
          <router-link :to="{name: 'ActivityEditPage', params: { activityId: activity.id }}" class="el-button el-button--success">保存，并下一步</router-link>
          <router-link :to="{name: 'ActivityAdvanceEdit', params: { activityId: activity.id }}" class="el-button">上一步</router-link>
          <router-link :to="{name: 'ActivityWizardCheck', params: { activityId: activity.id }}" class="el-button">确认并创建活动</router-link>
        </div>

      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :visible.sync="dialog.show"
      :before-close="cancel"
      top="5vh"
      width="780px"
    >
      <div slot="title">
        <h4 style="display: inline;">
          添加奖项
          <small>
            <a target="blank" href="http://admin.lifanli.cn/lgp/portal/help/articles/41?cid=3"><i class="fa fa-question-circle-o" /> 帮助</a>
          </small>
        </h4>
      </div>
      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
        <el-form-item label="奖品名称" prop="title">
          <el-input v-model="form.title" />
          <p class="help-block">最多9个字符</p>
        </el-form-item>
        <el-form-item label="奖品数量" prop="quantity">
          <el-input v-model="form.quantity" :disabled="form.awardItemsEnabled || (action === 'edit' && activity.suiteAwardEnabled)">
            <template slot="append">份</template>
          </el-input>
          <p class="help-block">当奖品数量设置为0时，本奖项不会中奖。</p>
        </el-form-item>
        <el-form-item label="奖项礼品" prop="goodId">
          <template v-if="action === 'add'">
            <el-input v-model="goodsModal.awardGoods.name" placeholder="请点击右侧按钮选择" :disabled="true">
              <template slot="append"><el-button type="success" @click="goodsModal.award = true">选择</el-button></template>
            </el-input>
            <p class="help-block">列表中没有想要的礼品？<router-link :to="{ name: 'GoodsListNew'}" target="_blank">点击新建礼品</router-link></p>
          </template>
          <div v-if="Object.keys(goodsModal.awardGoods).length" class="panel panel-default" style="line-height: 1.4; margin-bottom: 0;" :style="{marginTop: action === 'add' ? '15px' : '0px'}">
            <el-table :data="[goodsModal.awardGoods]">
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
        <el-form-item v-if="checkPer(['child_good_func_enabled']) && activityJS.page[var2LowerCase('child_good_enabled')]" label="附加礼品" prop="childGoodEnabled">
          <el-switch v-model="form.childGoodEnabled" :disabled="action === 'edit'" />
          <p class="help-block">开启后，本奖项中奖时可额外获得一个礼品</p>
          <div v-if="form.childGoodEnabled" class="child-form">
            <el-form-item label="附加礼品">
              <template v-if="action === 'add'">
                <el-input v-model="goodsModal.childGoods.name" :disabled="true" placeholder="请点击右侧按钮选择">
                  <template slot="append"><el-button type="success" @click="goodsModal.childGood = true">选择</el-button></template>
                </el-input>
                <p class="help-block">列表中没有想要的礼品？<router-link :to="{ name: 'GoodsListNew'}" target="_blank">点击新建礼品</router-link></p>
              </template>
              <div v-if="Object.keys(goodsModal.childGoods).length" class="panel panel-default" style="line-height: 1.4; margin-bottom: 0;" :style="{marginTop: action === 'add' ? '15px' : '0px'}">
                <el-table :data="[goodsModal.childGoods]">
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
          </div>
        </el-form-item>
        <el-form-item label="抽奖规则" prop="type" style="margin-bottom: 0">
          <el-select v-if="action === 'edit'" v-model="form.type" :disabled="action === 'edit'">
            <el-option v-for="item in awardTypeListAll" :key="item.key" :label="item.text" :value="item.type" />
          </el-select>
          <el-select v-else v-model="form.type">
            <el-option v-for="item in awardTypeList" :key="item.key" :label="item.text" :value="item.type" />
          </el-select>
          <div v-if="form.type" class="award_info">
            <div class="alert alert-info" role="alert">
              <i class="fa fa-info-circle" /> <span v-html="info" />
            </div>
          </div>
        </el-form-item>
        <component :is="form.type" v-if="!['SuiteAward', 'Award'].includes(form.type)" />
        <el-form-item v-if="registerFuncEnabled || vipFuncEnabled" label="中奖打标签">
          <el-select v-model="form.userTagIds" multiple :multiple-limit="10" clearable>
            <el-option
              v-for="(item, index) in userTags"
              :key="index +'_tags'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <p class="help-block">用户中奖后，会给该用户打上相应的标签，或<router-link :to="{ name: 'UserTags'}" target="_blank">新建用户标签</router-link></p>
        </el-form-item>
        <el-form-item v-if="account.store.awardExcludeEnabled && form.type !== 'UserTagAward'" label="不可中奖用户">
          <el-select v-model="form.excludeUserTagIds" multiple :multiple-limit="10" clearable>
            <el-option
              v-for="(item, index) in userTags"
              :key="index +'_tags'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <p class="help-block">本设置所选择的用户标签，将不会中奖本奖项</p>
        </el-form-item>
        <el-form-item v-if="!activity.suiteAwardEnabled" label="中奖间隔">
          <el-switch v-model="form.intervalEnabled" />
          <p class="help-block">开启后，可设置本奖项两次中奖的最小间隔时间</p>
        </el-form-item>

        <el-form-item v-if="form.intervalEnabled" label="间隔时间" prop="intervalHours">
          <el-input v-model.number="form.intervalHours">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="!activity.formBeforeAttending && activity.formWithAwardsEnabled" label="是否填表">
          <el-switch v-model="form.formEnabled" />
        </el-form-item>

        <el-form-item v-if="activity.canRebateEnabled" label="导购礼品">
          <el-switch v-model="form.rebateEnabled" />
          <p class="help-block">
            开启后，可设置顾客中奖后导购可获得的礼品。<br>
            例如：可设置用户中手机大奖时，导购员可获得100元红包。
          </p>
          <div v-if="form.rebateEnabled" class="child-form">
            <el-form-item label="导购礼品" prop="rebateGoodId">
              <el-input v-model="goodsModal.rebateGoods.name" :disabled="true" placeholder="请点击右侧按钮选择">
                <template slot="append"><el-button type="success" @click="goodsModal.rebate = true">选择</el-button></template>
              </el-input>
              <p class="help-block">列表中没有想要的礼品？<router-link :to="{ name: 'GoodsListNew'}" target="_blank">点击新建礼品</router-link></p>
              <div v-if="Object.keys(goodsModal.rebateGoods).length" class="panel panel-default" style="line-height: 1.4; margin-bottom: 0;" :style="{marginTop: action === 'add' ? '15px' : '0px'}">
                <el-table :data="[goodsModal.rebateGoods]">
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
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-left">
        <el-button type="success" :loading="loading" @click="submit">{{ action === 'edit' ? '保存' : '创建奖项' }}</el-button>
        <el-button @click="cancel"> 取消</el-button>
      </div>
    </el-dialog>
    <GoodsDialog v-if="goodsModal.award" :show.sync="goodsModal.award" :except="goodsDialogExcept">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </GoodsDialog>
    <GoodsDialog v-if="goodsModal.rebate" :show.sync="goodsModal.rebate" :except="goodsDialogExceptForRebate">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="selectRebate(row.data)">选择</el-button>
      </template>
    </GoodsDialog>
    <GoodsDialog v-if="goodsModal.childGood" :show.sync="goodsModal.childGood" :except="goodsDialogExcept">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="selectChildGood(row.data)">选择</el-button>
      </template>
    </GoodsDialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/activity.vue'
import activities from '@/api/activities'
import awards from '@/api/awards'
import tags from '@/api/tag'
import point_store from '@/api/point_store'
import step from './components/step.vue'
import LflTable from '@/components/LflTable'
import CRUD, { presenter, crud, header } from '@crud/crud'
import { mapGetters } from 'vuex'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'
import draggable from 'vuedraggable'
import GoodsDialog from '@/components/Goods/modal.vue'
import SnAward from './components/awards/SnAward.vue'
import TimeRangeAward from './components/awards/TimeRangeAward.vue'
import UserTagAward from './components/awards/UserTagAward.vue'
import AttendingsAward from './components/awards/AttendingsAward.vue'
import ContAttendingsAward from './components/awards/ContAttendingsAward.vue'
import EqualAttendingAward from './components/awards/EqualAttendingAward.vue'
import LocationAward from './components/awards/LocationAward.vue'
import LocationRadiusAward from './components/awards/LocationRadiusAward.vue'
import ContDaysAward from './components/awards/ContDaysAward.vue'
import ContActAttendingsAward from './components/awards/ContActAttendingsAward.vue'
import EqualActAttendingAward from './components/awards/EqualActAttendingAward.vue'
import VipAward from './components/awards/VipAward.vue'
import TimeRangeAndLocationRadiusAward from './components/awards/TimeRangeAndLocationRadiusAward.vue'
import TimeRangeAndLocationAward from './components/awards/TimeRangeAndLocationAward.vue'
import TakenCountAward from './components/awards/TakenCountAward.vue'
import PreviousAttendingAward from './components/awards/PreviousAttendingAward.vue'
import TimeLocationItemAward from './components/awards/TimeLocationItemAward.vue'
import TimeLocationRadiusItemAward from './components/awards/TimeLocationRadiusItemAward.vue'
import TimeLocationRadiusEqualActAttendingAward from './components/awards/TimeLocationRadiusEqualActAttendingAward.vue'
import { validPositiveInteger } from '@/utils/validate.js'

const defaultForm = {
  title: null,
  quantity: 0,
  goodId: null,
  type: null,
  snStart: null,
  takenCount: null,
  attendingCycle: 'activity',
  attendingsCount: null,
  attendingsRule: null,
  childGoodId: null,
  customPercentage: null,
  startAt: null,
  endAt: null,
  cycleType: 'every_day',
  scheduledDateValues: '',
  weekValue: [],
  startHour: 0,
  endHour: 24,
  amount: null,
  contAttendings: null,
  contDays: null,
  intervalEnabled: false,
  intervalHours: 0,
  rebateGoodId: null,
  regions: [],
  tagId: null,
  attendingWithinDays: 0,
  addrs: [{
    coord: '',
    radius: null,
    address: ''
  }],
  regionRules: [{
    province: null,
    city: null,
    district: null,
    quantity: null,
    code: []
  }],
  radiusRules: [{
    coord: '',
    radius: null,
    address: null,
    quantity: null
  }],
  userTagIds: [],
  excludeUserTagIds: []
}

export default {
  provide() {
    return {
      _award_form: this
    }
  },
  components: {
    tab,
    step,
    LflTable,
    CustomImg,
    GoodsPrice,
    draggable,
    GoodsDialog,
    SnAward,
    TimeRangeAward,
    UserTagAward,
    AttendingsAward,
    ContAttendingsAward,
    EqualAttendingAward,
    LocationAward,
    LocationRadiusAward,
    ContDaysAward,
    ContActAttendingsAward,
    EqualActAttendingAward,
    VipAward,
    TimeRangeAndLocationRadiusAward,
    TimeRangeAndLocationAward,
    TakenCountAward,
    PreviousAttendingAward,
    TimeLocationItemAward,
    TimeLocationRadiusItemAward,
    TimeLocationRadiusEqualActAttendingAward
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '奖项', url: `/lmp/v2/admin/activity/${this.parent.$route.params.activityId}/awards`, sort: [], props: { noParams: true }})
  },
  data() {
    return {
      activityJS: {
        page: {}
      },
      goodsDialogExcept: [],
      drag: false,
      activity: {
        page: {},
        unitSpec: {}
      },
      awardTypeList: [],
      awardTypeListAll: [],
      dialog: { show: false },
      action: 'add',
      rules: {
        quantity: [
          { validator: validPositiveInteger, trigger: 'blur' },
          { required: true, message: '奖品数量不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '奖项名称不能为空', trigger: 'blur' },
          { max: 9, message: '不能超过9个字符', trigger: ['blur', 'change'] }
        ],
        goodId: [
          { required: true, message: '奖项礼品不能为空', trigger: 'blur' }
        ],
        rebateGoodId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        childGoodId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '抽奖规则不能为空', trigger: 'blur' }
        ],
        intervalHours: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) <= 0) {
              callback(new Error('必须大于或等于 1'))
            } else if (Number(value > 10000)) {
              callback(new Error('必须小于或等于 10000'))
            } else {
              callback()
            }
          } }
        ]
      },
      goodsModal: {
        award: false,
        awardGoods: {},
        rebate: false,
        rebateGoods: {},
        childGood: false,
        childGoods: {}
      },
      form: Object.assign({}, defaultForm),
      info: '',
      total_winning_probability_num: '',
      goodsDialogExceptForRebate: ['other', 'suite_card'],
      loading: false,
      userTags: [],
      registerFuncEnabled: false,
      vipFuncEnabled: false
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData'])
  },
  watch: {
    'form.type'(newValue) {
      if (newValue) {
        const obj = this.awardTypeList.find(item => item.type === this.form.type)
        this.info = obj.info
      }
    }
  },
  async mounted() {
    this.activity = { ...this.activity, ...this.activityData }
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.state === 'pending' ? '奖项管理' : this.activityData.title }
    ])
    this.activityJS = this.activityData
    if (this.activityJS.pageType === 'SurpriseRedPackPage') {
      this.goodsDialogExcept = ['other', 'point', 'coupon', 'suite_card']
    }
    this.crud.refresh()
    activities.awards_type({ ...this.$route.params }).then(({ data }) => {
      this.awardTypeList = data
      this.form.type = data[0]['type']
    })
    activities.awards_all_type().then(({ data }) => {
      this.awardTypeListAll = data
    })
    point_store.functions().then(response => {
      this.registerFuncEnabled = response.data.registerFuncEnabled
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })
    tags.all({ type: 'UserTag' }).then(({ data }) => {
      this.userTags = data
    })
  },
  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      this.probability()
    },
    positionAwards(evt) {
      activities.awards_position({ id: evt.item.getAttribute('data-id'), newPosition: evt.newIndex, activityId: this.$route.params.activityId }).then(({ data }) => {
        this.$message.success('排序成功')
      })
    },
    select(data) {
      this.goodsModal.awardGoods = data
      this.goodsModal.award = false
      this.form.goodId = data.id
    },
    selectRebate(data) {
      this.goodsModal.rebateGoods = data
      this.goodsModal.rebate = false
      this.form.rebateGoodId = data.id
    },
    selectChildGood(data) {
      this.goodsModal.childGoods = data
      this.goodsModal.childGood = false
      this.form.childGoodId = data.id
    },
    async toEdit(item) {
      this.action = 'edit'
      await awards.get(item).then(({ data }) => {
        this.goodsModal.awardGoods = data.goods
        this.goodsModal.rebateGoods = data.rebateGood || {}
        this.goodsModal.childGoods = data.childGood || {}
        this.dialog.show = true
        this.form = data
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          awards[this.action]({ activityId: this.$route.params.activityId, ...this.form }).then(response => {
            this.cancel()
            this.crud.refresh()
            this.loading = false
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.dialog.show = false
      if (this.action === 'add') {
        this.$refs.form.resetFields()
      } else {
        this.form = Object.assign({}, defaultForm)
      }
      this.form.type = this.awardTypeList[0]['type']
      this.goodsModal.awardGoods = {}
      this.goodsModal.rebateGoods = {}
      this.goodsModal.childGoods = {}
      this.action = 'add'
    },
    del(data) {
      if (confirm('确认删除吗？若设置了附加礼品或导购礼品也将被同时删除。')) {
        awards.del({ activityId: this.$route.params.activityId, id: data.id }).then(response => {
          this.crud.refresh()
          this.$message.success('删除成功')
        })
      }
    },
    probability() {
      awards.total_winning_probability({ activityId: this.$route.params.activityId }).then(({ data }) => {
        this.total_winning_probability_num = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table.table-bordered > thead > tr > th {
  border-top: none;
}
.table.table-bordered tbody tr {
  background: #FFF;
}
.amount {
  font-weight: bold;
  font-size: 18px;
}

.award_info {
  margin: 10px 0;
  line-height: 1.4;
}
.surprise_red_pack_desc{
  margin-left: 5em;
}
.danger {
  background-color: #f2dede;
}
</style>
