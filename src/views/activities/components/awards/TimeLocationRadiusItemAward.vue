<template>
  <div>
    <ScheduleTimeAble />
    <el-form-item label="地点坐标">
      <div v-for="(addr, idx) in _award_form.form.radiusRules" :key="idx" class="flex form-flex">
        <div class="el-custom-input-group" style="margin-right: 5px;">
          <div class="flex-item" @click="openMap(idx)">
            <el-input v-model="addr.address" placeholder="点击选择地点坐标" readonly />
          </div>
          <div class="el-input-group-addon">半径范围</div>
          <el-form-item style="flex: 0 0 50px" :prop="'radiusRules.' + idx + '.radius'" :rules="radiusRules">
            <el-input v-model="addr.radius" />
          </el-form-item>
          <div class="el-input-group-addon">公里</div>
          <el-form-item style="flex: 0 0 50px" :prop="'radiusRules.' + idx + '.quantity'" :rules="quantityRules">
            <el-input v-model="addr.quantity" />
          </el-form-item>
          <div class="el-input-group-addon">份</div>
        </div>
        <el-button @click="remove(addr)">删除</el-button>
      </div>
      <p class="help-block">以选中地点为原点的中奖范围</p>
      <el-button type="success" @click="add">新增地点</el-button>
    </el-form-item>
    <CustomPercentage />
    <QQMap :show.sync="show" :lng="lng" :lat="lat" :radius="radius" @onSave="save" />
  </div>
</template>

<script>
import ScheduleTimeAble from './ScheduleTimeAble.vue'
import CustomPercentage from './CustomPercentage.vue'
import QQMap from './QQMap.vue'
export default {
  inject: ['_award_form'],
  components: {
    ScheduleTimeAble,
    CustomPercentage,
    QQMap
  },
  data() {
    return {
      show: false,
      lng: null,
      lat: null,
      radius: null,
      index: null,
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
      ],
      quantityRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        } }
      ]
    }
  },
  mounted() {
    if (this._award_form.action === 'add') {
      this._award_form.form.radiusRules = [{
        coord: '',
        radius: null,
        address: null,
        quantity: 0
      }]
    }
  },
  methods: {
    openMap(index) {
      this.index = index
      if (this._award_form.form.radiusRules[index]['coord']) {
        this.lat = this._award_form.form.radiusRules[index]['coord'].split(',')[0]
        this.lng = this._award_form.form.radiusRules[index]['coord'].split(',')[1]
      }
      this.radius = this._award_form.form.radiusRules[index]['radius']
      this.show = true
    },
    save(data) {
      this._award_form.form.radiusRules[this.index]['coord'] = `${data.lat},${data.lng}`
      this._award_form.form.radiusRules[this.index]['radius'] = data.radius
      this._award_form.form.radiusRules[this.index]['address'] = data.address
    },
    remove(item) {
      var index = this._award_form.form.radiusRules.indexOf(item)
      if (index !== -1) {
        this._award_form.form.radiusRules.splice(index, 1)
      }
    },
    add() {
      this._award_form.form.radiusRules.push({
        coord: '',
        radius: null,
        address: null,
        quantity: 0,
        key: Date.now()
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.form-flex {
  margin-bottom: 15px;
}
.el-custom-input-group {
  flex: 1;
}
::v-deep {
  .del {
    margin-left: 10px;
  }
}

</style>