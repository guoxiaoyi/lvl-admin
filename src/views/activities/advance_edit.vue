<template>
  <div class="app-container">
    <div v-if="detail.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，<router-link v-if="detail.id" :to="{ name: 'ActivityShow', params: {activityId: detail.id }}">点击返回主活动</router-link>
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          高级设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <step v-if="detail.state === 'pending'" :active="1" :activity="detail" />
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item v-if="detail.page.ruleEnabled && (account.wechatProfile && account.wechatProfileServiceExpired === false)" ref="subscribeRequired" label="要求关注公众号" prop="subscribeRequired">
            <el-switch v-model="form.subscribeRequired" />
            <p class="help-block">开启后，用户参与活动需关注公众号，可为公众号吸粉。</p>
            <div v-if="form.subscribeRequired" class="child-form">
              <el-form-item ref="subscribeBeforeAttending" label="关注顺序" prop="subscribeBeforeAttending" class="column-radio">
                <el-radio-group v-model="form.subscribeBeforeAttending">
                  <el-radio :label="true">先关注, 后抽奖</el-radio>
                  <el-radio :label="false">先抽奖, 后关注领奖</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form-item>
          <!-- 要求添加企业微信 -->
          <el-form-item v-if="checkPer(['wework_manage']) && account.wework" label="要求添加企业微信">
            <el-switch v-model="form.addWeworkRequired" />
            <p class="help-block">开启后，用户参与活动需添加企业微信，可为在企业微信运营。</p>
            <div v-if="form.addWeworkRequired" class="child-form">
              <el-form-item ref="addWeworkBeforeAttending" label="加企信顺序" prop="addWeworkBeforeAttending" class="column-radio">
                <el-radio-group v-model="form.addWeworkBeforeAttending">
                  <el-radio :label="true">先加企信，后抽奖</el-radio>
                  <el-radio :label="false">先抽奖，后加企信领奖</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item ref="weworkContactUser" label="选择员工" prop="weworkContactUser">
                <el-button type="success" @click="selectWework">添加员工</el-button>
                <div style="line-height: 1.42; margin-top: 10px;">
                  <table v-if="form.weworkContactUser && form.weworkContactUser.length" id="wework_contact_user_table" class="table table-bordered table-hover" style="">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>负责区域</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="we_contact_user in weworkContactUsers" :key="we_contact_user.userid" class="weworks_user">
                        <td>{{ we_contact_user.name }}</td>
                        <td width="300">{{ we_contact_user.regionScopeText && we_contact_user.regionScopeText.map(i => i.name).join(', ') }}</td>
                        <td>
                          <a class="del_weworks_user" href="javascript:void(0);" @click="remove_we_contact_user(we_contact_user)">移除</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p class="help-block"> 选择顾客扫码后添加的员工，支持多个员工。</p>
              </el-form-item>
              <el-form-item label="分配方式" class="column-radio">
                <el-radio-group v-model="form.weworkAddKind">
                  <el-radio label="random">随机分配</el-radio>
                  <el-radio label="nearby">就近分配</el-radio>
                </el-radio-group>
                <p class="help-block">当设置为随机分配时，顾客扫码后随机分配一名员工。</p>
                <p v-if="form.weworkAddKind === 'nearby'" class="help-block"> <i class="fa fa-exclamation-circle" /> 提示：本功能基于微信地理位置接口实现，由于设备或微信版本差异，可能会导致定位误差，请知悉。</p>
              </el-form-item>
              <el-form-item label="加企信后打标签">
                <el-select v-model="form.weworkAddTags" multiple filterable clearable>
                  <el-option v-for="(item, index) in userTagList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
                <p class="help-block">用户加企业微信后。会给该用户打上相应的标签，或<a @click="addTag('UserTag', 'weworkAddTags')">新建用户标签</a>。</p>
              </el-form-item>
            </div>
          </el-form-item>

          <!-- 第三方平台引流 -->
          <el-form-item v-if="account.store.thirdPartyLeadingFuncEnabled && detail.type !== 'InvitingActivity'" label="导流外部平台" prop="thirdPartyLeadingEnabled">
            <el-switch v-model="form.thirdPartyLeadingEnabled" />
            <p class="help-block">开启后，用户参与活动后引导关注三方平台，如抖音、快手等。
              <el-tooltip class="item" effect="light" placement="right">
                <a>查看示例</a>
                <div slot="content">
                  <el-image :src="require('@/assets/third_party_leading_demo.png')" />
                </div>
              </el-tooltip>

            </p>
            <div v-if="form.thirdPartyLeadingEnabled" class="child-form">
              <el-form-item ref="thirdPartyLeadingImgId" label="图片" prop="thirdPartyLeadingImgId">
                <el-image
                  v-if="form.thirdPartyLeadingImgUrl"
                  class="img-thumbnail activity-thumbnail-middle"
                  fit="cover"
                  :src="form.thirdPartyLeadingImgUrl"
                  :preview-src-list="[form.thirdPartyLeadingImgUrl]"
                  style="width: 120px"
                />
                <el-upload
                  action="#"
                  accept="image/*"
                  :data="{column: 'thirdPartyLeadingImg'}"
                  :show-file-list="false"
                  :http-request="upload"
                >
                  <el-button :loading="uploading" type="success" size="medium">上传</el-button>
                </el-upload>
                <p class="help-block">尺寸：650 x 400px，格式：png，jpg，gif</p>
              </el-form-item>
              <el-form-item ref="thirdPartyLeadingTitle" label="标题" prop="thirdPartyLeadingTitle">
                <el-input v-model="form.thirdPartyLeadingTitle" maxlength="15" />
                <p class="help-block">限制不超过15个字</p>
              </el-form-item>
              <el-form-item ref="thirdPartyLeadingDesc" label="说明" prop="thirdPartyLeadingDesc">
                <el-input v-model="form.thirdPartyLeadingDesc" maxlength="40" />
                <p class="help-block">限制不超过40个字。例如：点击复制口令，打开【抖音】自动进入特惠专场</p>
              </el-form-item>
              <el-form-item ref="thirdPartyLeadingWord" label="口令" prop="thirdPartyLeadingWord">
                <el-input v-model="form.thirdPartyLeadingWord" :rows="2" type="textarea" />
                <p class="help-block">请在抖音、快手、淘宝、天猫等平台，复制链接分享至微信，再粘贴至此处。</p>
              </el-form-item>
              <el-form-item ref="thirdPartyLeadingAlert" label="复制提示" prop="thirdPartyLeadingAlert">
                <el-input v-model="form.thirdPartyLeadingAlert" />
                <p class="help-block">限制不超过15个字。例如：复制成功，打开抖音即可观看。</p>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="开启精准位置收集">
            <el-switch v-model="form.regionRequired" />
            <p class="help-block">开启后，用户扫码会提示获取当前位置，用户同意后即可获取用户精确地理位置 <a href="http://admin.lifanli.cn/lgp/portal/help/articles/186" target="_blank">详见帮助引导 </a></p>
            <div v-if="form.regionRequired" class="child-form">
              <div style="margin-bottom: 15px;">
                <el-alert title="本功能基于微信地理位置接口实现，由于设备或微信版本差异，可能会导致定位误差，请知悉。" type="warning" show-icon :closable="false" />
              </div>
              <el-form-item ref="region" label="活动区域" prop="region" :rules="{ required: form.onlyInRegion || form.regionNotice, message: '不能为空', trigger: 'blur'}">
                <div>{{ text.join(',') }}</div>
                <el-button type="success" @click="show = true">设置活动区域</el-button>
                <p class="help-block">设置活动指定区域，可多选，可精确到区、县</p>
              </el-form-item>
              <el-form-item label="仅限区域内参与">
                <el-switch v-model="form.onlyInRegion" />
                <p class="help-block">开启后，仅在规定区域内扫码，才能参加活动</p>
              </el-form-item>
              <el-form-item v-if="detail.type !== 'Activity' && checkPer(['fleeing_manage'])" label="窜货通知">
                <el-switch v-model="form.regionNotice" />
                <p class="help-block">开启后，不在区域内的扫码行为会记为窜货记录</p>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item v-if="account.store.advancedUserMgrFunc" label="参与用户限制">
            <el-switch v-model="form.attendLimitEnabled" />
            <p class="help-block">开启后，设置可参与和不可参与的用户</p>
            <div v-if="form.attendLimitEnabled" class="child-form">
              <el-form-item label="仅白名单用户参与" label-width="140px">
                <el-switch v-model="form.whitelistPhoneEnabled" />
                <p class="help-block">开启后，仅限预先加入的手机号用户才能参与活动，<router-link :to="{ name: 'UserWhitelistPhones'}" target="_blank">查看白名单</router-link><br>
                  如果开启，请在活动表单设置中选择先填表，后抽奖
                </p>
              </el-form-item>

              <el-form-item ref="attendLimitCondition" label="限制条件" label-width="140px">
                <el-radio-group v-model="form.attendLimitCondition">
                  <el-radio label="by_tag">按标签</el-radio>
                  <el-radio label="by_channel_type">按渠道层级</el-radio>
                  <el-radio label="by_vip_level">按会员等级</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="form.attendLimitCondition === 'by_tag'" ref="allowedTags" label="可参与用户标签" prop="allowedTags" label-width="140px">
                <el-select v-model="form.allowedTags" multiple clearable>
                  <el-option v-for="item in userTagList" :key="'allowed' + item.id + Math.round(Math.random()*10)" :label="item.name" :value="`${item.id}`" />
                </el-select>
                <p class="help-block">选择可参与活动的用户标签，或<a href="javascript:void(0)" @click="addTag('UserTag', 'allowedTags')">新建标签</a></p>
              </el-form-item>
              <el-form-item
                v-if="form.attendLimitCondition === 'by_tag'"
                ref="disallowedTag"
                label="不可参与用户标签"
                prop="disallowedTag"
                label-width="140px"
              >
                <el-select v-model="form.disallowedTag" multiple clearable>
                  <el-option v-for="item in userTagList" :key="'user-' + item.id + (new Date()).getTime() + Math.round(Math.random()*10)" :label="item.name" :value="`${item.id}`" />
                </el-select>
                <p class="help-block">选择不可参与活动的用户标签，或<a href="javascript:void(0)" @click="addTag('UserTag', 'disallowedTag')">新建标签</a></p>
              </el-form-item>
              <el-form-item v-if="form.attendLimitCondition === 'by_channel_type'" label="商户小程序参与" prop="wxMiniprogramAttendEnabled" label-width="140px">
                <el-switch v-model="form.wxMiniprogramAttendEnabled" />
                <p class="help-block">开启后，需通过商户小程序参与活动。</p>
              </el-form-item>
              <el-form-item v-if="form.attendLimitCondition === 'by_channel_type'" label="可参与渠道类型" prop="allowedChannelTypes" label-width="140px">
                <el-select v-model="form.allowedChannelTypes" multiple clearable>
                  <el-option
                    v-for="item in channel_types"
                    :key="item.key + (new Date()).getTime() + '_channel'"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
                <p class="help-block">选择可参与活动的渠道层级。例如：终端店</p>
              </el-form-item>
              <el-form-item v-if="account.store.vipFuncEnabled && form.attendLimitCondition === 'by_vip_level'" label="会员等级" prop="vipLevelIds" label-width="140px">
                <el-select v-model="form.vipLevelIds" multiple clearable>
                  <el-option v-for="item in levelList" :key="item.id + '_tag' + (new Date()).getTime()" :label="item.label" :value="item.id" />
                </el-select>
                <p class="help-block">选择可参与活动的会员等级，支持多选。</p>
              </el-form-item>
              <el-form-item ref="disallowedUrl" label="不可参与跳转地址" prop="disallowedUrl" label-width="140px">
                <el-input v-model="form.disallowedUrl" />
                <p class="help-block">设置不可参与用户访问地址（格式如: http://www.lifanli.cn）</p>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item v-if="detail.page.settingLeadingEnabled" label="开启二次引导链接">
            <el-switch v-model="form.leadingEnabled" />
            <p class="help-block">开启后，用户领奖成功，会在领奖成功页面显示二次引导链接，引导用户点击进入其他页面。</p>
            <div v-if="form.leadingEnabled" class="child-form">
              <el-form-item ref="leadingImgId" label="引导图片" prop="leadingImgId">
                <el-image
                  v-if="form.leadingImgUrl"
                  class="img-thumbnail activity-thumbnail-middle"
                  fit="cover"
                  :src="form.leadingImgUrl"
                  :preview-src-list="[form.leadingImgUrl]"
                  style="width: 120px"
                />
                <el-upload
                  action="#"
                  accept="image/*"
                  :data="{column: 'leadingImg'}"
                  :show-file-list="false"
                  :http-request="upload"
                >
                  <el-button :loading="leadUploading" type="success" size="medium">上传</el-button>
                </el-upload>
                <p class="help-block">设置引导图片，尺寸：640 x 240px，格式：png，jpg，gif</p>
              </el-form-item>
              <el-form-item ref="leadingTitle" label="引导标题" prop="leadingTitle">
                <el-input v-model="form.leadingTitle" />
                <p class="help-block">设置引导标题</p>
              </el-form-item>
              <el-form-item ref="leadingUrl" label="引导链接" prop="leadingUrl">
                <el-input v-model="form.leadingUrl" />
                <p class="help-block">设置二次引导链接地址（链接格式如: http://www.lifanli.cn）</p>
              </el-form-item>
              <el-form-item ref="leadingAutoRedirect" label="自动跳转">
                <el-switch v-model="form.leadingAutoRedirect" />
                <p class="help-block">开启后，页面将于1秒钟后自动跳转至引导链接</p>
              </el-form-item>
              <el-form-item ref="leadingDesc" label="引导描述">
                <el-input v-model="form.leadingDesc" type="textarea" :rows="3" />
                <p class="help-block">设置引导说明</p>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item v-if="detail.page.customFieldsEnabled" label="活动表单设置">
            <el-switch v-model="form.activityFormEnabled" />
            <p class="help-block">开启后，用于自定义收集表单数据。<a href="http://admin.lifanli.cn/lgp/portal/help/articles/185" target="_blank">详见帮助引导</a></p>
            <div v-if="form.activityFormEnabled" class="child-form">
              <el-form-item label="添加表单项" class="custom_types">
                <el-button v-for="item in custom_field_types" :key="item.key" type="success" @click="addCustomField(item)">{{ item.name }}</el-button>
                <LflTable :list="customFieldList">
                  <div class="panel panel-default" style="line-height: 1.4; margin-top: 15px; margin-bottom: 15px;">
                    <table class="table table-bordered table-hover">
                      <thead><tr><th>数据名称</th><th>数据类型</th><th>选择项</th><th>必填</th><th>操作</th></tr></thead>
                      <tbody>
                        <tr v-for="f in customFieldList" :key="f.id">
                          <td>{{ f.label }}</td>
                          <td>{{ f.kind | kind_text }}</td>
                          <td>{{ f.options || '-' }}</td>
                          <td>{{ f.required ? '是' : '否' }}</td>
                          <td>
                            <a href="javascript:void(0)" @click="editCustomField(f)">编辑</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="javascript:void(0)" @click="delCustomField(f)">删除</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </LflTable>
              </el-form-item>
              <template v-if="customFieldList.length">
                <el-form-item label="表单顺序" prop="formBeforeAttending" class="column-radio">
                  <el-radio-group v-model="form.formBeforeAttending">
                    <el-radio :label="true">先填表，后抽奖</el-radio>
                    <el-radio :label="false">先抽奖，后填表领奖</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!form.formBeforeAttending" label="表单填写范围" prop="formWithAwardsEnabled" class="column-radio">
                  <el-radio-group v-model="form.formWithAwardsEnabled">
                    <el-radio :label="true">仅中特定奖项填写</el-radio>
                    <el-radio :label="false">全部填写</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="表单显示模式" prop="activityFormMode" class="column-radio">
                  <el-radio-group v-model="form.activityFormMode">
                    <el-radio label="modal">弹窗表单（以弹窗方式显示，适合内容较少的短表单）</el-radio>
                    <el-radio label="page">页面表单（以独立页面方式显示，适合内容较多的长表单）</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="表单填写次数" prop="formFillingMode" class="column-radio">
                  <el-radio-group v-model="form.formFillingMode">
                    <el-radio label="multiple">每次参与都需填表</el-radio>
                    <el-radio label="once">仅填写一次</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </div>
          </el-form-item>

          <template v-if="detail.product && detail.unitsEnabled">
            <el-form-item v-if="account.store.productBatchEnabled" label="产品溯源功能">
              <el-switch v-model="form.productTrackEnabled" />
              <p class="help-block">开启后，消费者兑奖后能看产品的溯源信息。</p>
              <div v-if="form.productTrackEnabled" class="child-form">
                <el-form-item ref="productBatchId" label="选择产品批次" prop="productBatchId" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
                  <el-select v-model="form.productBatchId" clearable>
                    <el-option v-for="(item, index) in productBatchList" :key="index" :label="item.code" :value="item.id" />
                  </el-select>
                  <!-- <p class="help-block">列表中没有想要的产品批次？<router-link :to="{ name: 'ProductShowBatches', params: { id: detail.productId }}" target="_blank">点击新建产品批次</router-link></p> -->
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="防伪阈值提醒">
              <el-switch v-model="form.scanLimitAlertEnabled" />
              <p class="help-block">开启后，防伪溯源码扫码次数超过设置的阈值，会提醒用户谨慎购买。</p>
              <div v-if="form.scanLimitAlertEnabled" class="child-form">
                <el-form-item ref="scanLimit" label="防伪阈值" prop="scanLimit">
                  <div class="el-custom-input-group" style="width: 50%;">
                    <el-input v-model="form.scanLimit" />
                    <div class="el-input-group-addon">次</div>
                  </div>
                  <p class="help-block">防伪溯源码扫码次数超过设置的阈值，会提醒用户谨慎购买</p>
                </el-form-item>
                <el-form-item ref="scanLimitMsg" label="提醒说明" prop="scanLimitMsg">
                  <el-input v-model="form.scanLimitMsg" placeholder="该二维码已被扫描[N]次，请谨慎购买！" />
                  <p class="help-block">“[N]”代表防伪阈值，请加入提醒说明文字中；如未设置提醒说明，则显示默认的文字说明</p>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <el-form-item v-if="account.store.rebateFuncEnabled && !['InvitingActivity', 'Activity'].includes(detail.type) && detail.awardEnabled" label="导购返利开关">
            <el-switch v-model="form.rebateEnabled" />
            <p class="help-block">开启后，消费者参与活动领奖，则对此商品销售关联的导购进行返利。<a href="http://admin.lifanli.cn/lgp/portal/help/articles/18?cid=3" target="_blank">详见帮助引导</a></p>
            <div v-if="form.rebateEnabled" class="child-form">
              <el-form-item ref="rebateKind" label="返利关联方式" prop="rebateKind">
                <el-radio-group v-model="form.rebateKind" class="column-radio" @change="rebaterRequiredChange">
                  <el-radio label="user_scan">
                    用户扫码关联
                    <el-tooltip placement="right" effect="light" popper-class="user_scan_tooltip">
                      <a><i class="fa fa-question-circle-o" /></a>
                      <el-image slot="content" :src="require('@/assets/user_scan_help.png')" style="width: 416px;" />
                    </el-tooltip>

                  </el-radio>
                  <el-radio label="rebater_scan">
                    导购扫码关联
                    <el-tooltip placement="right" effect="light" popper-class="user_scan_tooltip">
                      <a><i class="fa fa-question-circle-o" /></a>
                      <el-image slot="content" :src="require('@/assets/rebater_scan_help.png')" style="width: 416px;" />
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.rebateKind === 'rebater_scan'" label="导购激活" prop="rebaterRequired">
                <el-switch v-model="form.rebaterRequired" />
                <p class="help-block">开启后，导购先扫码激活，用户才可扫码参与活动。</p>
              </el-form-item>
              <el-form-item ref="rebateGoodId" label="导购礼品" prop="rebateGoodId">
                <el-input v-model="goodsModal.rebateGoods.name" :disabled="true" placeholder="请点击右侧按钮选择">
                  <template slot="append"><el-button type="success" @click="goodsModal.rebate = true">选择</el-button></template>
                </el-input>
                <p class="help-block">如需根据奖项设置不同导购礼品，请到奖项中设置。若奖项中未设置，则发放此礼品。列表中没有想要的礼品？<router-link :to="{ name: 'GoodsListNew'}" target="_blank">点击新建礼品</router-link></p>
                <div v-if="Object.keys(goodsModal.rebateGoods).length" class="panel panel-default" style="line-height: 1.4; margin-bottom: 0; margin-top: 15px;">
                  <el-table :data="[goodsModal.rebateGoods]">
                    <el-table-column label="图片" prop="imageList" width="80px">
                      <template slot-scope="scope">
                        <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
                      </template>
                    </el-table-column>
                    <el-table-column label="名称">
                      <template slot-scope="scope">
                        <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name" target="_blank">
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
              <el-form-item label="无库存停止返利">
                <el-switch v-model="form.unstockRebateEnabled" />
                <p class="help-block">开启后，当所设置的导购礼品库存为0时，停止返利。</p>
              </el-form-item>
              <el-form-item v-if="form.rebateKind === 'rebater_scan'" label="导购员可参与">
                <el-switch v-model="form.rebaterAttendingEnabled" />
                <p class="help-block">开启后，导购员可以参与本活动抽奖并获得返利</p>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item v-if="detail.page.ruleEnabled" label="开启积分抽奖">
            <el-switch v-model="form.pointsEnabled" />
            <p class="help-block">开启后，用户需使用积分才可参与抽奖。</p>
            <div v-if="form.pointsEnabled" class="child-form">
              <el-form-item ref="points" label="积分额" prop="points">
                <div class="el-custom-input-group" style="width: 50%;">
                  <el-input v-model="form.points" />
                  <div class="el-input-group-addon">积分</div>
                </div>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item v-if="!detail.parentId && detail.kind === 'normal' && account.store.accountsEnabled && account.main && account.store.accountNumber > 1" label="可见管理员">
            <el-select v-model="form.accountIds" multiple clearable>
              <el-option
                v-for="item in accounts"
                :key="'account_'+item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

        </el-form>
        <hr>
        <template v-if="detail.state === 'pending'">
          <el-button type="success" :loading="submitting" @click="submit">保存，并下一步</el-button>
          <el-button @click="$router.push({ name: 'ActivityEdit', params: { activityId: $route.params.activityId }})">上一步</el-button>
          <el-button @click="$router.push({ name: 'ActivityWizardCheck', params: { activityId: $route.params.activityId }})">确认并创建活动</el-button>
        </template>
        <el-button v-else type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelWeWork"
      :visible="weWorkDialog > 0"
      title="选择员工"
      width="580px"
    >
      <WeWorkModal ref="we_work_modal" :wework-contact-user.sync="form.weworkContactUser" :wework-contact-users.sync="weworkContactUsers" />
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelCustomField"
      :visible="modal.status > 0"
      :title="modal.title"
      width="580px"
    >
      <div v-if="customForm.type === 'CustomField::PhoneCode'" class="alert alert-info" role="alert">
        开启手机号收集，会发送短信验证码验证手机号的真实性。<br>
        请确认您有充足的短信额度，当短信额度不足时，用户将无法收到短信验证码。<br>
        <router-link :to="{ name: 'StoreShow'}" target="_blank">点击查看短信额度</router-link>
      </div>
      <el-form ref="customForm" size="small" label-width="16.666%" :model="customForm">
        <el-form-item label="数据名称" prop="label" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
          <el-input
            v-model="customForm.label"
            maxlength="60"
            :disabled="['CustomField::Name', 'CustomField::Phone', 'CustomField::PhoneCode', 'CustomField::CitizenId'].includes(customForm.type)"
          />
          <p class="help-block">最多60个字符，如：电话，性别</p>
        </el-form-item>

        <el-form-item v-if="customForm.type !== 'CustomField::PhoneCode'" label="必填" prop="required">
          <el-switch v-model="customForm.required" active-color="#449d44" inactive-color="#e6e6e6" />
        </el-form-item>

        <el-form-item v-if="['CustomField::Select', 'CustomField::CheckBoxes'].includes(customForm.type)" label="选择项" prop="optionsStr" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
          <el-input v-model="customForm.optionsStr" type="textarea" :rows="4" />
          <p class="help-block">选择项，一行一个选项</p>
        </el-form-item>

        <el-form-item label="提示说明" prop="hint">
          <el-input v-model="customForm.hint" />
          <p class="help-block">显示在表单下方，长度在2~50字符之间，可以为空</p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.status > 1" @click="createCustomField">确认</el-button>
        <el-button @click="modal.status = 0">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      title="选择活动区域"
      width="780px"
      top="5vh"
    >
      <el-tree
        ref="tree"
        node-key="id"
        :data="[region]"
        show-checkbox
        :props="props"
        :default-expanded-keys="['000000']"
        :default-checked-keys="defaultCheckedRegion"
      />
      <div slot="footer" class="text-left">
        <el-button :loading="regionLoading" type="success" @click="save">保存</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>
    <GoodsDialog v-if="goodsModal.rebate" :show.sync="goodsModal.rebate" :except="goodsDialogExceptForRebate">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="selectRebate(row.data)">选择</el-button>
      </template>
    </GoodsDialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelTag"
      :visible="addTagStatus > 0"
      :title="addTagTitle"
      width="580px"
    >
      <el-form ref="tagForm" :rules="tagRules" :model="tagForm" size="small" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="addTagStatus === 2" type="primary" @click="submitTag">确认</el-button>
        <el-button @click="cancelTag">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isValidHttpUrl } from '@/utils/validate'
