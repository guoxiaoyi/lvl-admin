<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript:void(0)">
          {{ $route.name === 'ChannelNew' ? '创建渠道' : '编辑渠道' }}
        </a>
      </li>
    </ul>
    <div v-append="`<script async src='${qqmapUrl}'></script>`" />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form v-if="!loading" ref="form" size="small" label-width="16.6666%" :rules="rules" :model="channel">
          <h5>基本信息</h5>
          <hr>

          <el-form-item label="类型" prop="type">
            <el-select v-model="channel.type" disabled placeholder="请选择">
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

          <el-form-item v-if="channel.type !== 'Channels::Level0'" label="所属上级" prop="parentId">
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

          <el-form-item label="名称" prop="name">
            <el-input v-model="channel.name" />
          </el-form-item>

          <el-form-item label="代码" required>
            <el-input v-model="channel.code" />
            <p class="help-block">默认自动生成，也可手动输入渠道代码</p>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input v-model="channel.contact" />
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="channel.phone" />
            <p class="help-block">可用于登录“商户助手小程序”，请务必填写真实手机号</p>
          </el-form-item>

          <el-form-item label="业务范围">
            <div>{{ regionScopeName.join(',') }}</div>
            <el-button type="success" size="medium" @click="region_scope.modal.show = true">设置渠道区域范围</el-button>
          </el-form-item>

          <el-form-item label="地区" class="el-address">
            <el-select v-model="channel.province" placeholder="省份" @change="changeProvince">
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select v-model="channel.city" placeholder="城市">
              <el-option
                v-for="item in city"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select v-model="channel.district" placeholder="区域">
              <el-option
                v-for="item in district"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="详细地址">
            <el-input v-model="channel.addr">
              <template slot="append">
                <el-button type="success" @click="searchAddrToMap">
                  搜索并标注
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="">
            <div id="qqmap" v-loading="mapLoading" />
          </el-form-item>

          <el-form-item label="经纬度" class="lon_lat">
            <div class="el-input-group">
              <el-input v-model="channel.lon" @input="initMarkerLayer" />
              <span class="input-group-addon">-</span>
              <el-input v-model="channel.lat" @input="initMarkerLayer" />
            </div>
            <!-- <p class="help-block">查询经纬度，<a href="https://lbs.qq.com/getPoint" target="_blank">点击这里</a></p> -->
          </el-form-item>

          <!-- <el-form-item label="地图">
            <div v-if="channel.lon && channel.lat" class="map">
              <img :src="map_picture(channel.lat, channel.lon)" style="border-radius: 10px;">
              <a :href="qq_map_url(channel.lat, channel.lon, channel.name, channel.addr)" class="btn map-btn" target="_blank">查看地图</a>
            </div>
            <div v-else> - </div>
          </el-form-item> -->

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
              <p class="help-block">{{ cfv.hint }}</p>
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
                :http-request="listenUploadImageLimit"
                :on-success="uploadSuccess"
              >
                <el-button type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">{{ cfv.hint }}</p>
            </el-form-item>
          </div>

          <el-form-item label="备注" style="margin-top: 5px">
            <el-input v-model="channel.note" type="textarea" />
          </el-form-item>

          <hr>
          <el-button v-if="$route.name === 'ChannelNew'" :loading="submitting" type="success" @click="submit('add')">
            创建渠道
          </el-button>
          <el-button v-if="$route.name === 'ChannelEdit'" :loading="submitting" type="success" @click="submit('edit')">
            保存
          </el-button>
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
  </div>
</template>
<script>
import channels from '@/api/channels'
import custom_form from '@/api/custom_form'
import region_api from '@/api/region'
import amazon from '@/api/amazon'
import { parent_channel_level } from '@/utils'
import { jsonp } from 'vue-jsonp'
window.initMap = function() {
  console.log(1)
}
function clearOverlays(overlays) {
  let overlay
  while (overlay = overlays.pop()) {
    overlay.setMap(null)
  }
}

