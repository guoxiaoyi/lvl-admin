<template>
  <div class="app-container">
    <tab />

    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="认领时间" class="el-data-time-picker">
                <custom-date-picker v-model="query.registeredAt" @toQuery="toQuery" />
                <!-- <el-date-picker
                  v-model="query.registeredAt"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '00:00:00']"
                  :picker-options="elPickerOptions()"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="搜索" prop="blurry">
              <el-input v-model="query.blurry" placeholder="名称/代码" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="query.type" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in channelType"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                >
                  {{ item.value }}
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属上级" prop="parentId">
              <el-select
                v-model="query.parentId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteMethod"
                :loading="searchLoading"
              >
                <el-option
                  v-for="item in channel_parents_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="认领状态" prop="registered">
              <el-select v-model="query.registered" clearable placeholder="请选择">
                <el-option label="已认领" value="true" />
                <el-option label="未认领" value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="返利状态">
              <el-select v-model="query.stopRebate" clearable placeholder="请选择">
                <el-option label="暂停" value="true" />
                <el-option label="正常" value="false" />
              </el-select>
            </el-form-item>

            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
            <div v-if="checkPer(['channel_list'])">
              <label class="checkbox">
                <input v-model="checked" type="checkbox" name="check_all" @click="selectAll"> 全选本页
              </label>
              <span>
                <el-button
                  type="success"
                  size="mini"
                  :disabled="checkboxList.length <= 0"
                  @click="modal.channel_type.show = true"
                >
                  批量修改渠道类型
                </el-button>
              </span>
              -
              <span>
                <el-button
                  type="success"
                  size="mini"
                  :disabled="checkboxList.length <= 0"
                  @click="modal.parent_channel.show = true"
                >
                  批量修改所属上级
                </el-button>
              </span>
              -
              <el-button type="success" size="mini" @click="export_data">导出Excel</el-button>
            </div>
            <div class="btn-group" role="group">
              <el-radio-group v-model="ChannelTemplate" size="medium">
                <el-radio-button label="list">列表展示</el-radio-button>
                <el-radio-button label="tree">树状展示</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <el-table v-if="ChannelTemplate === 'list'" v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="select" label="选择" width="50px">
              <template slot-scope="scope">
                <input
                  :id="'channels_'+scope.row.id"
                  v-model="checkboxList"
                  :name="'channels['+scope.row.id+']'"
                  type="checkbox"
                  :disabled="scope.row.type == 'Channels::Level0'"
                  :value="scope.row.id"
                >
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
                <div class="text-muted">{{ scope.row.code }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="typeName" label="类型" />
            <el-table-column prop="parentChannel" label="所属上级">
              <template slot-scope="scope">
                {{ scope.row.parentChannel ? scope.row.parentChannel.name : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="china_city_addr" label="所在地">
              <template slot-scope="scope">
                {{ scope.row.provinceName }} {{ scope.row.cityName }} {{ scope.row.districtName }}
              </template>
            </el-table-column>
            <el-table-column prop="manager" label="管理员" />
            <el-table-column prop="registeredAt" label="认领状态">
              <template slot-scope="scope">
                {{ scope.row.registeredAt ? '已认领' : '未认领' }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="添加时间" />
            <el-table-column prop="actions" label="操作">
              <template slot-scope="scope">
                <template v-if="scope.row.type !== 'Channels::TerminalShop' && checkPer(['channel_list'])">
                  <router-link :to="{name: 'ChannelListNew', query: {channel_type: scope.row.type, parent_id: scope.row.id}}">
                    新建子渠道
                  </router-link>
                  -
                </template>
                <router-link :to="{name: 'ChannelShow', params: {id: scope.row.id}}">
                  查看
                </router-link>

                <template v-if="!scope.row.hasChild && checkPer(['channel_list'])">
                  -
                  <span><el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button></span>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <ChannelTree v-if="ChannelTemplate === 'tree'" />
        </div>
        <pagination v-if="ChannelTemplate === 'list'" />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.parent_channel.show"
      :title="modal.parent_channel.title"
      width="580px"
    >
      <el-form ref="form" size="small" label-width="16.666%" :model="modal.parent_channel.form">
        <el-form-item label="所属上级">
          <el-select
            v-model="modal.parent_channel.form.parentId"
            size="small"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            :remote-method="remoteMethod"
            :loading="searchLoading"
          >
            <el-option
              v-for="item in channel_parents_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <p class="help-block">所选渠道所属上级将根据上面选择的渠道批量修改。</p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit('parent_channel')">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.channel_type.show"
      :title="modal.channel_type.title"
      width="580px"
    >
      <el-form ref="form" size="small" label-width="16.666%" :model="modal.channel_type.form">
        <el-form-item label="渠道类型" prop="type">
          <el-select v-model="modal.channel_type.form.type" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in channelType"
              :key="index"
              :label="item.value"
              :value="item.key"
            >
              {{ item.value }}
            </el-option>
          </el-select>
          <p class="help-block">所选渠道类型将根据上面选择的类型批量变更。</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit('channel_type')">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import channels from '@/api/channels'
import { mapGetters } from 'vuex'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import tab from '@/components/Tabs/channel_index.vue'
import ChannelTree from '@/components/Channel/tree'
import BackgroundTask from '@/components/BackgroundTask'
export default {
  components: {
    BackgroundTask,
    pagination,
    tab,
    ChannelTree
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      isChangeType: false,
      channelType: [],

      channelParent: '',
      channel_parents_options: [],
      searchLoading: false,
      isChannelParent: false,

      checked: false,
      checkboxList: [],

      modal: {
        parent_channel: {
          show: false,
          title: '批量修改所属上级',
          form: {
            parentId: null
          }
        },
        channel_type: {
          show: false,
          title: '批量修改渠道类型',
          form: {
            type: null
          }
        }
      },

      channelTreeModal: {
        show: false
      },
      submitting: false,
      ChannelTemplate: 'list',

      export_data_modal: {
        show: false
      },

      export_data_params: {},
      task: {
        id: null,
        state: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'breadcrumb'
    ])
  },
  watch: {
    checkboxList: {
      handler: function(val, oldVal) {
        if (this.checkboxList.length && this.checkboxList.length === this.crud.data.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      deep: true
    },
    ChannelTemplate() {
      if (this.ChannelTemplate === 'list') {
        this.crud.toQuery()
      }
    }
  },
  cruds() {
    return CRUD({ title: '渠道管理', url: '/lmp/admin/api/channel', sort: 'id,desc', crudMethod: { ...channels }})
  },
  async activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道列表', path: { name: 'ChannelSearch' }}])
    channels.type().then(response => {
      this.channelType = response.data.filter(t => t.key !== 'Channels::Level0')
    })
    channels.index().then(response => {
      this.searchLoading = false
      this.channel_parents_options = response.data.content
    })
    await this.crud.refresh()
    localStorage.removeItem('ChannelIndex')
  },
  mounted() {

  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channel_parents_options = response.data
          })
        }, 200)
      } else {
        this.channel_parents_options = []
      }
    },
    del(data) {
      this.crud.doDelete(data)
    },
    selectAll() {
      if (this.checked) {
        this.checkboxList = []
      } else {
        this.checkboxList = []
        this.crud.data.forEach((item) => {
          if (item.type !== 'Channels::Level0') {
            this.checkboxList.push(item.id)
          }
        })
      }
    },

    [CRUD.HOOK.beforeRefresh](crud, data) {
      // this.checked = false
      this.checkboxList = []
    },
    submit(action) {
      this.submitting = true
      if (action === 'parent_channel') {
        if (this.modal.parent_channel.form.parentId) {
          channels.update_parent({
            ids: this.checkboxList,
            parentId: this.modal.parent_channel.form.parentId
          }).then(() => {
            this.submitting = false
            this.cancel()
            this.crud.refresh()
          }).catch(() => {
            this.submitting = false
          })
        } else {
          this.$message.error('请选择上级渠道')
          this.submitting = false
        }
      }
      if (action === 'channel_type') {
        if (this.modal.channel_type.form.type) {
          channels.update_type({
            ids: this.checkboxList,
            type: this.modal.channel_type.form.type
          }).then(() => {
            this.submitting = false
            this.cancel()
            this.crud.refresh()
          }).catch(() => {
            this.submitting = false
          })
        } else {
          this.$message.error('请选择渠道类型')
          this.submitting = false
        }
      }
    },
    cancel() {
      this.modal = {
        parent_channel: {
          show: false,
          title: '批量修改渠道类型',
          form: {
            parentId: null
          }
        },
        channel_type: {
          show: false,
          title: '批量修改所属上级',
          form: {
            type: null
          }
        }
      }
    },
    toQuery() {
      this.ChannelTemplate = 'list'
      this.export_data_params = this.crud.query
      this.crud.toQuery()
    },
    resetQuery() {
      this.ChannelTemplate = 'list'
      this.crud.resetQuery()
    },
    export_data() {
      channels.download(this.export_data_params).then(({ data }) => {
        this.task.id = data.id
        this.task.state = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-heading {
    padding: 20px 10px;
  }
</style>
