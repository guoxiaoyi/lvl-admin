<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li>
        <router-link :to="{ name: 'UserTags' }">用户标签</router-link>
      </li>
      <li v-if="checkPer(['intelligent_tag', 'intelligent_tag_read'])" class="active">
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
            <el-table-column label="规则名称" prop="label" />
            <el-table-column label="条件类型" prop="typeName" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="更新时间" prop="updatedAt" />
            <el-table-column label="状态" prop="stateName">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.state" active-value="enabled" inactive-value="closed" :disabled="!checkPer(['intelligent_tag'])" @change="handleChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-if="checkPer(['intelligent_tag', 'intelligent_tag_read'])" type="text" @click="$router.push({ name: 'UserAutoTagEdit', params: { id: scope.row.id }, query: { type: scope.row.type }})">编辑</el-button>
                <el-button v-if="checkPer(['intelligent_tag'])" type="text" :loading="loading.includes(scope.row.id)" @click="doOnce(scope.row)">执行一次</el-button>
                <el-button v-if="checkPer(['intelligent_tag'])" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      :visible.sync="activeButton.action === 'add_user_auto_tag' && activeButton.show"
      title="选择条件"
      width="580px"
    >
      <el-form ref="form" :model="form" size="small" label-width="0px" class="rule">
        <el-form-item prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="single">
              <h4>统一打标签</h4>
              <p>
                如：“累计消费金额超过10万”的用户，在“用户类型”标签下打上“超级用户”
              </p>
            </el-radio>
            <el-radio label="compound">
              <h4>多规则打标签</h4>
              <p>
                如：“过去1年有消费的用户”，根据不同的消费金额分为三个群体，分别打上“高价值”、“中价值”、“低价值”
              </p>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="created">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import user_tag_auto from '@/api/user_tag_auto'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import tags from '@/api/tag'
import { mapGetters } from 'vuex'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '标签', url: '/lmp/v2/admin/intelligent_tag_rule', sort: ['createdAt,desc'], crudMethod: { ...user_tag_auto }})
  },
  data() {
    return {
      loading: [],
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
      },
      form: {
        type: 'single'
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
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
    },
    doOnce(data) {
      this.loading.push(data.id)
      user_tag_auto.process(data).then(response => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.$message.success('执行成功')
        this.crud.refresh()
      }).catch(fail => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.crud.refresh()
      })
    },
    cancel() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    },
    created() {
      this.$router.push({ name: 'UserAutoTagNew', query: { type: this.form.type }})
      this.cancel()
    },
    handleChange(row) {
      // 这里调用 API，模拟API请求
      user_tag_auto.switch_state(row).then(({ data }) => {
        this.$message.success('修改成功')
      }).catch(fail => {
        row.state = 'closed'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .rule {
    .el-form-item__content {
      width: 100%;
    }
    .el-radio {
      display: flex;
      align-items: center;
      background: #F8F8F8;
      padding: 15px;
      width: 100%;
      min-height: 100px;
      &+.el-radio {
        margin-top: 20px;
      }
      h4 {
        margin: 0px;
        margin-bottom: 5px;
      }
      .el-radio__label {
        p {
          margin: 0;
          white-space: normal;
          line-height: 1.34;
        }
      }
    }
  }
}
</style>
