<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建排行榜
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="12">1</el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title"> 排行榜设置 </div>
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="排行榜名称">
                    <el-input v-model="form" />
                  </el-form-item>
                  <el-form-item label="显示数量">
                    <p class="help-block">显示数量上限为50</p>
                  </el-form-item>
                  <el-form-item label="横幅图">
                    <p class="help-block">尺寸：750 x 240px，格式：png，jpg，gif</p>
                  </el-form-item>
                  <el-form-item label="背景色">
                  </el-form-item>
                  <el-form-item label="指标">
                    <el-radio-group>
                      <el-radio>兑奖次数</el-radio>
                      <el-radio>红包金额</el-radio>
                      <el-radio>积分额</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="时间范围" class="content-full">
                    <el-radio-group>
                      <el-radio>今日</el-radio>
                      <el-radio>昨日</el-radio>
                      <el-radio>近7天</el-radio>
                      <el-radio>近30天</el-radio>
                      <el-radio>近90天</el-radio>
                      <el-radio>自定义</el-radio>
                    </el-radio-group>
                    <el-input />
                  </el-form-item>
                  <el-form-item label="活动" class="content-full">
                    <el-radio-group>
                      <el-radio>多选活动</el-radio>
                      <el-radio>活动标签</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="地区" class="content-full">
       
                  </el-form-item>
                  <el-form-item label="说明" class="content-full">
                    <Tinymce ref="editor" v-model="form.description" :height="400" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      rules: {},
      form: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建排行榜' }])
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-radio {
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