export default {
  data() {
    return {
      mapLoading: true,
      loading: true,
      // 自定义表单
      custom_form: {},

      channelType: [],
      channel_parents_options: [],

      searchLoading: false,

      province: [],
      city: [],
      district: [],
      region: [],

      submitting: false,

      channel: {
        type: null,
        parentId: null,
        province: null,
        city: null,
        district: null,
        name: null,
        code: null,
        contact: null,
        addr: null,
        lon: null,
        lat: null,
        note: null,
        phone: null,
        customFieldValues: [],
        regionScopeCode: []
      },

      rules: {
        type: [
          { required: true, message: '类型为必填', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '所属上级为必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称为必填', trigger: 'blur' }
        ]
      },

      props: {
        label: 'name',
        children: 'children'
      },
      defaultCheckedRegion: [],

      result_region: [],
      regionScopeName: [],

      region_loading: false,

      region_scope: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      },

      map: null,
      markerLayer: null,
      qqmapUrl: `https://map.qq.com/api/js?v=2.exp&key=${process.env.VUE_APP_QQ_MAP}&callback=initMap`
    }
  },
  watch: {
    channel() {
      deep: true
    },
    'channel.province'() {
      this.getCity(this.channel.province)
    },
    'channel.city'() {
      this.getDistrict(this.channel.city)
    },
    'channel.lon'() {
      // this.initMarkerLayer()
    },
    'channel.lat'() {
      // this.initMarkerLayer()
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '渠道列表', path: { name: 'ChannelSearch' }}]
    if (this.$route.name === 'ChannelNew') {
      breadcrumb.push({ title: '新建渠道', path: { name: 'ChannelNew' }})
    }

    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.channel.type = this.$route.query.channel_type
    this.channel.parentId = this.$route.query.parent_id
    channels.type().then(response => {
      this.channelType = response.data.filter(t => t.key !== 'Channels::Level0')
    }).catch(() => {})
    channels.all({ typeIn: parent_channel_level(this.channel.type) }).then(response => {
      this.channel_parents_options = response.data
    })

    if (this.$route.name === 'ChannelEdit') {
      await channels.get(this.$route.params).then(response => {
        let channel = {}
        channel = {
          district: response.data.district,
          city: response.data.city,
          province: response.data.province,
          name: response.data.name,
          type: response.data.type,
          code: response.data.code,
          contact: response.data.contact,
          addr: response.data.addr,
          lon: response.data.lon,
          lat: response.data.lat,
          note: response.data.note,
          phone: response.data.phone,
          customFieldValues: response.data.customFieldValues,
          regionScopeCode: response.data.regionScopeCode,
          id: response.data.id
        }
        this.defaultCheckedRegion = response.data.regionScopeCode
        this.regionScopeName = response.data.regionScopeName || []
        if (response.data.parentChannel) {
          channel.parentId = response.data.parentChannel.id
        }
        this.channel = { ...channel }
        if (this.channel.type === 'Channels::Level0') {
          this.channelType.push({
            value: '总部',
            key: 'Channels::Level0'
          })
        }
      })

      breadcrumb.splice(1, 0, { title: this.channel.name })
      breadcrumb.push({ title: '编辑渠道', path: { name: 'ChannelEdit', query: { id: this.channel.id }}})
    }

    await custom_form.index({ type: `CustomForms::${this.channel.type.split('::')[1]}` }).then(response => {
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

    await this.getProvince()
    this.loading = false
    await region_api.tree().then(response => {
      this.region = response.data
    })
    this.initMap()
  },
  methods: {
    initMap() {
      this.mapLoading = true
      const center = new window.qq.maps.LatLng(39.984104, 116.307503)
      console.log(center)
      // 初始化地图
      this.map = new window.qq.maps.Map(document.getElementById('qqmap'), {
        rotation: 20, // 设置地图旋转角度
        pitch: 30, // 设置俯仰角度（0~45）
        zoom: 12, // 设置地图缩放级别
        center: center // 设置地图中心点坐标
      })
      if (!this.markerLayer) {
        this.markerLayer = new window.qq.maps.Marker({
          // 设置Marker的位置坐标
          position: center,
          // 设置显示Marker的地图
          map: this.map
        })
      }
      window.qq.maps.event.addListener(this.map, 'click',
        event => {
          this.channel.lon = event.latLng.getLng().toFixed(6)
          this.channel.lat = event.latLng.getLat().toFixed(6)
          if (!this.markerLayer) {
            this.markerLayer = new window.qq.maps.Marker({
              // 设置Marker的位置坐标
              position: center,
              // 设置显示Marker的地图
              map: this.map
            })
          }
          this.markerLayer.setPosition(event.latLng)
        }
      )
      // console.log(center)
      this.initMarkerLayer()

      setTimeout(() => {
        this.mapLoading = false
      }, 2000)
    },
    initMarkerLayer() {
      if (this.channel.lat && this.channel.lon) {
        this.map.setCenter(new window.qq.maps.LatLng(this.channel.lat, this.channel.lon))
        this.markerLayer.setPosition(new window.qq.maps.LatLng(this.channel.lat, this.channel.lon))
      }
    },

    customField(v) {
      return this.custom_form.customFields.find(f => f.id === v.value)
    },
    setCustomFieldValue(v) {
      return this.channel.customFieldValues.find(f => f.customField.id === v.id)
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
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase(), ...{ typeIn: parent_channel_level(this.channel.type) }}).then(response => {
            this.searchLoading = false
            this.channel_parents_options = response.data
          })
        }, 200)
      } else {
        this.channel_parents_options = []
      }
    },
    changeProvince() {
      this.channel.city = null
      this.channel.district = null
    },
    uploadSuccess(response) {
    },
    async submit(action) {
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
          channels[action](data).then(response => {
            this.submitting = false
            this.$router.push({ name: 'ChannelShow', params: { id: data.id || response.data.id }})
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
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
    async searchAddrToMap() {
      const arr = [this.channel.province, this.channel.city, this.channel.district].filter(element => {  
        return element !== null && element !== undefined && element !== ''
      })
      if (arr.length === 3) {
        const provinceName = this.province.find(item => item.id === this.channel.province)['name']
        const cityName = this.city.find(item => item.id === this.channel.city)['name']
        const districtName = this.district.find(item => item.id === this.channel.district)['name']
        const response = await jsonp(`https://apis.map.qq.com/ws/geocoder/v1/`, {
          address: `${provinceName}${cityName}${districtName}${this.channel.addr}`,
          key: process.env.VUE_APP_QQ_MAP,
          output: 'jsonp'
        })
        if (response.status === 0) {
          this.channel.lon = response.result.location.lng
          this.channel.lat = response.result.location.lat
          this.initMarkerLayer()
        } else {
          this.$message.error(response.message)
        }
      } else {
        this.$message.error('请填写地区')
      }
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
#qqmap {
  width: 100%;
  height: 300px;
}
</style>
