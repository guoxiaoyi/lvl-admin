<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <router-link :to="{name: 'RegisterChannels'}">渠道审核</router-link> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form v-if="!loading" ref="form" size="small" label-width="16.6666%" :rules="rules" :model="channel">

          <el-form-item label="名称" prop="name">
            <el-input v-model="channel.name" />
          </el-form-item>

          <el-form-item label="代码" required>
            <el-input v-model="channel.code" />
          </el-form-item>

          <el-form-item label="所属上级" prop="parentId">
            <el-select
              v-model="channel.parentId"
              size="small"
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

          <el-form-item label="联系人">
            <el-input v-model="channel.contact" />
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="channel.phone" />
          </el-form-item>

          <el-form-item label="业务范围">
            <div>{{regionScopeName.join(',')}}</div>
            <el-button type="success" size="medium" @click="region_scope.modal.show = true">设置渠道区域范围</el-button> 
          </el-form-item>

          <el-form-item label="地区" class="el-address">
            <el-select v-model="channel.province" placeholder="请选择" @change="changeProvince">
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select v-model="channel.city" placeholder="请选择">
              <el-option
                v-for="item in city"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select v-model="channel.district" placeholder="请选择">
              <el-option
                v-for="item in district"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="channel.addr" />
          </el-form-item>

          <el-form-item label="经纬度" class="lon_lat">
            <div class="el-input-group">
              <el-input v-model="channel.lon" />
              <span class="input-group-addon">-</span>
              <el-input v-model="channel.lat" />
            </div>
            <p class="help-block">查询经纬度，<a href="https://lbs.amap.com/console/show/picker" target="_blank">点击这里</a></p>
          </el-form-item>

          <el-form-item label="地图">
            <div v-if="channel.lon && channel.lat" class="map">
              <img :src="map_picture(channel.lat, channel.lon)" style="border-radius: 10px;">
              <a :href="qq_map_url(channel.lat, channel.lon, channel.name, channel.addr)" class="btn map-btn" target="_blank">查看地图</a>
            </div>
            <div v-else> - </div>
          </el-form-item>
          <div v-for="(cfv, index) in channel.customFieldValues" :key="index+'custom'">
            <el-form-item
              v-if="cfv.kind !== 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'"
              :rules="{required: cfv.required, message: cfv.label+'不能为空', trigger: 'blur'}"
            >
              <el-input v-if="cfv.kind === 'string'" v-model="cfv.value" />

              <el-select
                v-if="cfv.kind === 'select'"
                v-model="cfv.value"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_select_' + cfv.id"
                  :label="_item"
                  :value="_item"
                />
              </el-select>

              <el-checkbox-group v-if="cfv.kind === 'checkboxes'" v-model="cfv.value">
                <el-checkbox
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_checkboxes_' + cfv.id"
                  :label="_item"
                  :value="_item"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              v-if="cfv.kind === 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'"
            >
              <img
                :id="'cfv_picture_'+ cfv.id"
                :ref="'cfv_picture_'+ cfv.id"
                :src="(cfv.picture_list && cfv.picture_list.length) ? cfv.picture_list[0]['url'] : ''"
                :class="{'img-thumbnail': cfv.picture_list, 'avatar-thumbnail-middle': cfv.picture_list}"
                :style="{'display': (cfv.picture_list ? 'block': 'none')}"
              >
              <el-upload
                action="#"
                :data="cfv"
                :file-list="cfv.picture_list"
                accept="image/*"
                :show-file-list="false"
                :http-request="listenUploadImageLimit">
                <el-button type="success" size="medium">上传</el-button>
              </el-upload>
            </el-form-item>
          </div>

          <el-form-item label="备注" style="margin-top: 5px">
            <el-input v-model="channel.note" type="textarea" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" size="small" @click="submit"> 保存并通过</el-button>
          <el-button type="danger" size="small" @click="reject.modal.show = true"> 驳回</el-button>

        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="region_scope.modal.show"
      title="选择业务范围"
      width="600px"
    >
      <el-tree
        ref="tree"
        node-key="id"
        :data="[region]"
        show-checkbox
        :props="props"
        :default-expanded-keys="['100000']"
        :default-checked-keys="defaultCheckedRegion"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="region_scope.button.status" @click="submit_region_scope">确认</el-button>
        <el-button @click="cancel_region_scope">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="reject.modal.show"
      title="填写驳回理由"
      width="600px"
    >
      <el-input v-model="rejectReason" type="textarea" :rows="5" placeholder="填写驳回理由" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="reject.button.status" @click="submit_reject">确认</el-button>
        <el-button @click="cancel_reject">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import channel_register from '@/api/channel_register'
