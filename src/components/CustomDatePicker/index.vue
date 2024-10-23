<template>
  <div class="flex">
    <div class="el-custom-input-group time-picker">
      <el-date-picker
        ref="startDate"
        v-model="startDate"
        :editable="false"
        type="date"
        placeholder="开始时间"
        :clearable="false"
        @change="handleStartChange"
        @blur="handleStartBlur"
      />
      <div class="el-input-group-addon">-</div>
      <el-date-picker
        ref="endDate"
        v-model="endDate"
        :editable="false"
        type="date"
        placeholder="结束时间"
        :clearable="clearable"
        :picker-options="pickerOptionsForEndDate"
        :default-value="defaultValue"
        @change="handleEndChange"
        @blur="handleEndBlur"
      />
    </div>
    <div v-if="pickerOptions.shortcuts.length" style="margin-left: 25px;">
      <el-button v-for="(item, index) in pickerOptions.shortcuts" :key="index" type="text" @click="handleShortcutClick(index)">{{ item.text }}</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default: () => []
    },
    defaultTime: {
      type: Array,
      default: () => ['00:00:00', '23:59:59']
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {
          shortcuts: [
            {
              text: '今天',
              onClick: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
            },
            {
              text: '昨天',
              onClick: [moment().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')]
            },
            {
              text: '最近7天',
              onClick: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
            },
            {
              text: '最近30天',
              onClick: [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      startDate: this.value.length ? this.value[0] : '',
      endDate: this.value.length ? this.value[1] : '',
      defaultValue: null
    }
  },
  computed: {
    pickerOptionsForEndDate() {
      const disabledDate = date => {
        return this.startDate ? date.getTime() < new Date(this.startDate).getTime() : false
      }

      return {
        disabledDate
      }
    }
  },
  watch: {
    value(newVal) {
      this.startDate = newVal.length ? newVal[0] : null
      this.endDate = newVal.length ? newVal[1] : null
      if (!this.startDate && !this.endDate) {
        if (Array.isArray(newVal) && newVal.length) {
          this.$emit('input', [])
        }
      }
    }
  },
  methods: {
    handleStartChange(value) {
      if (!value) {
        this.endDate = ''
      } else if (this.endDate && new Date(value) > new Date(this.endDate)) {
        // 如果设置的开始时间晚于结束时间，则清空结束时间
        this.endDate = ''
      }
      if (value && !this.endDate) {
        // 如果开始时间被设置且结束时间为空，则让结束时间输入框获取焦点
        this.$nextTick(() => {
          this.$refs.endDate.focus()
        })
      }
      this.updateRange(value, this.endDate)
    },
    handleStartBlur() {
      this.defaultValue = this.startDate
    },
    handleEndBlur() {
      // 如果结束时间为空，当结束时间输入框失去焦点时，设置结束时间与开始时间相同
      if (!this.endDate && this.startDate) {
        this.endDate = this.startDate
        this.updateRange(this.startDate, this.endDate)
      }
    },
    handleEndChange(value) {
      if (!value) {
        this.startDate = ''
      }
      if (value && !this.startDate) {
        this.startDate = this.endDate
      }
      this.updateRange(this.startDate, value)
    },
    updateRange(start, end) {
      const formattedStart = this.formatDate(start, this.defaultTime[0])
      const formattedEnd = this.formatDate(end, this.defaultTime[1])
      this.$emit('input', [formattedStart, formattedEnd])
    },
    formatDate(date, time) {
      if (!date) return ''
      const momentDate = moment(date).format('YYYY-MM-DD')
      return `${momentDate} ${time}`
    },
    handleShortcutClick(index) {
      this.updateRange(this.pickerOptions.shortcuts[index]['onClick'][0], this.pickerOptions.shortcuts[index]['onClick'][1])
      this.$emit('toQuery')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input--prefix .el-input__inner {
    padding-left: 12px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 12px;
  }
  .el-input__prefix {
    display: none;
  }
}
</style>
