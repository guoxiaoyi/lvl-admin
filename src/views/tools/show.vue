<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          奖项分配助手
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div style="width: 810px; margin: 0 auto;">
          <el-form :inline="true" class="tools-form">
            <el-form-item label="总的预算">
              <el-input v-model="budget" placeholder="预算" />
            </el-form-item>
            <el-form-item label="奖品总数">
              <el-input v-model="count" placeholder="数量" />
            </el-form-item>
            <el-form-item label="奖项分配比例(例如1:9:50:40)" style="width: 257px;">
              <el-input v-model.trim="ratioStr" placeholder="比例（用:分隔）" />
            </el-form-item>
            <div style="display: inline-block; width: 55px;padding-top: 32px;">
              <el-button type="success" @click="initializeDeployer">分配</el-button>
            </div>
          </el-form>
          <h5>分配方案</h5>
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
          <p class="color-red">注：奖项的中奖金额和奖品个数可修改</p>
          <div class="text-center" style="margin-bottom: 10px;">
            <el-button type="success" @click="saveResults">查看分配结果</el-button>
          </div>
          <div v-if="results.length" class="panel-default panel">
            <div class="panel-body">
              <ul>
                <li v-for="(item, index) in results" :key="index">
                  {{ item }}
                </li>
              </ul>
              <p>{{ resultText }}</p>
            </div>
          </div>
        </div>
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
      results: [],
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
      const totalRatios = ratios.reduce((acc, ratio) => acc + ratio, 0)
      let remainingCount = this.count
      // 计算每个比例的理想数量（浮点数）
      const idealCounts = ratios.map(ratio => this.count * ratio / totalRatios)

      // 初始化实际分配数组，先向下取整分配
      const initialCounts = idealCounts.map(ideal => Math.floor(ideal))
      remainingCount -= initialCounts.reduce((acc, num) => acc + num, 0)

      // 处理剩余数量，优先分配小数部分较大的奖项
      const remainders = idealCounts.map((ideal, index) => ({ index, remainder: ideal - initialCounts[index] }));
      remainders.sort((a, b) => b.remainder - a.remainder) // 按剩余小数部分排序

      // 分配剩余数量
      for (let i = 0; i < remainingCount; i++) {
        initialCounts[remainders[i].index]++
      }

      // 构建最终奖项数组
      this.items = initialCounts.map((count, index) => {
        const val = 0 // 初始值
        const rate = 100 * count / this.count // 计算中奖率
        return { val, count, rate, get total() { return this.val * this.count } }
      });
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
      const results = this.items.map(item => `${item.val}元，${item.count}份，中奖率${item.rate.toFixed(2)}%`)
      this.results = results
      this.resultText = `综合中奖率${this.totalRate.toFixed(2)}%，奖品总共${this.totalItems}份，总奖金额${this.totalValue.toFixed(2)}元。`
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
