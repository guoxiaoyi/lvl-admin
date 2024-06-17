<template>
  <div class="well activity_steps">
    <el-steps align-center finish-status="success" :active="current_active">
      <el-step v-for="(item, index) in list" :key="index" :title="`${index+1}.${item.text}`">
        <template slot="title">
          {{ index + 1 }}.
          {{ item.text }}
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Number,
      default: 1
    },
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      current_active: 0,
      list: [
        { text: '设置基本信息', name: 'ActivityEdit' },
        { text: '高级设置', name: 'ActivityAdvanceEdit' },
        { text: '设置奖项', name: 'ActivityAwards' },
        { text: '设置活动页面', name: 'ActivityEditPage' },
        { text: '确认创建活动', name: 'ActivityWizardCheck' },
        { text: '完成' }
      ]
    }
  },
  watch: {
    activity(newValue) {
      this.stepList(newValue.awardEnabled)
    }
  },
  mounted() {
    this.stepList(this.activity.awardEnabled)
  },
  methods: {
    stepList(awardEnabled) {
      this.current_active = this.active
      const index = this.list.findIndex(i => i.name === 'ActivityAwards')
      if (awardEnabled === false) {
        if (index > -1) {
          this.list.splice(index, 1)
          if (this.active > 2) {
            this.current_active -= 1
          }
        }
      } else {
        if (index <= -1) {
          this.list.splice(index, 0, { text: '设置奖项', name: 'ActivityAwards' })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.well {
  min-height: 20px;
  padding: 19px;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ededed;
  border-radius: 4px;
  box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05)
}

</style>
