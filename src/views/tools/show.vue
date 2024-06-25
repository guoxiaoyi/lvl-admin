<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form :inline="true" class="tools-form">
          <el-form-item label="总的预算">
            <el-input v-model="budget" placeholder="预算" />
          </el-form-item>
          <el-form-item label="奖品总数">
            <el-input v-model="count" placeholder="数量" />
          </el-form-item>
          <el-form-item label="奖项分配比例(例如1:9:50:40)">
            <el-input v-model.trim="ratioStr" placeholder="比例（用:分隔）" />
          </el-form-item>
          <el-form-item>
            <div slot="label" style="opacity: 0;">分配</div>
            <el-button type="success" @click="initializeDeployer">分配</el-button>
          </el-form-item>
        </el-form>
        <div class="panel panel-default">
          <table class="table table-loose table-bordered table-hove">
            <thead>
              <tr>
                <th>中奖金额(元)</th>
                <th>奖品个数(个)</th>
                <th>中奖率(%)</th>
                <th>该奖项总奖金(元)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>
                  <el-input v-model="item.val" min="0" step="0.01" @input="updateTotal(index)" />
                </td>
                <td><el-input v-model.number="item.count" min="0" step="0.01" @input="updateRateAndTotal(index)" /> </td>
                <td>{{ item.rate.toFixed(2) }}%</td>
                <td>{{ item.total.toFixed(2) }}</td>
              </tr>
              <tr class="total-line">
                <td>总计</td>
                <td>{{ totalItems }}</td>
                <td>{{ totalRate.toFixed(2) }}%</td>
                <td>
                  <span :class="{'color-red': totalValue > budget}">
                    {{ totalValue.toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-button @click="saveResults">生成数据</el-button>
        {{ resultText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budget: '',
      count: '',
      ratioStr: '',
      items: [],
      resultText: ''
    }
  },
  computed: {
    totalItems() {
      return this.items.reduce((acc, item) => acc + item.count, 0)
    },
    totalRate() {
      return this.items.reduce((acc, item) => acc + item.rate, 0)
    },
    totalValue() {
      return this.items.reduce((acc, item) => acc + item.total, 0)
    }
  },
  methods: {
    initializeDeployer() {
      const ratios = this.ratioStr.split(':').map(Number)
      const totalRatios = ratios.reduce((acc, ratio) => acc + (ratio > 0 ? ratio : 0), 0) // 计算非零比例的总和
      let remainingCount = this.count // 初始化剩余数量为总数量

      // 检查是否所有的比例都为0，如果是，则均等分配
      if (totalRatios === 0) {
        this.items = ratios.map((ratio, index) => ({
          val: 0, // 初始值
          count: Math.floor(this.count / ratios.length), // 均等分配
          rate: 100 / ratios.length, // 均等分配的中奖率
          get total() { return this.val * this.count }
        }))
      } else {
        this.items = ratios.map((ratio, index) => {
          let count
          if (index === ratios.length - 1) {
            count = remainingCount // 如果是最后一个项目，则使用剩余数量
          } else if (ratio > 0) {
            count = Math.floor(this.count * ratio / totalRatios)
            remainingCount -= count
          } else {
            count = 0 // 如果比例为0，分配0个单位
          }

          const val = 0 // 初始值
          const rate = this.count > 0 ? 100 * count / this.count : 0 // 计算中奖率，避免除以0的错误
          return { val, count, rate, get total() { return this.val * this.count } }
        })
      }
    },
    updateRateAndTotal(index) {
      const item = this.items[index]
      item.rate = 100 * item.count / this.count
      item.total = item.val * item.count
    },
    updateTotal(index) {
      const item = this.items[index]
      item.total = item.val * item.count
    },
    saveResults() {
      const results = this.items.map(item => `${item.val}元，${item.count}份，中奖率${item.rate.toFixed(2)}%`).join('\n')
      this.resultText = `${results} 综合中奖率${this.totalRate.toFixed(2)}%，奖品总共${this.totalItems}份，总奖金额${this.totalValue.toFixed(2)}元。`
      localStorage.setItem('prizeDeploy', JSON.stringify({
        budget: this.budget,
        count: this.count,
        ratios: this.ratioStr,
        items: this.items.map(item => ({ val: item.val, count: item.count }))
      }))
    }
  }
}
</script>
<style lang="scss" scoped>

.tools-form {
  ::v-deep {
    .el-form-item__label {
      padding-bottom: 0;
    }
    .el-form-item__content {
      width: 100%;
    }
  }
}
.table-bordered {
  thead, tbody {
    th, td {
      border-left: 1px solid #E6E6E6 !important;
      &:first-child {
        border-left: 0 !important;
      }
    }
    th {
      border-top: 0 !important;
    }
  }
}
</style>
