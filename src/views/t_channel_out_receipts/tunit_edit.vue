<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <a href="javascript:void(0)">新建出库</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-form :inline="true" size="small" class="filter-form-inline" @submit.native.prevent="addTunits">
          <el-form-item label="">
            <el-input v-model="sn" placeholder="扫码或输入条码序号" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="success" @click="addTunits">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div
        class="panel-heading panel-title-small"
        style="padding: 8px 15px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 14px;">
          已添加数量：<span id="amount" class="lfl_text_large">{{crud.page.total}}</span>
        </div>
        <div>
          <span class="auto_save_text"><i class="fa fa-info-circle"></i> 已自动保存&nbsp;</span>
          <router-link class="el-button el-button--default el-button--small" :to="{name: 'TUnitsOutTUnitBatches', params: this.$route.params}">
            返回详情页
          </router-link>
        </div>
      </div>
      <el-table v-if="crud.data.length" :data="crud.data" :loading="crud.loading" :default-sort="{order: 'descending', prop: 'tUnit.snText'}">
        <el-table-column label="序号" prop="xh">
          <template slot-scope="scope">
            {{crud.page.total - scope.$index}}
            <!-- {{(crud.page.page-1)*crud.page.size + scope.$index + 1}} -->
          </template>
        </el-table-column>
        <el-table-column label="追溯码序号" prop="tUnit.snText"></el-table-column>
        <el-table-column label="追溯码单位" prop="tUnit.typeName"></el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <ProductName :product="scope.row.tUnit.unitSpec.product" />
          </template>
        </el-table-column>
        <el-table-column label="产品代码" prop="tUnit.unitSpec.product.code"></el-table-column>
        <el-table-column label="套码规格" prop="tUnit.unitSpec.specLabel"></el-table-column>
        <el-table-column label="批次" prop="tUnit.unitBatch.code">
          <template slot-scope="scope">
            <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.tUnit.unitBatch.id}}">
              {{scope.row.tUnit.unitBatch.code}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="tUnit.unitBatch.producedDate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a :href="'/admin/t_units/'+scope.row.unitId" target="_blank">详情</a>
            -
            <el-button type="text" @click="del({...$route.params, tUnitId: scope.row.unitId})">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination v-if="crud.data.length" /> -->
      <div v-else  class="sn_blank panel-body">
        <h3 class="title">扫码枪使用说明</h3>
        <el-row :gutter="0">
          <el-col :span="8">
            <p class="title">
              第1步<br>
              电脑连接USB扫码枪
            </p>
            <div class="receipt_step_img a"> </div>
          </el-col>
          <el-col :span="8">
            <p class="title">
              第2步<br>
              将光标置入左上角序号输入框
            </p>
            <div class="receipt_step_img b"> </div>
          </el-col>
          <el-col :span="8">
            <p class="title">
              第3步<br>
              开始扫码
            </p>
            <div class="receipt_step_img c"> </div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
import t_channel_receipt from '@/api/t_channel_receipt'
import t_unit from '@/api/t_unit'

import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import ProductName from '@/components/Product/Name'

export default {
  components: {
    pagination,
    ProductName
  },
  data() {
    return {
      sn: null
    }
  },
  mixins: [presenter(), header(), crud()],

  cruds() {
    return CRUD({ title: '追溯码明细', url: `/lmp/admin/api/t_channel_receipt/${this.parent.$route.params.id}/t_units`, sort: [], size: '100', crudMethod: {...t_unit}, idField: 'unitId'})
  },

  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      {title: '出库单列表', path: {name: 'TChannelOutReceiptIndex'}},
      {title: '新建出库'}
    ])
    this.crud.refresh()
  },
  methods: {
    addTunits() {
      t_channel_receipt.addTunits({str: this.sn}, this.$route.params.id).then(response => {
        this.sn = null
        this.crud.refresh()
      })
    },
    del(data) {
      if(confirm("确定删除?")) {
        t_unit.del({tUnitId: data.tUnitId}, data.id).then(response => {
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.lfl_text_large {
  color: #FF0000;
  font-size: 20px;
}
::v-deep {
  .sn_blank{
    text-align: center;
    .el-col-8{
      padding: 20px 0;
      .title{
        color: #333;
        font-weight: normal;
        font-size: 20px;
      }
      img{
        width: 50%;
      }
      p.title{
        position: relative;
        &:before{
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          border: 3px solid #dddddd;
          border-radius: 50%;
          margin: 0 auto;
          box-sizing: border-box;
          margin-bottom: 15px;
          position: relative;
          z-index: 3;
          background: #FFF;
        }
        &:after{
          content: '';
          display: block;
          width: 100%;
          height: 3px;
          background: #e8e8e8;
          position: absolute;
          top: 8px;
        }
      }
      &:first-child p.title{
        &:after{
          width: 50%;
          right: 0;
        }
      }
      &:last-child p.title{
        &:after{
          width: 50%;
          left: 0;
        }
      }
    }
    .receipt_step_img{
      width: 320px;
      height: 200px;
      margin: 0 auto;
      margin-top: 40px;
      box-shadow: 0px 0px 5px rgba(67,67,67,0.15);
      &.a{background: url("~@/assets/in_out_receipts/receipt_step_1.png") no-repeat center center; }
      &.b{background: url("~@/assets/in_out_receipts/receipt_step_2.png") no-repeat center center; }
      &.c{background: url("~@/assets/in_out_receipts/receipt_step_3.png") no-repeat center center; }
    }
  }
}
</style>
