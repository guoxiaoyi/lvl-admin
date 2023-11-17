<template>
  <div>
    <el-form-item label="地点坐标">
      <div v-for="(addr, index) in _award_form.form.addrs" :key="index" class="flex form-flex">
        <div class="el-custom-input-group">
          <el-form-item style="flex: 0 0 320px;" :prop="'addrs.' + index + '.coord'">
            <div @click="map(index)">
              <el-input v-model="addr.address" placeholder="点击选择地点坐标" readonly />
            </div>
          </el-form-item>
          <div class="el-input-group-addon">半径范围</div>
          <el-form-item :prop="'addrs.' + index + '.radius'" :rules="radiusRules">
            <el-input v-model="addr.radius" placeholder="例如1.5" />
          </el-form-item>
          <div class="el-input-group-addon">公里</div>
        </div>
        <el-button v-if="num > 0" class="del" :disabled="index === 0" @click="remove(addr)">删除</el-button>
      </div>

      <p class="help-block" style="margin-top: 15px; margin-bottom: 5px;">以选中地点为原点的中奖范围</p>
      <el-button v-if="num > 0 && _award_form.form.addrs.length < 3" type="success" @click="add">新增地点</el-button>
    </el-form-item>
    <transition name="el-fade-in-linear">
      <div v-show="showMap" class="mapMask">
        <div style="display: flex; align-items: center;">
          <span class="el-icon-loading" style="font-size: 18px; margin-right: 5px;" />地图加载中
        </div>
        <div v-if="mapContainer" class="form">
          <el-form inline>
            <el-form-item style="width: 260px;">
              <el-autocomplete
                v-model="value"
                popper-class="autocomplete"
                value-key="title"
                :fetch-suggestions="remoteMethod"
                placeholder="请输入内容"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.title }}</div>
                  <span class="addr">{{ item.address }}</span>
                </template>

              </el-autocomplete>
            </el-form-item>
            <el-form-item style="width: 120px;">
              <el-input v-model="radius" @input="changeRadius">
                <template slot="append">公里</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="save">确认</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="showMap" id="mapContainer" />
      </div>
    </transition>
    <iframe
      v-if="showMap"
      id="geoPage"
      width="0"
      height="0"
      frameborder="0"
      style="display:none;"
      scrolling="no"
      :src="`https://apis.map.qq.com/tools/geolocation?key=${key}&referer=myapp`"
    />
  </div>
</template>

<script>
import { jsonp } from 'vue-jsonp'
import map_api from '@/api/map.js'

window.initMap = function() {}
function clearOverlays(overlays) {
  let overlay
  while (overlay = overlays.pop()) {
    overlay.setMap(null)
  }
}

