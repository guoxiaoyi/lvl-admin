<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name | tabTitle }}
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item v-if="!portalGoods.includes(form.type)" ref="type" label="礼品类型">
            {{ typeName['label'] }}
          </el-form-item>
          <el-form-item v-if="form.type === 'Good::SuiteChildCardGood'" ref="type" label="所属套卡">
            {{ suite_card.name }}
          </el-form-item>
          <el-form-item v-if="form.type === 'Good::SuiteChildCardGood'" ref="type" label="卡片名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item v-if="form.type !== 'Good::SuiteChildCardGood' && !portalGoods.includes(form.type)" ref="name" label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <!-- 针对不同类型的礼品，render不同的field -->

          <el-form-item v-if="has_par" ref="par" key="par" label="红包金额" prop="par">
            <div class="el-custom-input-group">
              <el-input v-model="form.par" :disabled="$route.name === 'GoodsEdit' && $route.query.action !== 'dup'" />
              <div class="el-input-group-addon">元</div>
            </div>
            <p v-if="form.type === 'Good::CashGood'" class="help-block">小额红包金额最低为0.01元，可以精确到分</p>
            <p v-else-if="form.type === 'Good::Transfer'" class="help-block">微信红包金额为0.30至4999.00元，可以精确到分</p>
            <p v-else-if="form.type !== 'Good::LflTransfer'" class="help-block">微信红包金额为 1.00 至 {{ form.type === 'Good::LflRedPack' ? '200.00' : '4990.00' }} 元之间，可以精确到分；{{ form.type === 'Good::LflRedPack' ? '' : '金额小于1元或大于200元时，必须设置使用场景' }}  </p>
            <p v-else class="help-block">微信红包金额为 0.3 至 {{ account.store.parGoodLimit }} 元中间，可以精确到分</p>
          </el-form-item>

          <el-form-item v-if="has_scene" ref="scene" key="scene" prop="scene" label="使用场景">
            <el-select v-model="form.scene" clearable>
              <el-option
                v-for="item in scene"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
            <p class="help-block">红包金额在1至200元之间时可不设置；如需设置，请确保在微信支付-红包安全设置中，开启相应使用场景及允许金额范围</p>
          </el-form-item>

          <el-form-item v-if="has_wishing" ref="wishing" key="wishing" prop="wishing" label="祝福语" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
            <el-input v-model="form.wishing" type="textarea" :autosize="{ minRows: 1, maxRows: 1}" :show-word-limit="true" maxlength="20" />
            <p class="help-block"> 用户收到红包时展示。需少于20个汉字，含标点符号 </p>
          </el-form-item>

          <el-form-item v-if="has_url" ref="url" key="url" label="卡券领取链接" prop="url" :rules="[{required: true, message: '卡券领取链接不能为空', trigger: 'blur'}]">
            <el-input v-model="form.url" />
            <p class="help-block">外链卡券的领取链接地址（链接格式如: http://www.lifanli.cn）  </p>
          </el-form-item>

          <el-form-item v-if="form.type === 'Good::PointsGood'" label="积分额度" prop="pointsPar">
            <el-input v-model="form.pointsPar" :controls="false" :disabled="$route.name === 'GoodsEdit' && $route.query.action !== 'dup'">
              <template slot="append">积分</template>
            </el-input>
            <p class="help-block">设置积分后，获得此商品，可同时获得相应积分。积分额需为整数。</p>
          </el-form-item>

          <el-form-item v-if="!unless_auto_confirm" ref="autoConfirm" label="自动确认">
            <el-switch v-model="form.autoConfirm" />
            <p class="help-block"> 开启后，领取后订单自动确认；关闭后，需要管理员在订单管理中手动确认后，才发送活动礼品 </p>
          </el-form-item>
          <el-form-item v-if="has_valid_days" ref="validDays" label="有效天数">
            <div class="el-custom-input-group">
              <el-input v-model="form.validDays" />
              <div class="el-input-group-addon">天</div>
            </div>
            <p class="help-block">设置领取后几天内有效  </p>
          </el-form-item>
          <el-form-item v-if="!portalGoods.includes(form.type)" label="图片">
            <div style="display: flex; flex-wrap: wrap;" class="abcde">
              <el-card v-for="(image, index) in form.imageList" :key="index" shadow="always" class="slide-image" :body-style="{ padding: '0px', display: 'flex' }">
                <div class="delete-item" @click="removeSlideItem(image)">
                  <i class="el-icon-delete-solid" />
                </div>
                <el-image class="image-item" :src="image.imageUrls.small" fit="cover" />
              </el-card>
            </div>
            <editorImage type="success" @successCBK="setSlideImage" />
            <p class="help-block">尺寸：400 x 400px，格式：png，jpg，gif</p>
          </el-form-item>
          <el-form-item label="优惠内容">
            <div class="el-custom-input-group">
              <div class="el-input-group-addon">订单满</div>
              <el-form-item>
                <el-input v-model="form.minConsume" :disabled="$route.name === 'GoodsEdit' && $route.query.action !== 'dup'" />
              </el-form-item>
              <div class="el-input-group-addon">元, 优惠</div>
              <el-form-item>
                <el-input v-model="form.discountAmount" :disabled="$route.name === 'GoodsEdit' && $route.query.action !== 'dup'" />
              </el-form-item>
              <div class="el-input-group-addon">元</div>
            </div>
            <p class="help-block">用于消费者的结算抵扣，仅当商品订单金额大于抵扣金额时可用。设置大额抵扣券时需谨慎，以免造成资损</p>
          </el-form-item>
          <el-form-item label="有效天数">
            <div class="el-custom-input-group">
              <el-input v-model="form.validDays" />
              <div class="el-input-group-addon">天</div>
            </div>
            <p class="help-block">设置领取后几天内有效</p>
          </el-form-item>
          <el-form-item v-if="!portalGoods.includes(form.type)" ref="description" label="图文详情" class="form-item-tinymce">
            <Tinymce ref="editor" v-model="form.description" :height="400" />
          </el-form-item>
          <h5 v-if="!portalGoods.includes(form.type)">
            高级设置 &nbsp;&nbsp;&nbsp;&nbsp;
            <div class="advanced_edit_btn" @click="advanced = !advanced">
              {{ advanced ? '收起' : '展开' }} <i :class="`el-icon-arrow-${advanced ? 'up' : 'down'}`" />
            </div>
          </h5>
          <hr v-if="!portalGoods.includes(form.type)">
          <div v-show="advanced">
            <el-form-item v-if="!portalGoods.includes(form.type)" ref="smsNotify" label="礼品兑换通知">
              <el-switch v-model="form.smsNotify" />
              <p class="help-block"> 开启后，当用户兑换此礼品后，发送订单短信通知商户管理员 </p>
            </el-form-item>

            <el-form-item v-if="!portalGoods.includes(form.type) && form.type !== 'Good::PointsGood'" ref="pointsPar" label="赠送积分" prop="pointsPar">
              <el-switch v-model="pointsPar" :disabled="['GoodsEdit'].includes($route.name) && $route.query.action !== 'dup'" />
              <p class="help-block"> 开启后，获得此商品的同时获得所设置相应积分。 </p>
              <div v-if="pointsPar" class="el-custom-input-group" style="margin-top: 10px">
                <el-input v-model="form.pointsPar" :disabled="['GoodsEdit'].includes($route.name) && $route.query.action !== 'dup'" />
                <div class="el-input-group-addon">积分</div>
              </div>
              <p v-if="pointsPar" class="help-block">设置积分后，获得此商品，可同时获得相应积分。积分额需为整数。  </p>
            </el-form-item>
            <el-form-item ref="stockNoticeLimit" label="库存预警阈值" prop="stockNoticeLimit">
              <el-input v-model="form.stockNoticeLimit" />
              <p class="help-block">设置当前商品库存预警，为0时将执行基础预警阈值</p>
            </el-form-item>
            <el-form-item label="可见管理员">
              <el-select v-model="form.accountIds" multiple filterable>
                <el-option
                  v-for="item in accounts"
                  :key="'account_'+item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <p class="help-block"> 选择的管理员可查看本礼品，否则只有自己可见。 </p>
            </el-form-item>
          </div>
        </el-form>
        <hr>
        <el-button v-if="checkPer(['good_update'])" type="success" :loading="submitting" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import suite_cards from '@/api/suite_cards'
