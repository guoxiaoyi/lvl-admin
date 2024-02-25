<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td>序号</td>
            <td> {{ result.snText }} </td>
          </tr>
          <tr>
            <td>单位/级别</td>
            <td> {{ result.typeName }} </td>
          </tr>
          <tr>
            <td>所属渠道</td>
            <td> {{ result.unitBatch.channel.name }} </td>
          </tr>
          <tr>
            <td>关联活动</td>
            <td>
              <router-link v-if="result.unitBatch.activityId" :to="{ name: 'ActivityShow', params: { activityId: result.unitBatch.activityId } }">
                {{ result.unitBatch.activityId }}
              </router-link>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td>关联活动码状态</td>
            <td>
              {{ result.unitId ? '已关联' : '未关联' }}
            </td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              <ProductName :product="result.unitSpec.product" :border="true" :size="style" />
            </td>
          </tr>
          <tr>
            <td>产品代码</td>
            <td>
              {{ result.unitSpec.product.code }}
            </td>
          </tr>
          <tr>
            <td>套码规格</td>
            <td>
              {{ result.unitSpec.specLabel }}
            </td>
          </tr>
          <tr>
            <td>生产批次</td>
            <td>
              {{ result.unitBatch.code }}
            </td>
          </tr>
          <tr>
            <td>生产日期</td>
            <td>
              {{ result.unitBatch.producedDate }}
            </td>
          </tr>
        </table>
      </div>
      <div v-if="checkPer(['t_unit_manage']) && result.code" class="panel-footer">
        <el-button type="success" :loading="previewModal.loading" @click="preview({ id: result.snText })"> 预览 </el-button>
      </div>
    </div>
    <PreViewCode :show.sync="previewModal.show" :link="previewModal.data.link" :sn="previewModal.data.sn" />
  </div>
</template>
<script>
import t_unit from '@/api/t_unit'
import tab from '@/components/Tabs/t_units'
import ProductName from '@/components/Product/Name'
import PreViewCode from '@/components/PreView/Code.vue'
export default {
  components: {
    tab,
    ProductName,
    PreViewCode
  },
  data() {
    return {
      result: {},
      style: {
        width: '70px'
      },
      previewModal: {
        data: {
          link: '',
          sn: ''
        },
        show: false,
        loading: false
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询', path: { name: 'TUnitsIndex' }},
      { title: '追溯码详情' }
    ])
    t_unit.show(this.$route.params.id).then(response => {
      this.result = response.data
    })
  },
  methods: {
    preview(data) {
      this.previewModal.loading = true
      t_unit.preview(data).then(response => {
        this.previewModal.show = true
        this.previewModal.data.sn = response.data.snText
        this.previewModal.data.link = response.data.codeUrl
        this.previewModal.loading = false
      }).catch(fail => {
        this.previewModal.loading = false
      })
    }
  }
}
</script>
