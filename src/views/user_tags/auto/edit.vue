<template>
  <div class="app-container">
    <ul v-if="$route.query.type !== 'compound'" class="nav nav-tabs" role="tablist">
      <li class="active">
        <a href="javascript:void(0);">统一打标签</a>
      </li>
    </ul>
    <ul v-else class="nav nav-tabs" role="tablist">
      <li v-for="(item, idx) in form.ruleContent" :key="idx" :class="{ active: idx === index }" @click="switchTab(idx)">
        <a href="javascript:void(0);">规则{{ idx + 1 }}</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item :hidden="index > 0" label="规则名称">
            <el-input v-model="form.label" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="!loading" label="设置条件">
            <div v-for="(_type, stateIndex) in conditionTypes" :key="_type.key">
              <el-switch
                v-model="form.ruleContent[index][_type.stateKey]"
                :inactive-text="_type.label"
                :active-value="1"
                :inactive-value="0"
                :disabled="index > 0"
                @change="onSwitchCondition"
              />
              <div v-if="index > 1 && stateIndex === 0" class="pull-right">
                <el-button type="text" @click="removeRuleContent">删除</el-button>
              </div>
              <div v-if="form.ruleContent[index][_type.stateKey]" class="child-form">
                <el-form-item v-for="(condition, _index) in form.ruleContent[index][_type.key]" :key="_index">
                  <el-row :gutter="12">
                    <el-col :span="8">
                      <el-select v-model="condition.key" :disabled="index > 0" @change="onSelectRule($event, condition, _index, _type.key)">
                        <el-option v-for="rule in userTagRule[_type.key]" :key="rule.key" :label="rule.label" :value="rule.key" :disabled="selectedUserTagRule.includes(rule.key)" />
                      </el-select>
                    </el-col>
                    <el-col :span="15">
                      <component :is="condition.key" v-if="condition.key" v-model="condition.value" />
                      <el-select v-else value="" />
                    </el-col>
                    <el-col :span="1">
                      <i v-if="index <= 0" class="el-icon-delete" @click="remove(_type.key, _index)" />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-button v-if="userTagRule[_type.key].length > form.ruleContent[index][_type.key].length" type="success" :disabled="index > 0" @click="add(_type.key)">添加</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择标签">
            <el-select v-model="form.ruleContent[index]['tagIds']" size="small" multiple filterable placeholder="请输入">
              <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <p class="help-block">若符合条件，将自动打上所选标签</p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import user_tag_auto from '@/api/user_tag_auto'
import tag from '@/api/tag'
import { mapGetters } from 'vuex'

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
      loading: false,
      submitting: false,
      rules: {},
      index: 0,
      form: {
        label: null,
        type: null,
        ruleContent: [
          {
            vipState: 0,
            pointsStoreState: 0,
            activityState: 0,
            condition: {},
            activity: [],
            points_store: [],
            vip: [],
            tagIds: []
          }
        ]
      },
      userTagRule: {},
      conditionTypes: [
        { key: 'activity', label: '活动条件', stateKey: 'activityState' },
        { key: 'points_store', label: '商城条件', stateKey: 'pointsStoreState' },
        { key: 'vip', label: '会员条件', stateKey: 'vipState' }
      ],
      tagList: [],
      syncFields: ['vipState', 'pointsStoreState', 'activityState', 'activity', 'points_store', 'vip']
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ]),
    selectedUserTagRule() {
      return [].concat(this.form.ruleContent[this.index].activity.map(item => item.key))
        .concat(this.form.ruleContent[this.index].points_store.map(item => item.key))
        .concat(this.form.ruleContent[this.index].vip.map(item => item.key))
        .filter(item => item != null && item !== '')
    }
  },
  watch: {
    activeButton() {
      if (this.activeButton.show && this.activeButton.action === 'add_user_tag_rule') {
        if (this.form.ruleContent.length < 3) {
          const record = this.form.ruleContent[0]
          this.form.ruleContent.push({
            vipState: record.vipState,
            pointsStoreState: record.pointsStoreState,
            activityState: record.activityState,
            condition: {},
            activity: record.activity.map(item => { return { key: item.key, value: null, time: item.time } }),
            points_store: record.points_store.map(item => { return { key: item.key, value: null, time: item.time } }),
            vip: record.vip.map(item => { return { key: item.key, value: null, time: item.time } }),
            tagIds: []
          })
          this.index = this.form.ruleContent.length - 1
          this.switchTab(this.index)
          this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
        }
        return
      }
    }
  },
  async created() {
    tag.all({ type: 'UserTag' }).then(response => {
      this.tagList = response.data
    })
    await user_tag_auto.rule().then(({ data }) => {
      this.userTagRule = data
    })
    if (this.$route.name === 'UserAutoTagEdit') {
      // await user_tag_auto.show({ id: this.$route.params.id }).then(({ data }) => {
      const formData = {
        ...this.$store.getters.userTag.data,
        ruleContent: this.$store.getters.userTag.data.ruleContent.map(element => ({ ...element }))
      }
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '用户标签', path: { name: 'UserTags' }},
        { title: '智能打标签', path: { name: 'UserAutoTagIndex' }},
        { title: formData.label }
      ])
      formData.ruleContent.forEach((element, idx) => {
        for (const category in this.userTagRule) {
          element[category] = []
          this.userTagRule[category].forEach(item => {
            // 检查数据中是否存在配置的key
            if (formData.ruleContent[idx].condition.hasOwnProperty(item.key)) {
              element[category].push({
                key: item.key,
                label: item.label,
                value: formData.ruleContent[idx].condition[item.key],
                time: Date.now()
              })
            }
          })
        }
      })
      this.form = formData
      // })
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '用户标签', path: { name: 'UserTags' }},
        { title: '智能打标签', path: { name: 'UserAutoTagIndex' }}
      ])
    }
  },
  mounted() {
    this.form.type = this.$route.query.type || 'single'
  },
  methods: {
    add(type) {
      this.form.ruleContent.forEach((item, index) => {
        item[type].push({
          key: null,
          value: null,
          time: Date.now()
        })
      })
    },
    submit() {
      this.submitting = true
      this.form.ruleContent.forEach(element => {
        this.conditionTypes.forEach(item => {
          element[item.key].forEach(_item => {
            element.condition[_item.key] = _item.value
          })
        })
      })
      const action = this.$route.name === 'UserAutoTagEdit' ? 'edit' : 'add'
      user_tag_auto[action](this.form).then(response => {
        this.submitting = false
        this.$router.push({ name: 'UserAutoTagIndex' })
      }).catch(fail => {
        this.submitting = false
      })
    },
    remove(typeKey, index) {
      // 移除指定类型和索引的表单项
      this.form.ruleContent.forEach(item => {
        item[typeKey].splice(index, 1)
      })
    },
    async switchTab(i) {
      this.loading = true
      this.index = i
      await this.$nextTick(() => {
        this.loading = false
      })
    },
    onSelectRule(event, data, idx, type) {
      data.value = null
      this.form.ruleContent.slice(1).forEach(element => {
        element[type][idx]['key'] = event
        element[type][idx]['value'] = null
      })
    },
    onSwitchCondition(data) {
      this.form.ruleContent.slice(1).forEach(element => {
        ['activityState', 'pointsStoreState', 'vipState'].forEach(i => {
          element[i] = this.form.ruleContent[0][i]
        })
      })
    },
    removeRuleContent() {
      this.form.ruleContent.splice(this.index, 1)
      this.index--
      this.switchTab(this.index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-icon-delete {
    cursor: pointer;
  }
</style>