import Tinymce from '@/components/Tinymce'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import account from '@/api/account'
import goods from '@/api/goods'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'

export default {
  components: {
    editorImage,
    Tinymce
  },
  filters: {
    tabTitle(name) {
      let title = '新建礼品'
      switch (name) {
        case 'SuiteCardNew':
          title = '新建套卡'
          break
        case 'GoodsEdit':
          title = '编辑礼品'
          break
        case 'SuiteCardChildGoodsNew':
          title = '新建卡片'
          break
      }
      return title
    }
  },
  data() {
    return {
      submitting: false,
      pointsPar: false,
      form: {
        name: null,
        type: null,
        imageList: [],
        autoConfirm: true,
        description: null,
        smsNotify: false,
        pointsPar: 0,
        stockNoticeLimit: 0,
        accountIds: [],
        groupIds: [],
        imageIds: [],
        onSale: false,
        onlyShow: false,
        par: 0,
        paymentType: 'points',
        points: 0,
        refPrice: 0,
        saleQuantity: 0,
        scene: '',
        stockQuantity: 0,
        totalNum: 3,
        url: '',
        validDays: 0,
        wishing: '',
        minConsume: null
      },
      rules: {
        name: [
          { required: true, message: `不能为空`, trigger: 'blur' }
        ],
        refPrice: [
          { validator(rule, value, callback) {
            if (!Number(value) && Number(value) !== 0) {
              callback(new Error('必须是数字'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于等于0'))
            } else {
              callback()
            }
          } }
        ],
        par: [
          { required: true, message: '红包金额不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number(value) && Number(value) !== 0) {
              callback(new Error('必须是数字'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于等于0'))
            } else {
              callback()
            }
          } }
        ],
        points: [
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        cash: [
          { validator(rule, value, callback) {
            if (!Number(value) && Number(value) !== 0) {
              callback(new Error('必须是数字'))
            } else if (Number(value) <= 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        pointsPar: [
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        stockNoticeLimit: [
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        exchangeRuleDays: [
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        exchangeRuleTimes: [
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ]
      },
      accounts: [],
      type: [
        { key: 'Good::VirtualGood', label: '非物流礼品' },
        { key: 'Good::PhysicalGood', label: '实物物流礼品' },
        { key: 'Good::CouponGood', label: '第三方卡券' },
        { key: 'Good::LflCoupon', label: '自主卡券' },
        { key: 'Good::MobileFee', label: '话费' },
        { key: 'Good::RedPack', label: '手拆红包(自发)' },
        { key: 'Good::LflRedPack', label: '手拆红包' },
        { key: 'Good::GroupRedPack', label: '裂变红包(自发)' },
        { key: 'Good::LflGroupRedPack', label: '裂变红包' },
        { key: 'Good::PointsGood', label: '积分' },
        { key: 'Good::CashGood', label: '小额红包' },
        { key: 'Good::CardGood', label: '微信卡券' },
        { key: 'Good::Transfer', label: '微信直达红包(自发)' },
        { key: 'Good::LflTransfer', label: '微信直达红包' },
        { key: 'Good::LinkCoupon', label: '外链卡券' },
        { key: 'Good::GiftCouponCharge', label: '虚拟礼品直充' },
        { key: 'Good::GiftFree', label: '精选礼品' },
        { key: 'Good::GiftEntity', label: '平台实物礼品' },
        { key: 'Good::GiftCouponPwd', label: '平台卡密礼品' },
        { key: 'Good::LflMallCoupon', label: '优惠券' },
        { key: 'Good::SuiteChildCardGood', label: '套卡' }
      ],
      scene: [
        { key: 'PRODUCT_1', label: '商品促销' },
        { key: 'PRODUCT_2', label: '抽奖' },
        { key: 'PRODUCT_3', label: '虚拟物品兑奖' },
        { key: 'PRODUCT_4', label: '企业内部福利' },
        { key: 'PRODUCT_5', label: '渠道分润' },
        { key: 'PRODUCT_6', label: '保险回馈' },
        { key: 'PRODUCT_7', label: '彩票派奖' },
        { key: 'PRODUCT_8', label: '税务刮奖' }
      ],
      default_descript: {
        RedPack: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>自系统将微信红包发送至兑奖者微信帐号，兑奖者应于24小时内完成领取，逾期造成的兑奖失败将视为兑奖者放弃兑奖机会，不予补发。</li>
          </ul>`,
        LflRedPack: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者或中奖者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>自系统将微信红包发送至兑奖者微信帐号，兑奖者应于24小时内完成领取，逾期造成的兑奖失败将视为兑奖者放弃兑奖机会，不予补发。</li>
          </ul> `,
        GroupRedPack: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>自系统将微信红包发送至兑奖者微信帐号，兑奖者应于24小时内完成领取，逾期造成的兑奖失败将视为兑奖者放弃兑奖机会，不予补发。</li>
          </ul>`,
        LflGroupRedPack: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者或中奖者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>自系统将微信红包发送至兑奖者微信帐号，兑奖者应于24小时内完成领取，逾期造成的兑奖失败将视为兑奖者放弃兑奖机会，不予补发。</li>
          </ul>`,
        PointsGood: `
          <p><strong>积分的使用：</strong></p>
          <ul>
          <li>消费者可以使用积分至&quot;积分商城&quot;免费兑换或积分+现金的形式兑换、购买礼品。</li>
          <li>积分不可用于兑换现金，仅限参加&quot;积分商城&quot;指定兑换物品、参与积分抽奖活动。</li>
          <li>如消费者在&quot;积分商城&quot;网站上作出违反&quot;积分商城&quot;服务协议的行为，&quot;积分商城&quot;将有权利取消注销消费者的账户及积分。</li>
          <li>若消费者兑换礼品使用了积分支付，在订单拒收或取消时，积分将退回到消费者的积分账户中；</li>
          </ul>
          <p>&nbsp;</p>
          <p><strong>积分的有效期：</strong></p>
          <p>消费者在&quot;积分商城&quot;通过各种途径获得的积分是可以累积的，但是请注意积分的有效期时间。系统将在每年的5月31日对消费者在上一个年度获得的未使用的有效积分进行过期处理，过期没使用的有效积分将自动作废。 例：2013年5月31日将清空2013年1月1日之前所获得未使用的有效积分。</p>`,
        CashGood: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>小额兑换后将累加至您的零钱账户中。</li>
          <li>零钱账户中的零钱金额大于等于1元后，可通过微信红包提现。</li>
          <li>零钱通过微信红包提现后，系统将微信红包发送至兑奖者微信帐号，兑奖者应于24小时内完成领取，逾期造成的领取失败将视为兑奖者放弃领取机会。不予补发</li>
          </ul>`,
        Transfer: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者或中奖者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>发送成功后，兑奖者会收到微信的零钱入账通知，请注意查收。</li>
          </ul>`,
        LflTransfer: `
          <p><strong>兑换说明：</strong></p>
          <ul>
          <li>兑换者或中奖者需登录微信客户端领取奖品。</li>
          <li>系统将在消费者兑换后的24小时内将红包发送至兑换者的微信帐号内。</li>
          <li>发送成功后，兑奖者会收到微信的零钱入账通知，请注意查收。</li>
          </ul>`
      },
      portalGoods: ['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree'],
      suite_card: {},
      advanced: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    typeName() {
      return this.form.type ? this.type.find(i => i.key === this.form.type) : {}
    },
    unless_auto_confirm() {
      return ['Good::CouponGood', 'Good::LflMallCoupon', 'Good::LflCoupon', 'Good::LinkCoupon', 'Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree'].includes(this.form.type)
    },
    has_valid_days() {
      return ['Good::LflCoupon'].includes(this.form.type)
    },
    has_url() {
      return ['Good::LinkCoupon'].includes(this.form.type)
    },
    has_par() {
      return ['Good::RedPack', 'Good::Transfer', 'Good::GroupRedPack', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::LflGroupRedPack', 'Good::CashGood'].includes(this.form.type)
    },
    has_scene() {
      return ['Good::RedPack', 'Good::GroupRedPack'].includes(this.form.type)
    },
    has_wishing() {
      return ['Good::RedPack', 'Good::Transfer', 'Good::GroupRedPack', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::LflGroupRedPack'].includes(this.form.type)
    },
    has_total_num() {
      return ['Good::GroupRedPack', 'Good::LflGroupRedPack'].includes(this.form.type)
    }
  },
  watch: {
    pointsPar() {
      if (!this.pointsPar && ['GoodsNew', 'SuiteCardChildGoodsNew'].includes(this.$route.name)) {
        this.form.pointsPar = 0
      }
    }
  },
  async mounted() {
    const breadcrumb = []
    if (this.$route.name === 'SuiteCardChildGoodsNew') {
      breadcrumb.push({ title: '礼品列表', path: { name: 'SuiteCardIndex' }})
      await suite_cards.show({ ...this.$route.params }).then(({ data }) => {
        this.suite_card = data
        breadcrumb.push({ title: data.name, path: { name: 'SuiteCardShow', params: { id: data.id }}})
      })
      breadcrumb.push({ title: '新建卡片' })
    }

    if (this.$route.name === 'GoodsEdit' && this.$route.query.action !== 'dup') {
      breadcrumb.push({ title: '礼品列表', path: { name: 'GoodsIndex' }})
      await goods.show({ id: this.$route.params.goodsId }).then(async({ data }) => {
        this.form = data
        const imageList = this.form.imageList.filter(i => i.type === 'Image')
        this.form.imageList = imageList.map(i => {
          return {
            ...i,
            key: (new Date()).getTime()
          }
        })
        if (data.pointsPar > 0) {
          this.pointsPar = true
        }
        this.advanced = this.portalGoods.includes(data.type)
        if (data.type === 'Good::SuiteChildCardGood') {
          await suite_cards.show({ id: data.suiteCardId }).then((response) => {
            breadcrumb.push({ title: response.data.name, path: { name: 'SuiteCardShow', params: { id: response.data.id }}})
            breadcrumb.push({ title: data.name, path: { name: 'GoodsShow', params: { goodsId: data.id }}})
            this.suite_card = response.data
          })
        } else {
          breadcrumb.push({ title: data.name, path: { name: 'GoodsShow', params: { goodsId: data.id }}})
        }
      })
      breadcrumb.push({ title: '编辑礼品' })
    } else if (this.$route.query.action === 'dup') {
      breadcrumb.push({ title: '礼品列表', path: { name: 'GoodsIndex' }})
      breadcrumb.push({ title: '新建礼品' })
      await goods.show({ id: this.$route.params.goodsId }).then(async({ data }) => {
        this.form = data
        const imageList = this.form.imageList.filter(i => i.type === 'Image')
        this.form.imageList = imageList.map(i => {
          return {
            ...i,
            key: (new Date()).getTime()
          }
        })
        if (data.pointsPar > 0) {
          this.pointsPar = true
        }
        this.advanced = this.portalGoods.includes(data.type)
      })
    }

    if (this.$route.name === 'GoodsNew') {
      breadcrumb.push({ title: '礼品列表', path: { name: 'GoodsIndex' }})
      breadcrumb.push({ title: '新建礼品' })
      if (this.type.findIndex(i => i.key === this.$route.query.type) === -1) {
        this.$router.push({ name: 'GoodsListNew' })
      } else {
        this.form.type = this.$route.query.type
        this.form.description = this.default_descript[this.form.type.split('::')[1]]
      }
    }

    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    if (this.$route.name === 'SuiteCardChildGoodsNew') {
      this.form.type = 'Good::SuiteChildCardGood'
    }
    if (!this.portalGoods.includes(this.form.type)) {
      const _this = this
      const tbody = document.querySelector('.abcde ')
      Sortable.create(tbody, {
        handle: '.slide-image',
        onEnd({ newIndex, oldIndex }) {
          const list = _this.form.imageList
          const oldValue = list.splice(oldIndex, 1) // 取出旧值
          list.splice(newIndex, 0, oldValue[0]) // 添加到新位置
          _this.form.imageList = []
          _this.$nextTick(() => {
            _this.form.imageList = list
          })
        }
      })
    }
    account.list().then(response => {
      this.accounts = response.data
    })
  },
  methods: {
    submit() {
      const action = { SuiteCardChildGoodsNew: 'add', GoodsNew: 'add', GoodsEdit: 'edit' }
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.submitting = true
          if (this.$route.name === 'SuiteCardChildGoodsNew') {
            this.form.suiteCardId = this.$route.params.id
          }
          this.form.imageIds = this.form.imageList.filter(i => i.type === 'Image').map(img => img.id)
          let act = this.$route.name
          if (this.$route.query.action === 'dup') {
            act = 'GoodsNew'
          }

          goods[action[act]](this.form).then(response => {
            this.submitting = false
            if (this.$route.name === 'SuiteCardChildGoodsNew') {
              this.$router.push({ name: 'SuiteCardChildGoods', params: { id: this.$route.params.id }})
            } else {
              this.$router.push({ name: 'GoodsShow', params: { goodsId: action[act] === 'edit' ? this.$route.params.goodsId : response.data.id }})
            }
          }).catch(_err => {
            this.submitting = false
          })
        } else {
          this.$refs[Object.keys(object)[0]].$el.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          })
          this.submitting = false
        }
      })
    },
    setSlideImage(image) {
      this.form.imageList.push({ ...image, key: (new Date()).getTime() })
    },
    removeSlideItem(current) {
      console.log(current)
      if (current.key) {
        this.form.imageList = this.form.imageList.filter(image => image.key !== current.key)
      } else {
        this.form.imageList = this.form.imageList.filter(image => image.id !== current.id)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-radio {
    display: block;
    margin-top: 9px;
  }
  .el-textarea .el-input__count {
    bottom: 1px;
  }
  .form-item-tinymce, .form-item-table, .form-item-toast{
    .el-form-item__content {
      width: auto;
    }
  }
  .el-custom-input-group {
    .el-input-group-addon {
      margin-left: -1px;
      &+.el-input {
        .el-input__inner {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }
    }
  }
}

.slide-image {
  width: 60px;
  height: 60px;
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
    width: 60px;
    height: 60px;
  }
}
::v-deep {
  .el-card + .el-card {
    margin-top: 0;
  }
  .el-card {
    margin-right: 15px;
  }
  .description-content {
    width: 500px;
    height: 250px;
    overflow-y: scroll;
    border: 1px solid #CCCCCC;
    padding: 10px;
    img {
      max-width: 100%;
    }
  }
  .advanced_edit_btn {
    display: inline-block;
    border: 1px solid #da120e;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 13px;
    margin-left: 5px;
    color: #da120e;
    cursor: pointer;
  }
  .el-input-group__prepend,
  .el-input-group__append {
    color: #555 !important;
    background-color: #EEE !important;
    border-color: #CCC !important;
  }
}
</style>
