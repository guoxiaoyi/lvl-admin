<template>
  <div class="app-container">
    <tab v-if="$route.name === 'StoreGoodEdit' && $route.query.action !== 'dup'" :good-type="form.type" />
    <ul v-else class="nav nav-tabs">
      <li class="active">
        <a href="javascript: void(0)">新建商品</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <h5>基本信息</h5>
        <hr>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="商品类型">
            {{ typeName['label'] }}
          </el-form-item>
          <el-form-item ref="name" label="名称" prop="name">
            <el-input v-model="form.name" :disabled="portalGoods.includes(form.type)" />
          </el-form-item>

          <el-form-item ref="categoryId" label="商品分类" prop="categoryId">
            <el-select v-model="form.categoryId" clearable>
              <el-option v-for="item in goodsCategories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <p class="help-block">
              为商品设置分类，在商城页面可以按分类查看商品，或<router-link :to="{ name: 'GoodsCategoryIndex' }">新建商品分类</router-link>
            </p>
          </el-form-item>
          <el-form-item ref="refPrice" label="参考价" prop="refPrice">
            <div class="el-custom-input-group">
              <el-input v-model="form.refPrice" :disabled="portalGoods.includes(form.type)" />
              <div class="el-input-group-addon">元</div>
            </div>
            <p class="help-block">商品的市场参考价，仅用于显示，不作为交易价格  </p>
          </el-form-item>

          <el-form-item v-if="has_par" ref="par" key="par" label="红包金额" prop="par">
            <div class="el-custom-input-group">
              <el-input v-model="form.par" :disabled="$route.name === 'StoreGoodEdit' && $route.query.action !== 'dup'" />
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

          <el-form-item v-if="has_valid_days" ref="validDays" label="有效天数">
            <div class="el-custom-input-group">
              <el-input v-model="form.validDays" />
              <div class="el-input-group-addon">天</div>
            </div>
            <p class="help-block">设置领取后几天内有效  </p>
          </el-form-item>

          <el-form-item v-if="!unless_auto_confirm" ref="autoConfirm" label="自动确认">
            <el-switch v-model="form.autoConfirm" />
            <p class="help-block"> 开启后，领取后订单自动确认；关闭后，需要管理员在订单管理中手动确认后，才发送积分商城商品 </p>
          </el-form-item>
          <el-form-item ref="onSale" label="是否上架">
            <el-switch v-model="form.onSale" />
            <div v-if="form.onSale" class="child-form">
              <el-form-item ref="outStockOffSale" label="自动下架">
                <el-switch v-model="form.outStockOffSale" />
                <p class="help-block">开启后，当商品库存为0时，自动下架该商品</p>
              </el-form-item>
            </div>
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
          </el-form-item>
          <el-form-item v-if="!portalGoods.includes(form.type)" ref="description" label="图文详情" class="form-item-tinymce">
            <Tinymce ref="editor" v-model="form.description" :height="400" />
          </el-form-item>

          <h5 v-if="!form.onlyShow">支付设置</h5>
          <hr v-if="!form.onlyShow">
          <el-form-item v-if="!form.onlyShow" ref="paymentType" label="支付类型">
            <el-radio-group v-model="form.paymentType">
              <el-radio :label="'points'" :class="{mT0: !account.wxPay}">仅限积分支付</el-radio>
              <template v-if="account.wxPay">
                <el-radio :label="'cash'">仅限现金支付</el-radio>
                <el-radio :label="'both'">积分+现金</el-radio>
              </template>
            </el-radio-group>
            <p v-if="!account.wxPay" class="help-block">如需现金支付，请绑定微信支付功能 <router-link :to="{name: 'WechatAuthorization'}" target="_blank">去绑定</router-link></p>
            <div class="child-form">
              <el-form-item v-if="['points', 'both'].includes(form.paymentType)" label="积分价格" prop="points">
                <div class="el-custom-input-group">
                  <el-input v-model="form.points" />
                  <div class="el-input-group-addon">分</div>
                </div>
                <p class="help-block">建议积分价值为：1 积分 = 0.1 元</p>
              </el-form-item>
              <el-form-item v-if="['cash', 'both'].includes(form.paymentType)" label="现金价格" prop="cash">
                <div class="el-custom-input-group">
                  <el-input v-model="form.cash" />
                  <div class="el-input-group-addon">元</div>
                </div>
              </el-form-item>
            </div>
          </el-form-item>
          <h5>
            高级设置 &nbsp;&nbsp;&nbsp;&nbsp;
            <div class="advanced_edit_btn" @click="advanced = !advanced">
              {{ advanced ? '收起' : '展开' }} <i :class="`el-icon-arrow-${advanced ? 'up' : 'down'}`" />
            </div>
          </h5>
          <hr>
          <div v-show="advanced">
            <el-form-item ref="onlyShow" label="仅供展示">
              <el-switch v-model="form.onlyShow" />
            </el-form-item>
            <el-form-item v-if="!form.onlyShow" ref="secKillEnabled" label="限时秒杀">
              <el-switch v-model="form.secKillEnabled" />
              <p class="help-block">开启后，在秒杀时段内可进行秒杀价格购买。库存为0时自动结束秒杀。</p>
              <div v-if="form.secKillEnabled" class="child-form">
                <el-form-item label="秒杀时间">
                  <div class="el-custom-input-group">
                    <el-form-item ref="secKillStartTime" prop="secKillStartTime">
                      <el-date-picker v-model="form.secKillStartTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss" />
                    </el-form-item>
                    <div class="el-input-group-addon">至</div>
                    <el-form-item ref="secKillEndTime" prop="secKillEndTime">
                      <el-date-picker v-model="form.secKillEndTime" type="datetime" placeholder="结束时间" :picker-options="pickerOptionsForEndDate" value-format="yyyy-MM-dd HH:mm:ss" />
                    </el-form-item>
                  </div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item v-if="!portalGoods.includes(form.type)" ref="smsNotify" label="礼品兑换通知">
              <el-switch v-model="form.smsNotify" />
              <p class="help-block"> 开启后，当用户兑换此礼品后，发送订单短信通知商户管理员 </p>
            </el-form-item>

            <el-form-item v-if="!portalGoods.includes(form.type)" ref="pointsPar" label="赠送积分" prop="pointsPar">
              <el-switch v-model="pointsPar" :disabled="$route.name === 'StoreGoodEdit' && $route.query.action !== 'dup'" />
              <p class="help-block"> 开启后，获得此商品的同时获得所设置相应积分。 </p>
              <div v-if="pointsPar" class="el-custom-input-group" style="margin-top: 10px">
                <el-input v-model="form.pointsPar" :disabled="$route.name === 'StoreGoodEdit' && $route.query.action !== 'dup'" />
                <div class="el-input-group-addon">积分</div>
              </div>
              <p v-if="pointsPar" class="help-block">设置积分后，获得此商品，可同时获得相应积分。积分额需为整数。  </p>
            </el-form-item>

            <el-form-item ref="stockNoticeLimit" label="库存预警阈值" prop="stockNoticeLimit">
              <el-input v-model="form.stockNoticeLimit" />
              <p class="help-block">设置当前商品库存预警，为0时将执行基础预警阈值</p>
            </el-form-item>

            <el-form-item v-if="!form.onlyShow" ref="exchangeRule" label="兑换限制">
              <el-radio-group v-model="form.exchangeRule">
                <el-radio :label="'none'">不限制兑换件数</el-radio>
                <el-radio :label="'once'">1个用户最多兑换1件</el-radio>
                <el-radio :label="'once_a_day'">1个用户1天最多兑换1件</el-radio>
                <el-radio :label="'custom'">自定义兑换频率</el-radio>
              </el-radio-group>

              <div v-if="form.exchangeRule === 'custom'" class="el-custom-input-group" style="margin-top: 15px;">
                <div class="el-input-group-addon">1个用户</div>
                <el-input v-model="form.exchangeRuleDays" />
                <div class="el-input-group-addon">天，最多兑换</div>
                <el-input v-model="form.exchangeRuleTimes" />
                <div class="el-input-group-addon">件</div>
              </div>
            </el-form-item>

            <el-form-item label="分组">
              <el-select v-model="form.groupIds" multiple filterable>
                <el-option
                  v-for="item in groups"
                  :key="'group_'+item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <p class="help-block"> 为商品设置分组，在商城页面可以选择显示特定分组的商品，或
                <router-link :to="{ name: 'Groups'}" target="_blank"> 新建商品分组 </router-link>
              </p>
            </el-form-item>

            <el-form-item v-if="account.store.accountsEnabled && account.store.accountNumber > 1 && (account.main && !account.isInspector)" label="可见管理员">
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

            <el-form-item v-if="has_total_num" ref="totalNum" label="红包发放总人数">
              <div class="el-custom-input-group">
                <el-input v-model="form.totalNum" />
                <div class="el-input-group-addon">人</div>
              </div>
              <p class="help-block">红包发放总人数，即总共有多少人可以领到该组红包（包括分享者）；至少三个人  </p>
            </el-form-item>

          </div>
          <hr>
          <el-button v-if="checkPer(['store_good_manage'])" type="success" :loading="submitting" @click="submit">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/store_good_show'
