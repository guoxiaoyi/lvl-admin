<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active">
        <router-link :to="{ name: 'UserTags' }">用户标签</router-link>
      </li>
      <li v-if="checkPer(['intelligent_tag', 'intelligent_tag_read'])">
        <router-link :to="{ name: 'UserAutoTagIndex' }">智能打标签</router-link>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="success" @click="tagAsync.show = true">标签同步</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="标签名称" prop="name" />
            <el-table-column label="用户数量" prop="num" />
            <el-table-column label="更新时间" prop="updatedAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="580px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">

        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="tagAsync.show"
      title="标签同步"
      width="580px"
    >
      <el-form ref="form" :model="tagAsync.form" size="small" label-width="80px">
        <el-form-item label="标签同步" prop="name">
          <el-switch v-model="tagAsync.form.data" />
          <p class="help-block">开启后，将同步到微信公众号，微信限制最多便签数量为100个；<br>
            关闭后，将不同步到微信公众号，标签数量可最多300个。</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="tagAsync.status === 1" type="primary" @click="submit">提交</el-button>
        <el-button @click="tagAsync.show = false">取消</el-button>
      </div>
    </el-dialog>
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
    return CRUD({ title: '标签', url: '/lmp/v2/admin/tag', query: { type: 'UserTag' }, crudMethod: { ...tags }, sort: ['createdAt,desc'] })
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
    tags.get_setting_info().then(response => {
      this.tagAsync.form.data = response.data
    })
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
