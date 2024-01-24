<!-- 为解决用户手输入时间，没有时间范围, 导致后台查询错误，添加默认时间 -->
<template>
  <el-date-picker
    v-model="internalDateRange"
    type="daterange"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择日期范围"
    :picker-options="pickerOptions"
    @change="handleChange"
  />
</template>

<script>
import moment from 'moment'
export default {
  props: {
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
              onClick(picker) {
                picker.$emit('pick', [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                picker.$emit('pick', [moment().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')])
              }
            },
            {
              text: '最近7天',
              onClick(picker) {
                picker.$emit('pick', [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
              }
            },
            {
              text: '最近30天',
              onClick(picker) {
                picker.$emit('pick', [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
              }
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      internalDateRange: this.value
    }
  },
  watch: {
    value(newVal) {
      this.internalDateRange = newVal
    }
  },
  methods: {
    handleChange(value) {
      if (Array.isArray(value) && value.length === 2) {
        this.applyDefaultTime(value)
      } else {
        this.internalDateRange = value
      }
      this.$emit('input', this.internalDateRange)
    },
    applyDefaultTime(dateRange) {
      let [startDate, endDate] = dateRange

      // 格式化日期并添加默认时间
      startDate = this.formatDate(new Date(startDate), this.defaultTime[0])
      endDate = this.formatDate(new Date(endDate), this.defaultTime[1])

      this.internalDateRange = [startDate, endDate]
    },
    formatDate(date, time) {
      const [hours, minutes, seconds] = time.split(':')
      date.setHours(hours, minutes, seconds, 0)

      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day

      return `${year}-${month}-${day} ${time}`
    }
  }
}
</script>