export default {
  inject: ['_award_form'],
  props: {
    num: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      showMap: false,
      loading: false,
      markers: [],
      circles: [],
      options: [],
      value: '',
      radius: null,
      mapContainer: null,
      key: process.env.VUE_APP_QQ_MAP,
      city: '全国',
      lng: null,
      lat: null,
      select: null,
      radiusRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (isNaN(value)) {
            callback(new Error('必须是数字'))
          } else if (Number(value) < 0) {
            callback(new Error('必须大于或等于0'))
          } else {
            callback()
          }
        } }
      ]
    }
  },
  mounted() {
    if (this._award_form.action === 'add') {
      this._award_form.form.addrs = [{
        coord: null,
        radius: null,
        address: ''
      }]
    }
    this._award_form.form.addrs.forEach(async element => {
      if (element.coord) {
        await map_api.address_lat_lon({ latitude: element.coord.split(',')[0], longitude: element.coord.split(',')[1] }).then(({ data }) => {
          element.address = data
        })
        this.$forceUpdate()
      }
    })

    this.loadScript()
  },
  destroyed() {
    document.getElementById('qqmap').remove()
    if (this.mapContainer) {
      this.mapContainer = null
    }
  },
  methods: {
    loadScript() {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = 'qqmap'
      script.async = true
      script.src = `https://map.qq.com/api/js?v=2.exp&key=${process.env.VUE_APP_QQ_MAP}&libraries=drawing,geometry,autocomplete,convertor,place&callback=initMap`
      document.head.appendChild(script)
    },
    remoteMethod(query, cb) {
      if (query.length >= 1) {
        jsonp(`https://apis.map.qq.com/ws/place/v1/search`, {
          key: process.env.VUE_APP_QQ_MAP,
          keyword: encodeURI(query),
          boundary: `region(${this.city},1)`,
          output: 'jsonp'
        }).then(({ status, data, message }) => {
          if (status === 0) {
            cb(data)
          } else {
            this.$message.error(message)
          }
        })
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      clearOverlays(this.markers)
      clearOverlays(this.circles)
      const { lat, lng } = item.location
      this.lat = lat
      this.lng = lng
      const center = new window.qq.maps.LatLng(lat, lng)
      this.mapContainer.setCenter(center)
      this.drawRadius(lat, lng)
    },
    setLatLng(e) {
      if (e.data) {
        this.lat = e.data.lat
        this.lng = e.data.lng
        this.city = e.data.city
        this.drawMap(this.lat, this.lng)
      }
    },
    map(index) {
      this.showMap = true
      this.select = index
      if (this._award_form.form.addrs[index]['coord']) {
        window.removeEventListener('message', this.setLatLng, false)
        this.lat = parseFloat(this._award_form.form.addrs[index]['coord'].split(',')[0])
        this.lng = parseFloat(this._award_form.form.addrs[index]['coord'].split(',')[1])
        this.radius = parseFloat(this._award_form.form.addrs[index]['radius']) || null
        this.drawMap(this.lat, this.lng)
      } else {
        window.addEventListener('message', this.setLatLng)
      }
    },
    add() {
      this._award_form.form.addrs.push({
        coord: '',
        radius: null,
        address: '',
        key: Date.now()
      })
    },
    remove(item) {
      var index = this._award_form.form.addrs.indexOf(item)
      if (index !== -1) {
        this._award_form.form.addrs.splice(index, 1)
      }
    },
    save() {
      this._award_form.form.addrs[this.select]['coord'] = `${this.lat},${this.lng}`
      this._award_form.form.addrs[this.select]['radius'] = this.radius
      this._award_form.form.addrs[this.select]['address'] = this.value
      this.showMap = false
      this.lat = null
      this.lng = null
      this.radius = null
      this.mapContainer = null
      this.value = ''
      if (this.$refs.coord) {
        this.$refs.coord.clearValidate()
      }
    },
    cancel() {
      if (this.mapContainer) {
        this.lat = null
        this.lng = null
        this.radius = null
        this.mapContainer = null
        this.value = ''
      }
      this.showMap = false
    },
    drawMap(lat, lon) {
      const center = new window.qq.maps.LatLng(lat, lon)

      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.mapContainer) {
            this.mapContainer = new window.qq.maps.Map(document.getElementById('mapContainer'), {
              center,
              zoom: 15,
              mapTypeIds: false
            })
          }
          this.drawRadius(lat, lon)
          window.qq.maps.event.addListener(this.mapContainer, 'click',
            event => {
              event.stop()
              clearOverlays(this.markers)
              clearOverlays(this.circles)
              this.lat = event.latLng.getLat()
              this.lng = event.latLng.getLng()
              this.drawRadius(event.latLng.getLat(), event.latLng.getLng())
            }
          )
        }, 1000)
      })
    },
    drawRadius(lat, lon) {
      var center = new window.qq.maps.LatLng(lat, lon)
      var marker = new window.qq.maps.Marker({
        // 设置Marker的位置坐标
        position: center,
        // 设置显示Marker的地图
        map: this.mapContainer
      })
      var circle_color = new window.qq.maps.Color(0, 0, 0, 0.3)
      window.circle = new window.qq.maps.Circle({
        map: this.mapContainer,
        center,
        fillColor: circle_color,
        strokeWeight: 1
      })
      var radius = parseFloat(this.radius)
      isNaN(radius) && (radius = 0)
      window.circle.setRadius(radius * 1000)
      this.markers.push(marker)
      this.circles.push(window.circle)
      this.getAddress()
    },
    changeRadius() {
      clearOverlays(this.markers)
      clearOverlays(this.circles)
      this.drawRadius(this.lat, this.lng)
    },
    setKeywordData() {

    },
    getAddress() {
      map_api.address_lat_lon({ latitude: this.lat, longitude: this.lng }).then(({ data }) => {
        this.value = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-custom-input-group {
  flex: 1;
}
.form-flex {
  &+.form-flex {
    margin-top: 15px;
  }
}
#mapContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.mapMask {
  width: 101%;
  height: 100%;
  z-index: 2;
  left: 0;
  position: absolute;
  top: 0;
  background: #FFF;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  width: 565px;
  position: absolute;
  z-index: 5;
  top: 27px;
}
::v-deep {
  .del {
    margin-left: 10px;
  }
  .form .el-form-item__content {
    width: 100%;
  }
  .el-autocomplete {
    display: block;
  }
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.addr {
  font-size: 12px;
  color: #b4b4b4;
}

</style>
