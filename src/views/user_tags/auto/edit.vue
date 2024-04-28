<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active">
        <a href="javascript:void(0);">统一打标签</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="规则名称">
            <el-input v-model="form.label" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="设置条件">
            <div>
              <el-switch v-model="form.ruleContent[index].activityState" inactive-text="活动条件" />
            </div>
            <div v-if="form.ruleContent[index].activityState" class="child-form">
              <el-form-item v-for="(condition, _index) in form.ruleContent[index].activity" :key="_index">
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-select v-model="condition.key">
                      <el-option v-for="rule in userTagRule.activity" :key="rule.key" :label="rule.label" :value="rule.key" />
                    </el-select>
                  </el-col>
                  <el-col :span="15">
                    <component :is="condition.key" v-if="condition.key" v-model="condition.value" />
                    <el-select v-else v-model="condition.value" />
                  </el-col>
                  <el-col :span="1">
                    <i class="el-icon-delete" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button type="success" @click="add('activity')">添加</el-button>
            </div>
            <div>
              <el-switch v-model="form.ruleContent[index].pointsStoreState" inactive-text="商城条件" />
            </div>
            <div v-if="form.ruleContent[index].pointsStoreState" class="child-form">
              <el-form-item v-for="(condition, _index) in form.ruleContent[index].points_store" :key="_index">
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-select v-model="condition.key">
                      <el-option v-for="rule in userTagRule.points_store" :key="rule.key" :label="rule.label" :value="rule.key" />
                    </el-select>
                  </el-col>
                  <el-col :span="15">
                    <component :is="condition.key" />
                  </el-col>
                  <el-col :span="1">
                    <i class="el-icon-delete" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button type="success" @click="add('points_store')">添加</el-button>
            </div>
            <div>
              <el-switch v-model="form.ruleContent[index].vipState" inactive-text="会员条件" />
            </div>
            <div v-if="form.ruleContent[index].vipState" class="child-form">
              <el-form-item v-for="(condition, _index) in form.ruleContent[index].vip" :key="_index">
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-select v-model="condition.key">
                      <el-option v-for="rule in userTagRule.vip" :key="rule.key" :label="rule.label" :value="rule.key" />
                    </el-select>
                  </el-col>
                  <el-col :span="15">
                    <component :is="condition.key" />
                  </el-col>
                  <el-col :span="1">
                    <i class="el-icon-delete" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button type="success" @click="add('vip')">添加</el-button>
            </div>
          </el-form-item>
          <hr>
          <el-button type="success" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import user_tag_auto from '@/api/user_tag_auto'

import vipLongTime from './ItmeForm/vipLongTime.vue'
import vipLevelIds from './ItmeForm/vipLevelIds.vue'

import psLongTime from './ItmeForm/psLongTime.vue'
import psGoodIds from './ItmeForm/psGoodIds.vue'
import psTotalOrder from './ItmeForm/psTotalOrder.vue'
import psTotalPay from './ItmeForm/psTotalPay.vue'
import psTotalPayPoints from './ItmeForm/psTotalPayPoints.vue'

import atyLongTime from './ItmeForm/atyLongTime.vue'
import atyActivityIds from './ItmeForm/atyActivityIds.vue'
import atyTotalOrder from './ItmeForm/atyTotalOrder.vue'
import atyTotalRedPack from './ItmeForm/atyTotalRedPack.vue'
import atyTotalPoints from './ItmeForm/atyTotalPoints.vue'
export default {
  components: {
    vipLongTime,
    vipLevelIds,
    psLongTime,
    psGoodIds,
    psTotalOrder,
    psTotalPay,
    psTotalPayPoints,
    atyLongTime,
    atyActivityIds,
    atyTotalOrder,
    atyTotalRedPack,
    atyTotalPoints
  },
  data() {
    return {
      rules: {},
      index: 0,
      form: {
        label: null,
        ruleContent: [
          {
            vipState: 0,
            pointsStoreState: 0,
            activityState: 0,
            condition: [],
            activity: [],
            points_store: [],
            vip: []
          }
        ]
      },
      userTagRule: {}
    }
  },
  mounted() {
    user_tag_auto.rule().then(({ data }) => {
      this.userTagRule = data
      Object.keys(data).forEach(item => {
        data[item].forEach(e => {
          console.log(e.key, e.label)
        })
      })
    })
  },
  methods: {
    add(type) {
      this.form.ruleContent[this.index][type].push({
        key: null,
        value: null,
        time: Date.now()
      })
    },
    submit() {
      console.log(this.form)
    }
  }
}
</script>

<style>

</style>
