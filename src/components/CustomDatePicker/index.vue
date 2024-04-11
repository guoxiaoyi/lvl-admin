<template>
  <div class="el-custom-input-group">
    <el-date-picker
      v-model="startDate"
      type="date"
      placeholder="开始时间"
      :clearable="clearable"
      @change="handleStartChange"
      @blur="handleStartBlur"
    />
    <div class="el-input-group-addon">至</div>
    <el-date-picker
      v-model="endDate"
      type="date"
      placeholder="结束时间"
      :clearable="clearable"
      @change="handleEndChange"
    />
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
      default: () => {}
    }
  },
  data() {
    return {
      startDate: this.value.length ? this.value[0] : '',
      endDate: this.value.length ? this.value[1] : ''
    }
  },
  watch: {
    value(newVal) {
      this.startDate = newVal.length ? newVal[0] : '';
      this.endDate = newVal.length ? newVal[1] : '';
    }
  },
  methods: {
    handleStartChange(value) {
      this.updateRange(value, this.endDate);
    },
    handleStartBlur(data) {
      console.log(123)
    },
    handleEndChange(value) {
      this.updateRange(this.startDate, value);
    },
    updateRange(start, end) {
      // 应用默认时间
      const formattedStart = this.formatDate(start, this.defaultTime[0]);
      const formattedEnd = this.formatDate(end, this.defaultTime[1]);

      // 更新内部值并通知父组件
      this.$emit('input', [formattedStart, formattedEnd]);
    },
    formatDate(date, time) {
      if (!date) return '';
      const momentDate = moment(date).format('YYYY-MM-DD');
      return `${momentDate} ${time}`;
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-input--prefix .el-input__inner {
    padding-left: 15px;
  }
  .el-input__prefix {
    display: none;
  }
}
.el-custom-input-group {
  width: 290px;
}
</style>
