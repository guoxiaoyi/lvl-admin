<template>
  <div class="app-contaienr">
    <Tab :activity="activity" />
    <div class="panel panel-default">
      <div class="panel-body">
        <LflTable :list="crud.data">
          <div class="panel panel-default">
            <el-table :data="crud.data">
              <el-table-column label="活动图片">
                <template slot-scope="scope">
                  <ActivityBanner :item="{ pageBannerUrl: scope.row.pageBannerUrl, pageBannerDefault: scope.row.pageBannerDefault }" />
                </template>
              </el-table-column>
              <el-table-column label="活动标题/标签" min-width="230px">
                <template slot-scope="scope">
                  <div>
                    <router-link v-if="checkPer(['activity_read'])" :to="{ name: 'ActivityShow', params: { activityId: scope.row.id }}">{{ scope.row.title }}</router-link>
                    <template v-else>{{ scope.row.title }}</template>
                  </div>
                  <div class="code">编号: {{ scope.row.code }}</div>
                  <el-tooltip popper-class="activity-popper" effect="dark" content="点击编辑标签" placement="right">
                    <a class="label label-true" @click="modal.tag.status = 1; activityParentId = scope.row.id">编辑标签</a>
                  </el-tooltip>
                  <div class="activity-tag">
                    <span v-for="item in scope.row.activityTags" :key="item.id" class="label label-light">{{ item.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态/抽奖进度">
                <template slot-scope="scope">
                  <el-tag :type="{paused: 'danger', enabled: 'success', pending: 'warning', expired: 'info'}[scope.row.runningState]" effect="plain">{{ scope.row.runningStateText }}</el-tag>
                  <div style="margin-top: 5px;">
                    <el-progress v-if="scope.row.state !== 'pending'" :text-inside="true" :stroke-width="16" :percentage="scope.row.rafflePercentage" status="success" text-color="#FFF" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="scope">
                  <router-link v-if="checkPer(['activity_read'])" :to="{ name: 'ActivityShow', params: { activityId: scope.row.id }}" style="margin-right: 10px;">详情</router-link>
                  <template v-if="account.main">
                    <el-button type="text" :loading="loading.includes(scope.row.id)" @click="crud.doDelete(scope.row, '确认删除？删除后活动二维码将不可用，如需恢复请进入回收站操作。')">删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination />
        </LflTable>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="close"
      :visible="modal.tag.status > 0"
      title="编辑活动标签"
      width="780px"
      top="6vh"
    >
      <el-checkbox-group v-model="activityTags">
        <el-row :gutter="20">
          <el-col v-for="item in tagList" :key="item.id" :span="8">
            <el-checkbox :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <el-form v-if="modal.tag.add > 0" ref="tagForm" :rules="rules" inline :model="tagForm" size="small" @submit.native.prevent="addTag">
        <el-form-item prop="name" style="width:280px; margin-top: 10px;" :rules="{ required: true, message: '标签名称不能为空', trigger: 'blur' }">
          <el-input v-model="tagForm.name" />
        </el-form-item>
        <el-form-item style=" margin-top: 10px;">
          <el-button :loading="modal.tag.add > 1" type="success" @click="addTag">添加</el-button>
        </el-form-item>
        <el-form-item style=" margin-top: 10px;">
          <el-button @click="modal.tag.add = 0">取消</el-button>
        </el-form-item>
      </el-form>
      <el-button v-else type="text" @click="modal.tag.add = 1">新建标签</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button :loadin="modal.tag.status > 0" type="primary" @click="submit">保存</el-button>
        <el-button @click="modal.tag.status = 0">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tab from '@/components/Tabs/activity.vue'
import activities from '@/api/activities'
import ActivityBanner from '@/components/ActivityBanner'
import LflTable from '@/components/LflTable'
import { mapGetters } from 'vuex'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import tags from '@/api/tag'

export default {
  components: {
    Tab,
    LflTable,
    pagination,
    ActivityBanner
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '子活动管理', url: '/lmp/v2/admin/activity', sort: ['top,desc', 'id,desc'], params: { parentId: this.parent.$route.params.activityId }, crudMethod: { ...activities }})
  },
  data() {
    return {
      activity: {},
      loading: [],
      tagList: [],
      activityTags: [],
      rules: {},
      tagForm: {
        type: 'ActivityTag',
        name: null
      },
      modal: {
        tag: {
          status: 0,
          add: 0
        },
        units: {
          status: 0
        }
      },
      activityParentId: null
    }
  },
  computed: {
    ...mapGetters([
      'activeButton',
      'account'
    ])
  },
  watch: {
    activeButton() {
      // https://admin.lfl5.cn/admin/activities/new?kind=normal&page_type=YuhongSlotMachinePage&parent_id=1357&type=UnitsActivity
      if (this.activeButton.show && this.activeButton.action === 'create_children_activity') {
        this.$router.push({ name: 'ActivityNew', query: { kind: this.activity.kind, page_type: this.activity.pageType, parent_id: this.activity.id, type: this.activity.type }})
        this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
      }
    }
  },
  async mounted() {
    await activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.activity = { ...this.activity, ...data }
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }},
        { title: data.title }
      ])
      this.crud.refresh()
    })
    this.fetchTag()
  },
  methods: {
    fetchTag() {
      tags.all({ type: 'ActivityTag' }).then(response => {
        this.tagList = response.data
      })
    },
    close() {
      this.modal.tag.status = 0
      this.activityParentId = null
    },
    submit() {
      this.modal.tag.status = 2
      activities.update_tags({ id: this.activityParentId, tagIds: this.activityTags }).then(response => {
        this.close()
        this.crud.refresh()
      }).catch(fail => {
        this.modal.tag.status = 0
      })
    },
    addTag() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.modal.tag.add = 2
          tags.add(this.tagForm).then(({ data }) => {
            this.modal.tag.add = 1
            this.fetchTag()
            this.$refs.tagForm.resetFields()
            this.activityTags.push(data.id)
          }).catch(fail => {
            this.modal.tag.add = 1
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-tag {
  display: inline-block;
  margin-left: 5px ;
  ::v-deep {
    .el-tag+.el-tag {
      margin-left: 5px;
    }
  }
}
.code {
  font-size: 12px;
  margin-bottom: 0;
  color: #999;
}

.label.label-true {
  &:hover {
    background: #449d44;
    color: #FFF;
    border: 1px #5cb85c solid;
  }
}
::v-deep {
  .el-col {
    margin-bottom: 10px;
  }
}
</style>
