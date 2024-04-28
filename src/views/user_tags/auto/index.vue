<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li>
        <router-link :to="{ name: 'UserTags' }">用户标签</router-link>
      </li>
      <li class="active">
        <router-link :to="{ name: 'UserAutoTagIndex' }">智能打标签</router-link>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="创建时间">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="搜索">
              <el-input v-model="query.label" placeholder="规则名称" />
            </el-form-item>
            <el-form-item label="条件类型">
              <el-select v-model="query.type" clearable>
                <el-option value="single" label="统一打标签" />
                <el-option value="compound" label="多规则打标签" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state" clearable>
                <el-option value="enabled" label="开启" />
                <el-option value="closed" label="关闭" />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="规则名称" />
            <el-table-column label="条件类型" />
            <el-table-column label="创建时间" />
            <el-table-column label="更新时间" />
            <el-table-column label="状态" />
            <el-table-column label="操作">
              <template scope-slot="scope">
                <el-button type="text">编辑</el-button>
                <el-button type="text">执行一次</el-button>
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>
<script>
const defaultForm = {
  name: null,
  type: 'UserTag'
}
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import tags from '@/api/tag'
import { mapGetters } from 'vuex'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '标签', url: '/lmp/v2/admin/intelligent_tag_rule', sort: ['createdAt,desc'] })
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      tagAsync: {
        status: 0,
        show: false,
        form: {
          data: null
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  watch: {
    activeButton() {
      if (this.activeButton.show && this.activeButton.action === 'add_user_tag') {
        this.crud.toAdd()
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户标签' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterAddCancel]() {
      this.init_button()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.init_button()
    },
    init_button() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    },
    submit() {
      this.tagAsync.status = 1
      tags.sync(this.tagAsync.form.data).then(response => {
        this.tagAsync.status = 0
        this.tagAsync.show = false
      }).catch(fail => {
        this.tagAsync.status = 0
      })
    }
  }
}
</script>
