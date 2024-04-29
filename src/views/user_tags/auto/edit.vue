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
            <div v-for="type in conditionTypes" :key="type.key">
              <el-switch v-model="form.ruleContent[index][type.stateKey]" :inactive-text="type.label" :active-value="1" :inactive-value="0" />

              <div v-if="form.ruleContent[index][type.stateKey]" class="child-form">
                <el-form-item v-for="(condition, _index) in form.ruleContent[index][type.key]" :key="_index">
                  <el-row :gutter="12">
                    <el-col :span="8">
                      <el-select v-model="condition.key" @change="() => { condition.value = null }">
                        <el-option v-for="rule in userTagRule[type.key]" :key="rule.key" :label="rule.label" :value="rule.key" :disabled="selectedUserTagRule.includes(rule.key)" />
                      </el-select>
                    </el-col>
                    <el-col :span="15">
                      <component :is="condition.key" v-if="condition.key" v-model="condition.value" />
                      <el-select v-else value="" />
                    </el-col>
                    <el-col :span="1">
                      <i class="el-icon-delete" @click="remove(type.key, _index)" />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-button v-if="userTagRule[type.key].length > form.ruleContent[index][type.key].length" type="success" @click="add(type.key)">添加</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择标签">
            <el-select v-model="form.tagIds" size="small" multiple filterable placeholder="请输入">
              <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
import tag from '@/api/tag'

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
        type: null,
        ruleContent: [
          {
            vipState: 0,
            pointsStoreState: 0,
            activityState: 0,
            condition: {},
            activity: [],
            points_store: [],
            vip: []
          }
        ],
        tagIds: []
      },
      userTagRule: {},
      conditionTypes: [
        { key: 'activity', label: '活动条件', stateKey: 'activityState' },
        { key: 'points_store', label: '商城条件', stateKey: 'pointsStoreState' },
        { key: 'vip', label: '会员条件', stateKey: 'vipState' }
      ],
      tagList: []
    }
  },
  computed: {
    selectedUserTagRule() {
      return [].concat(this.form.ruleContent[this.index].activity.map(item => item.key))
        .concat(this.form.ruleContent[this.index].points_store.map(item => item.key))
        .concat(this.form.ruleContent[this.index].vip.map(item => item.key))
        .filter(item => item != null && item !== '')
    }
  },
  created() {
    tag.all({ type: 'UserTag' }).then(response => {
      this.tagList = response.data
    })
  },
  mounted() {
    this.form.type = 'single'
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
      this.form.ruleContent.forEach(element => {
        this.conditionTypes.forEach(item => {
          element[item.key].forEach(_item => {
            element.condition[_item.key] = _item.value
          })
        })
      })

      user_tag_auto.add(this.form).then(response => {
        console.log(response)
      })
      // console.log(this.form.ruleContent)
    },
    remove(typeKey, index) {
    // 移除指定类型和索引的表单项
      this.form.ruleContent[this.index][typeKey].splice(index, 1);
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-icon-delete {
    cursor: pointer;
  }
</style>
