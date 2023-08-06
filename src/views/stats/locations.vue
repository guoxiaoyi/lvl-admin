<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          地域分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <el-form-item label="时间" class="content-full" prop="submittedAtRange">
              <el-date-picker
                v-model="query.submittedAtRange"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="活动" prop="activityId">
              <el-select
                v-model="query.activityId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteActiveMethod"
                :loading="searchActiveLoading"
              >
                <el-option
                  v-for="item in activityList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动标签" prop="activityTagIds">
              <el-select
                v-model="query.activityTagIds"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import tags from '@/api/tag'
import stats from '@/api/stats'
import moment from 'moment'

export default {
  data() {
    return {
      searchActiveLoading: false,
      activityList: [],
      tagList: [],
      query: {
        submittedAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        activityId: null,
        activityTagIds: null,
        areaCode: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '地域分析' }])
    this.toQuery()
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
  },
  methods: {
    remoteActiveMethod(query) {
      this.searchActiveLoading = true
      setTimeout(() => {
        activities.list({ search: query.toLowerCase() }).then(response => {
          this.searchActiveLoading = false
          this.activityList = response.data.content
        })
      }, 200)
    },
    toQuery() {
      const start_time = new Date(this.query.submittedAtRange[0])
      const end_time = new Date(this.query.submittedAtRange[1])
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      stats.locations({ ...this.query, userStatsGroup }).then(({ data }) => {
        console.log(data)
      })
    },
    resetQuery() {}
  }
}
</script>

<style>

</style>
