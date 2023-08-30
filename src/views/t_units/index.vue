<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li :class="{active: filterMode === 'batch' }">
        <a aria-current="page" href="javascript:void(0)" @click="filterMode = 'batch'">序号搜索</a>
      </li>
      <li :class="{active: filterMode === 'range' }">
        <a aria-current="page" href="javascript:void(0)" @click="filterMode = 'range'">号段搜索</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item v-if="filterMode === 'batch'" label="序号搜索" class="content-full">
              <div style="width: 320px;">
                <el-input v-model="query.snText" type="textarea" placeholder="一行输入一个二维码序列号，多个序列号请换行输入 最多99条数据" :rows="5" />
              </div>
            </el-form-item>
            <el-form-item v-if="filterMode === 'range'" label="号段搜索" class="content-full">
              <div style="width: 420px;">
                <el-col :span="11">
                  <el-input v-model="query.snStart" placeholder="起始序号" />
                </el-col>
                <el-col :span="2"><div class="text-center">至</div></el-col>
                <el-col :span="11">
                  <el-input v-model="query.snEnd" placeholder="终止序号" />
                </el-col>
              </div>
            </el-form-item>
            <div>
              <el-form-item label="追溯码级别">
                <el-select v-model="query.type" clearable>
                  <el-option label="一级码" value="TUnits::Level1" />
                  <el-option label="二级码" value="TUnits::Level2" />
                  <el-option label="三级码" value="TUnits::Level3" />
                  <el-option label="四级码" value="TUnits::Level4" />
                </el-select>
              </el-form-item>
              <el-form-item label="关联状态">
                <el-select v-model="query.packed" clearable>
                  <el-option label="已关联子码" :value="true" />
                  <el-option label="未关联子码" :value="false" />
                </el-select>
              </el-form-item>
            </div>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="snText" label="追溯码序号" />
            <el-table-column prop="typeText" label="单位/码级别" />
            <el-table-column prop="packedStatus" label="关联状态">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 'TUnits::Level1'">-</span>
                <el-tag v-else-if="scope.row.type !== 'TUnits::Level1' && scope.row.packed" type="success">已关联子码</el-tag>
                <el-tag v-else-if="scope.row.type !== 'TUnits::Level1' && !scope.row.packed" type="warning">未关联子码</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.product.name" label="产品名称" min-width="120px">
              <template slot-scope="scope">
                <ProductName v-if="scope.row.unitSpec && scope.row.unitSpec.product" :product="scope.row.unitSpec.product" />
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.product.code" label="产品代码">
              <template slot-scope="scope">
                {{ scope.row.unitSpec && scope.row.unitSpec.product && scope.row.unitSpec.product.code ? scope.row.unitSpec.product.code : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.specLabel" label="套码规格">
              <template slot-scope="scope">
                {{ scope.row.unitSpec && scope.row.unitSpec.specLabel ? scope.row.unitSpec.specLabel : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="unitBatch.code" label="生产批次">
              <template slot-scope="scope">
                {{ scope.row.unitBatchCode || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="所在渠道">
              <template slot-scope="scope">
                <router-link v-if="scope.row.channelId" :to="{ name: 'ChannelShow', params: { id: scope.row.channelId }}">
                  {{ scope.row.channelName }}
                </router-link>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="90px">
              <template slot-scope="scope">
                <a :href="'/admin/t_units/' + scope.row.id"> 详情 </a>
                <!-- <router-link :to="{name: 'TUnitShow', params: { id: scope.row.id} }">
                  详情
                </router-link> -->
                <el-button v-if="checkPer(['t_unit_manage']) && scope.row.code" type="text" @click="preview(scope.row)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <PreViewCode :show.sync="previewModal.show" :link="previewModal.data.link" :sn="previewModal.data.sn" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import ProductName from '@/components/Product/Name'
import t_unit from '@/api/t_unit'
import PreViewCode from '@/components/PreView/Code.vue'
export default {
  components: {
    pagination,
    ProductName,
    PreViewCode
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '追溯码查询', url: '/lmp/v2/admin/t_unit' })
  },
  data() {
    return {
      filterMode: 'batch',
      previewModal: {
        data: {
          link: '',
          sn: ''
        },
        show: false
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询' }
    ])
    this.crud.refresh()
  },
  methods: {
    preview(data) {
      this.previewModal.show = true
      this.previewModal.data.sn = data.snText
      t_unit.preview(data).then(response => {
        this.previewModal.data.link = response.data.codeUrl
      })
      console.log(this.previewModal)
    }
  }
}
</script>