import channels from '@/api/channels'
import region_api from '@/api/region'
import custom_form from '@/api/custom_form'
import amazon from '@/api/amazon'

export default {
  data() {
    return {
      loading: false,

      // 自定义表单
      custom_form: {},

      channel: {},
      rules: {
        parentId: [
          { required: true, message: '所属上级为必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称为必填', trigger: 'blur' }
        ]
      },

      channelType: [],
      channel_parents_options: [],

      searchLoading: false,

      province: [],
      city: [],
      district: [],
      region: [],

      submitting: false,

      rejectReason: '',

      props: {
        label: 'name',
        children: 'children'
      },
      defaultCheckedRegion: [],

      result_region: [],
      regionScopeName: [],

      changeLoading: false,
      submit_reject_loading: false,

      region_scope: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      },

      reject: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      }
    }
  },
  watch: {
    'channel.province'() {
      this.getCity(this.channel.province)
    },
    'channel.city'() {
      this.getDistrict(this.channel.city)
    }
  },

  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道审核列表', path: { name: 'RegisterChannels' }},
      { title: '渠道审核', path: { name: 'RegisterChannelsEdit', params: { id: this.$route.params.id }}}
    ])
    await this.fetch()
    await this.getProvince()

    await channels.type().then(response => {
      this.channelType = response.data.filter(t => t.key === 'Channels::Level0')
    })

    await channels.all().then(response => {
      this.channel_parents_options = response.data
    })
    await custom_form.index({ type: `CustomForms::${this.channel.channelType.split('::')[1]}` }).then(response => {
      this.custom_form = response.data

      this.channel.customFieldValues = response.data.fieldsList.filter(f => f.type === 'custom').map(field => {
        const f = this.customField(field)
        const fv = this.setCustomFieldValue(f)

        let value = ''

        if (fv) {
          f.oid = fv.id
        }

        if (f.kind === 'checkboxes') {
          if (fv && fv.valueList && fv.valueList.length) {
            value = fv.valueList
          } else {
            value = []
          }
        }

        if (f.kind === 'picture') {
          if (fv && fv.pictureUrl) {
            f.picture_list = [
              { name: fv.pictureFileName, url: fv.pictureUrl, id: f.id }
            ]
          }
        }

        if (['select', 'string'].includes(f.kind)) {
          if (fv && fv.value) {
            value = fv.value
          }
        }

        return {
          ...f,
          value: value
        }
      })
    })

    await region_api.tree().then(response => {
      this.region = response.data
    })
  },
  methods: {
    fetch() {
      this.loading = true
      channel_register.show({ id: this.$route.params.id }).then(response => {
        this.loading = false
        this.channel = {
          district: response.data.district,
          city: response.data.city,
          province: response.data.province,
          name: response.data.name,
          channelType: response.data.channelType,
          code: response.data.code,
          contact: response.data.contact,
          addr: response.data.addr,
          lon: response.data.lon,
          lat: response.data.lat,
          note: response.data.note,
          phone: response.data.phone,
          customFieldValues: response.data.customFieldValues,
          regionScopeCode: response.data.regionScopeCode
        }
        this.defaultCheckedRegion = response.data.regionScopeCode
        this.regionScopeName = response.data.regionScopeName || []

        if (response.data.parentChannel) {
          this.channel.parentId = response.data.parentChannel.id
        }
      })
    },
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
    getProvince() {
      region_api.getChildren({}).then(response => {
        this.province = response.data
      }).catch(() => {})
    },
    getCity(code) {
      if (code) {
        region_api.getChildren({ code }).then(response => {
          this.city = response.data
        }).catch(() => {})
      }
    },
    getDistrict(code) {
      if (code) {
        region_api.getChildren({ code }).then(response => {
          this.district = response.data
        }).catch(() => {})
      }
    },
    changeProvince() {
      this.channel.city = null
      this.channel.district = null
    },
    submit() {
      // 格式化自定义表单数据
      const customFieldValues = []
      this.channel.customFieldValues.forEach(cfv => {
        let value = { customFieldId: cfv.id }
        if (cfv.oid) {
          value = { ...value, id: cfv.oid }
        }

        switch (cfv.kind) {
          case 'picture':
            value['pictureId'] = cfv.value
            break
          case 'checkboxes':
            value['value'] = cfv.value.join()
            break
          default:
            value['value'] = cfv.value
            break
        }
        if (cfv.kind !== 'picture') {
          customFieldValues.push({
            ...value
          })
        } else {
          if (!cfv.value) {
            delete value.pictureId
          }
          customFieldValues.push({
            ...value
          })
        }
      })

      // 拷贝数据
      const data = Object.assign({}, this.channel)
      data.customFieldValues = customFieldValues

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          channel_register.audit({ ...data, state: 'enabled', id: this.$route.params.id }).then(response => {
            this.$router.push({ name: 'RegisterChannels' })
            this.submitting = false
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    customField(v) {
      return this.custom_form.customFields.find(f => f.id === v.value)
    },
    setCustomFieldValue(v) {
      return this.channel.customFieldValues.find(f => f.customField.id === v.id)
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        params.data.value = response.data.id
        params.data.picture_list = [{ name: response.data.fileFileName, url: response.data.imageUrl, id: params.data.id }]

        this.$refs[`cfv_picture_${params.data.id}`][0]['src'] = response.data.imageUrl
        this.$refs[`cfv_picture_${params.data.id}`][0]['style'].display = 'block'
        this.$refs[`cfv_picture_${params.data.id}`][0].classList = 'img-thumbnail avatar-thumbnail-middle'
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    submit_region_scope() {
      this.region_scope.button.status = true
      region_api.names({ code: this.$refs.tree.getCheckedKeys().join(',') }).then(response => {
        this.result_region = response.data
        this.regionScopeName = response.data.map(r => r.name)
        this.channel.regionScopeCode = response.data.map(r => r.id)
        this.defaultCheckedRegion = response.data.map(r => r.id)

        this.region_loading = false
        this.cancel_region_scope()
      }).then(response => {
        this.region_scope.button.status = false
      })
    },
    cancel_region_scope() {
      this.region_scope.button.status = false
      this.region_scope.modal.show = false
    },
    submit_reject() {
      this.reject.button.status = true
      channel_register.audit({ state: 'rejected', rejectReason: this.rejectReason, id: this.$route.params.id }).then(response => {
        this.$router.push({ name: 'RegisterChannels' })
        this.cancel_reject()
      }).catch(() => {
        this.reject.button.status = false
      })
    },
    cancel_reject() {
      this.reject.button.status = false
      this.reject.modal.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .lon_lat .el-form-item__content .el-input-group,
  .el-address .el-form-item__content {
    display: flex;
  }
  .lon_lat .el-input:first-child input{
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .lon_lat .el-input:last-child input{
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .lon_lat .input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lon_lat .el-form-item__content .help-block {
    line-height: 1;
  }
  .el-address .el-form-item__content {
    justify-content: space-between;
    &:before, &:after {
      display: none;
    }
  }
  .el-address .el-form-item__content .el-select {
    width: 32.7%;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    margin: 0 8px 0px 0;
  }
  .upload-hide .el-upload.el-upload--picture-card {
    display: none !important;
  }
  .avatar-thumbnail-middle {
    width: 120px;
    height: 120px;
  }
  .img-thumbnail {
    padding: 4px;
    line-height: 1.428571429;
    background-color: #FBFBFB;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    display: inline-block;
    max-width: 100%;
    height:auto
  }
  .map {
    position: relative;
    width: 400px;
    height: 200px;
    .map-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      background: #999;
      color: #FFF;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.428571429;
    }
  }
}
</style>