import step from './components/step.vue'
import GoodsDialog from '@/components/Goods/modal.vue'
import GoodsPrice from '@/components/Goods/Price'
import CustomImg from '@/components/Image/goods'
import activities from '@/api/activities'
import amazon from '@/api/amazon'
import tags from '@/api/tag'
import activity_advance from '@/api/activity_advance'
import WeWorkModal from '@/components/WeWork/Modal.vue'
import custom_field from '@/api/v2_custom_field.js'
import LflTable from '@/components/LflTable'
import dict_region from '@/api/dict_region'
import channels from '@/api/channels'
import vip_level from '@/api/vip_level'
import account from '@/api/account'
import products from '@/api/product'
import we_work_users from '@/api/we_work_users'

import { mapGetters } from 'vuex'
export default {
  components: {
    WeWorkModal,
    GoodsDialog,
    GoodsPrice,
    CustomImg,
    LflTable,
    step
  },
  filters: {
    kind_text(value) {
      return { name: '姓名', phonecode: '手机号(验证码)', string: '文字', phone: '手机号', select: '单选', checkboxes: '多选', picture: '图片', camera: '拍照', citizenid: '身份证号', thirdPartyCode: '三方验证码' }[value]
    }
  },
  data() {
    return {
      uploading: false,
      leadUploading: false,
      detail: {
        page: {}
      },
      show: false,
      region: [],
      text: [],
      defaultCheckedRegion: [],
      props: {
        label: 'name',
        children: 'children'
      },
      regionLoading: false,
      goodsModal: {
        rebate: false,
        rebateGoods: {}
      },
      goodsDialogExceptForRebate: ['other', 'suite_card'],
      rules: {
        weworkContactUser: [{ required: true, message: '不能为空', trigger: 'blur' }],
        disallowedUrl: [{ required: true, message: '不能为空', trigger: 'blur' }],
        thirdPartyLeadingTitle: [{ required: true, message: '不能为空', trigger: 'blur' }],
        thirdPartyLeadingWord: [{ required: true, message: '不能为空', trigger: 'blur' }],
        thirdPartyLeadingAlert: [{ required: true, message: '不能为空', trigger: 'blur' }],
        thirdPartyLeadingDesc: [{ required: true, message: '不能为空', trigger: 'blur' }],
        leadingTitle: [{ required: true, message: '不能为空', trigger: 'blur' }],
        leadingUrl: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (!isValidHttpUrl(value)) {
                callback(new Error('链接是无效的'))
              } else {
                callback()
              }
            }
          }
        ],
        scanLimit: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 2) {
              callback(new Error('必须大于等于2'))
            } else {
              callback()
            }
          } }
        ],
        points: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于等于1'))
            } else {
              callback()
            }
          } }
        ],
        rebateGoodId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      weWorkDialog: 0,
      weWorkList: [],
      userTagList: [],
      customFieldList: [],
      channel_types: [],
      levelList: [],
      accounts: [],
      productBatchList: [],
      customForm: {
        fieldableType: 'Activity',
        fieldableId: parseInt(this.$route.params.activityId),
        context: 'activity',
        hint: null,
        label: null,
        optionsStr: null,
        required: false
      },
      weworkContactUsers: [],
      form: {
        formBeforeAttending: true,
        formWithAwardsEnabled: true,
        activityFormMode: 'modal',
        formFillingMode: 'once',
        subscribeRequired: false,
        subscribeBeforeAttending: true,
        addWeworkRequired: false,
        addWeworkBeforeAttending: true,
        thirdPartyLeadingEnabled: false,
        thirdPartyLeadingImgId: null,
        thirdPartyLeadingTitle: null,
        thirdPartyLeadingDesc: null,
        thirdPartyLeadingWord: null,
        thirdPartyLeadingAlert: null,
        regionRequired: false,
        region: [],
        onlyInRegion: false,
        regionNotice: false,
        attendLimitEnabled: false,
        whitelistPhoneEnabled: false,
        attendLimitCondition: 'by_tag',
        allowedTags: [],
        disallowedTag: [],
        disallowedUrl: null,
        wxMiniprogramAttendEnabled: false,
        allowedChannelTypes: null,
        vipLevelIds: [],
        leadingEnabled: false,
        leadingImgId: null,
        leadingTitle: null,
        leadingUrl: null,
        leadingDesc: null,
        leadingAutoRedirect: false,
        activityFormEnabled: false,
        scanLimitAlertEnabled: false,
        rebateEnabled: false,
        rebateKind: 'user_scan',
        rebateGoodId: null,
        unstockRebateEnabled: false,
        rebaterRequired: false,
        rebaterAttendingEnabled: false,
        pointsEnabled: false,
        points: null,
        accountIds: [],
        productTrackEnabled: false,
        productBatchId: null,
        scanLimit: 0,
        scanLimitMsg: null,
        weworkContactUser: [],
        weworkAddTags: [],
        weworkAddKind: 'random'
      },
      custom_field_types: [
        { key: 'CustomField::Name', name: '姓名' },
        { key: 'CustomField::Phone', name: '手机号' },
        { key: 'CustomField::PhoneCode', name: '手机号(验证码)' },
        { key: 'CustomField::CitizenId', name: '身份证号' },
        { key: 'CustomField::String', name: '文字' },
        { key: 'CustomField::Select', name: '单选' },
        { key: 'CustomField::Picture', name: '图片' },
        { key: 'CustomField::Camera', name: '拍照' },
        { key: 'CustomField::CheckBoxes', name: '多选' }
      ],
      modal: {
        status: 0
      },
      submitting: false,
      addTagStatus: 0,
      addTagTitle: '创建标签',
      tagForm: {
        name: null,
        type: null,
        position: null
      },
      tagRules: {
        name: [{
          required: true, message: '不能为空', trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    'form.addWeworkRequired'(newValue) {
      if (newValue) {
        we_work_users.v2_list({ useridIn: this.form.weworkContactUser }).then(({ data }) => {
          this.weworkContactUsers = data.content
        })
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' }
    ])
    await activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.detail = data
      if (data.pageType === 'YuhongSlotMachinePage') {
        this.custom_field_types.push({ key: 'CustomField::ThirdPartyCode', name: '三方验证码' })
      }
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.detail.title, path: { name: this.detail.state === 'pending' ? 'ActivityEdit' : 'ActivityShow', params: { activityId: this.$route.params.activityId }}},
      { title: '高级设置' }
    ])
    await activity_advance.get({ id: this.$route.params.activityId }).then(({ data }) => {
      this.form = { ...this.form, ...data }
      if (!this.form.weworkContactUser) {
        this.form.weworkContactUser = []
      }
      this.defaultCheckedRegion = data.region
      this.goodsModal.rebateGoods = data.rebateGoods || {}
    })

    await dict_region.tree_duplicate(this.defaultCheckedRegion).then(response => {
      this.text = response.data.map(item => item.name)
    })
    dict_region.tree().then(response => {
      this.region = response.data
    })
    channels.type().then(response => {
      this.channel_types = response.data
    })
    if (this.account.store.vipFuncEnabled) {
      vip_level.list().then(({ data }) => {
        this.levelList = data
      })
    }

    account.list().then(response => {
      this.accounts = response.data
    })
    if (this.detail.productId) {
      products.batch_list({ productId: this.detail.productId }).then(({ data }) => {
        this.productBatchList = data
      })
    }
    this.getUserTagList()
    this.getCustomField()
  },
  methods: {
    getUserTagList() {
      tags.all({ type: 'UserTag' }).then(({ data }) => {
        this.userTagList = data
      })
    },
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      if (params.data.column === 'leadingImg') {
        this.leadUploading = true
      } else {
        this.uploading = true
      }

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
        this.leadUploading = false
        this.uploading = false
      }).catch(() => {
        this.leadUploading = false
        this.uploading = false
      })
    },
    selectWework() {
      this.weWorkDialog = 1
      this.$nextTick(() => {
        this.$refs.we_work_modal.crud.refresh()
      })
    },
    cancelWeWork() {
      this.weWorkDialog = 0
    },
    addCustomField(data) {
      this.modal.status = 1
      this.$refs.customForm && this.$refs.customForm.resetFields()
      this.modal.title = `添加${data.name}`
      this.customForm.fieldableType = 'Activity'
      this.customForm.fieldableId = parseInt(this.$route.params.activityId)
      this.customForm.context = 'activity'
      this.customForm.hint = null
      this.customForm.label = null
      this.customForm.optionsStr = null
      this.customForm.required = false
      this.customForm.type = data.key
      delete this.customForm.id
      if (data.key === 'CustomField::PhoneCode') {
        this.customForm.required = true
      }
      this.customForm.label =
        ['CustomField::Name', 'CustomField::Phone', 'CustomField::PhoneCode', 'CustomField::CitizenId'].includes(data.key) ?
          (data.key === 'CustomField::PhoneCode' ? '手机号' : data.name) : null
    },
    cancelCustomField() {
      this.modal.status = 0
      this.$refs.customForm.resetFields()
    },
    createCustomField() {
      this.$refs.customForm.validate(valid => {
        if (valid) {
          this.modal.status = 2
          const action = this.customForm.id ? 'edit' : 'add'
          custom_field[action](this.customForm).then(response => {
            this.getCustomField()
            this.cancelCustomField()
          }).catch(() => {
            this.modal.status = 1
          })
        }
      })
    },
    getCustomField() {
      custom_field.get({ fieldableId: parseInt(this.$route.params.activityId), fieldableType: 'Activity' }).then(({ data }) => {
        this.customFieldList = data.filter(item => item.deletedAt === null)
      })
    },
    editCustomField(data) {
      this.customForm = Object.assign({}, data)
      this.modal.status = 1
      this.modal.title = `编辑${this.custom_field_types.find(item => item.key === data.type).name}`
    },
    delCustomField(data) {
      if (confirm('确定删除么？')) {
        custom_field.del(data).then(response => {
          this.getCustomField()
        })
      }
    },
    rebaterRequiredChange(newValue) {
      this.$refs.form.clearValidate()
    },
    submit() {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.submitting = true
          activity_advance.edit({ ...this.form, id: this.$route.params.activityId }).then(({ data }) => {
            this.submitting = false
            if (this.detail.state === 'pending') {
              if (this.detail.awardEnabled) {
                this.$router.push({ name: 'ActivityAwards', params: { activityId: this.$route.params.activityId }})
              } else {
                this.$router.push({ name: 'ActivityEditPage', params: { activityId: this.$route.params.activityId }})
              }
            } else {
              this.$router.push({ name: 'ActivityAdvanced', params: { activityId: this.$route.params.activityId }})
            }
          }).catch(fail => {
            this.submitting = false
            if (fail.error) {
              this.$refs[fail.error[0]['field']].$el.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
              })
            }
          })
        } else {
          if (this.$refs[Object.keys(object)[0]]) {
            this.$refs[Object.keys(object)[0]].$el.scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          }
        }
      })
    },
    save() {
      this.regionLoading = true
      dict_region.tree_duplicate(this.$refs.tree.getCheckedKeys()).then(response => {
        this.regionLoading = false
        this.show = false
        this.text = response.data.map(item => item.name)
        this.defaultCheckedRegion = response.data.map(r => r.id)
        this.form.region = response.data.map(r => r.id)
      }).catch(fail => {
        this.regionLoading = false
      })
    },
    selectRebate(data) {
      this.goodsModal.rebateGoods = data
      this.goodsModal.rebate = false
      this.form.rebateGoodId = data.id
    },
    cancelTag() {
      this.addTagStatus = 0
      this.tagForm.type = null
      this.tagForm.name = null
      this.tagForm.position = null
      this.$refs.tagForm.resetFields()
    },
    submitTag() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.addTagStatus = 2
          tags.add(this.tagForm).then(response => {
            if (this.tagForm.type === 'UserTag') {
              this.getUserTagList()
              if (this.tagForm.position === 'weworkAddTags') {
                this.form[this.tagForm.position].push(response.data.id)
              } else {
                this.form[this.tagForm.position].push(`${response.data.id}`)
              }
              this.cancelTag()
            }
          }).catch(fail => {
            this.addTagStatus = 1
          })
        }
      })
    },
    addTag(type, position) {
      this.tagForm.type = type
      this.tagForm.position = position
      this.addTagStatus = 1
    },
    remove_we_contact_user(data) {
      const index = this.form.weworkContactUser.findIndex(i => i === data.userid)
      const _index = this.weworkContactUsers.findIndex(i => i.userid === data.userid)
      if (index > -1) {
        this.form.weworkContactUser.splice(index, 1)
      }
      if (_index > -1) {
        this.weworkContactUsers.splice(_index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep {
  .custom_types {
    .el-button.el-button--success.el-button--small {
      padding: 5px 10px;
      font-size: 12px;
      margin-left: 3px;
    }
  }
}
</style>
<style>
.user_scan_tooltip {
  max-width: 436px;
}

</style>