import stoer_goods from '@/api/store_goods'
import account from '@/api/account'
import group from '@/api/group'
import Tinymce from '@/components/Tinymce'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'
import goods_categories from '@/api/goods_categories'

export default {
  components: {
    tab,
    Tinymce,
    editorImage
  },
  data() {
    return {
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
      type: [
        { key: 'Good::CouponGood', label: '第三方卡券' },
        { key: 'Good::LflCoupon', label: '自主卡券' },
        { key: 'Good::LinkCoupon', label: '外链卡券' },
        { key: 'Good::PhysicalGood', label: '实物物流礼品' },
        { key: 'Good::VirtualGood', label: '非物流礼品' },
        { key: 'Good::RedPack', label: '手拆红包(自发)' },
        { key: 'Good::LflRedPack', label: '手拆红包' },
        { key: 'Good::GroupRedPack', label: '裂变红包(自发)' },
        { key: 'Good::LflGroupRedPack', label: '裂变红包' },
        { key: 'Good::Transfer', label: '微信直达红包(自发)' },
        { key: 'Good::LflTransfer', label: '微信直达红包' },
        { key: 'Good::CashGood', label: '小额红包' },
        { key: 'Good::GiftCouponCharge', label: '虚拟礼品直充' },
        { key: 'Good::GiftCouponPwd', label: '虚拟礼品卡密' },
        { key: 'Good::GiftEntity', label: '实物礼品' },
        { key: 'Good::GiftFree', label: '精选礼品' }
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
      accounts: [],
      groups: [],
      pointsPar: false,
      form: {
        accountIds: [],
        autoConfirm: true,
        cash: 0,
        description: '',
        exchangeRule: 'none',
        exchangeRuleDays: 0,
        exchangeRuleTimes: 0,
        groupIds: [],
        imageIds: [],
        imageList: [],
        name: '',
        onSale: false,
        outStockOffSale: false,
        onlyShow: false,
        secKillEnabled: false,
        secKillStartTime: null,
        secKillEndTime: null,
        par: 0,
        paymentType: 'points',
        points: 0,
        pointsPar: 0,
        refPrice: 0,
        saleQuantity: 0,
        scene: '',
        smsNotify: false,
        stockNoticeLimit: 0,
        stockQuantity: 0,
        totalNum: 3,
        type: null,
        url: '',
        validDays: 0,
        wishing: '',
        categoryId: null
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
        ],
        secKillStartTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        secKillEndTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
          { validator: this.validateTime, trigger: 'change' }
        ]
      },
      goodsCategories: [],
      submitting: false,
      previewSlideImages: [],
      advanced: false,
      portalGoods: ['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree']
    }
  },
  computed: {
    ...mapGetters(['account']),
    typeName() {
      return this.form.type ? this.type.find(i => i.key === this.form.type) : {}
    },
    unless_auto_confirm() {
      return ['Good::CouponGood', 'Good::LflCoupon', 'Good::LinkCoupon', 'Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree'].includes(this.form.type)
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
    },
    pickerOptionsForEndDate() {
      const disabledDate = date => {
        return this.form.secKillStartTime ? date.getTime() < new Date(this.form.secKillStartTime).getTime() : false
      }
      return {
        disabledDate
      }
    }
  },
  watch: {
    pointsPar() {
      if (!this.pointsPar && this.$route.name === 'StoreGoodNew') {
        this.form.pointsPar = 0
      }
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '商品列表', path: { name: 'StoreGoodIndex' }}]
    if (this.$route.name === 'StoreGoodEdit') {
      if (this.$route.query.action === 'dup') {
        breadcrumb.push({ title: '新建商品' })
      } else {
        breadcrumb.push({ title: '编辑商品' })
      }
    } else {
      breadcrumb.push({ title: '新建商品' })
    }
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    account.list().then(response => {
      this.accounts = response.data
    })
    group.index({ size: 1000 }).then(response => {
      this.groups = response.data.content
    })
    goods_categories.list().then(({ data }) => {
      this.goodsCategories = data
    })
    if (this.$route.name === 'StoreGoodEdit') {
      await stoer_goods.show({ id: this.$route.params.id }).then(response => {
        this.form = response.data
        const imageList = this.form.imageList.filter(i => i.type === 'Image')
        this.form.imageList = imageList
        if (response.data.pointsPar > 0) {
          this.pointsPar = true
        }
      })
    }
    if (this.$route.name === 'StoreGoodNew') {
      if (this.type.findIndex(i => i.key === this.$route.query.type) === -1) {
        this.$router.push({ name: 'StoreGoodListNew' })
      } else {
        this.form.type = this.$route.query.type
        this.form.description = this.default_descript[this.form.type.split('::')[1]]
      }
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
  },
  methods: {
    validateTime(rule, value, callback) {
      const startTime = new Date(this.form.secKillStartTime).getTime()
      const endTime = new Date(this.form.secKillEndTime).getTime()
      if (endTime < startTime) {
        callback(new Error('秒杀结束时间不能早于开始时间'))
      } else if ((endTime - startTime) > 7 * 24 * 60 * 60 * 1000) {
        callback(new Error('开始时间与结束时间间隔不能超过7天'))
      } else {
        callback()
      }
    },
    submit() {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.submitting = true
          const action = { StoreGoodEdit: 'edit', StoreGoodNew: 'add' }
          this.form.imageIds = this.form.imageList.filter(i => i.type === 'Image').map(img => img.id)
          let act = this.$route.name
          if (this.$route.query.action === 'dup') {
            act = 'StoreGoodNew'
          }

          stoer_goods[action[act]](this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'StoreGoodShow', params: { id: action[act] === 'edit' ? this.$route.params.id : response.data.id }})
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
      this.form.imageList.push(image)
    },
    removeSlideItem(current) {
      this.form.imageList = this.form.imageList.filter(image => image.id !== current.id)
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
  .mT0 {
    margin-top: 0;
  }
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
    border: 1px solid #ddd;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 13px;
    margin-left: 5px;
    color: #999;
    cursor: pointer;
  }
}
</style>
