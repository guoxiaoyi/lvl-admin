<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="show" class="mapMask">
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
              <el-input v-model="d_radius" @input="changeRadius">
                <template slot="append">公里</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="save">确认</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="show" id="mapContainer" />
      </div>
    </transition>
    <iframe
      v-if="show"
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
  props: {
    show: {
      type: Boolean,
      default: false
    },
    radius: {
      type: String,
      default: ''
    },
    lat: {
      type: String,
      default: null
    },
    lng: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      mapContainer: null,
      city: '全国',
      value: '',
      key: process.env.VUE_APP_QQ_MAP,
      markers: [],
      circles: [],
      d_lat: null,
      d_lng: null,
      d_radius: null
    }
  },
  mounted() {
    this.loadScript()
    window.addEventListener('message', this.setLatLng)
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
    setLatLng(e) {
      if (e.data) {
        this.city = e.data.city
        if (this.radius) {
          this.d_radius = this.radius
        }
        if (this.lat && this.lng) {
          this.d_lat = this.lat
          this.d_lng = this.lng
          this.drawMap(this.lat, this.lng)
        } else {
          this.d_lat = e.data.lat
          this.d_lng = e.data.lng
          this.drawMap(this.d_lat, this.d_lng)
        }
      }
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
              this.d_lat = event.latLng.getLat()
              this.d_lng = event.latLng.getLng()
              this.drawRadius(event.latLng.getLat(), event.latLng.getLng())
            }
          )
        }, 1000)
      })
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
      const { lat, lng } = item.location
      this.d_lat = lat
      this.d_lng = lng
      const center = new window.qq.maps.LatLng(lat, lng)
      this.mapContainer.setCenter(center)
      this.drawRadius(lat, lng)
    },
    changeRadius() {
      this.drawRadius(this.d_lat, this.d_lng)
    },
    drawRadius(lat, lon) {
      clearOverlays(this.markers)
      clearOverlays(this.circles)
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
      var radius = parseFloat(this.d_radius)
      isNaN(radius) && (radius = 0)
      window.circle.setRadius(radius * 1000)
      this.markers.push(marker)
      this.circles.push(window.circle)
      this.getAddress()
    },
    getAddress() {
      map_api.address_lat_lon({ latitude: this.d_lat, longitude: this.d_lng }).then(({ data }) => {
        this.value = data
      })
    },
    save() {
      this.$emit('onSave', { lat: this.d_lat, lng: this.d_lng, radius: this.d_radius, address: this.value })
      this.cancel()
    },
    cancel() {
      if (this.mapContainer) {
        this.d_lat = null
        this.d_lng = null
        this.d_radius = null
        this.mapContainer = null
        this.value = ''
      }
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
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
.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.addr {
  font-size: 12px;
  color: #b4b4b4;
}
.form {
  width: 565px;
  position: absolute;
  z-index: 5;
  top: 27px;
}
#mapContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
::v-deep {
  .form .el-form-item__content {
    width: 100%;
  }
  .el-autocomplete {
    display: block;
  }
}
</style>
