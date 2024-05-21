<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员等级设置 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        搭建会员成长体系，保障会员活跃度
      </div>
      <div class="panel panel-default" style="border-left: none; border-right: none; margin-bottom: 0;">
        <el-table :data="list" class="data">
          <el-table-column label="等级" prop="" width="100">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="label" />
          <el-table-column label="会员权益" prop="vipInterests">
            <template slot-scope="scope">
              <p v-for="item in scope.row.vipInterests" :key="item.id + 'vip_intere'">{{ item.label }}</p>
            </template>
          </el-table-column>
          <el-table-column label="升级条件">
            <template slot-scope="scope">
              成长值达到{{ scope.row.upgradeXp }}
            </template>
          </el-table-column>
          <el-table-column label="降级规则">
            <template slot-scope="scope">
              <div v-if="scope.row.expiredKind === 'none' || scope.row.expiredKind === null">不降级</div>
              <div v-if="scope.row.expiredKind === 'by_month'">
                获得等级后 {{ scope.row.expiredMonth }}月后过期，如果期间用户的成长值未达到等级条件则降级。
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="checkPer(['vip_level_manage'])" type="text" @click="edit(scope.row)">编辑</el-button>
              <span style="margin: 0 4px;"><el-button type="text" @click="preview(scope.row)">预览</el-button></span>
              <div v-if="checkPer(['vip_level_manage'])" style="display: inline;">
                <el-button v-if="( !scope.row.isDefault && (scope.$index + 1) === list.length) || scope.row.upgradeXp === null" type="text" @click="del(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list.length < 6 && checkPer(['vip_level_manage'])" style="padding: 10px">
        <el-button type="success" @click="crud.show = true">添加等级</el-button>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="previewDialog.show"
      class="preview"
      width="620px"
    >
      <div class="flex">
        <div class="phone-frame">
          <iframe id="previewer" :src="previewDialog.url" />
          <div class="phone-home-btn" />
        </div>
        <div style="margin-left: 30px;">
          <VueQr :text="previewDialog.url" :size="120" margin="10" />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="crudCancel"
      :visible.sync="crud.show"
      :title="`${crud.action === 'add' ? '新建' : '修改'}等级`"
      width="660px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-form-item label="名称" prop="label">
          <el-input v-model="form.label" />
        </el-form-item>
        <el-form-item label="会员权益" prop="enabled">
          <el-select v-model="form.vipInterestIds" multiple>
            <el-option v-for="item in vip_interest_list" :key="item.id+ '_interest'" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="升级条件" prop="upgradeXp">
          <el-input v-model.number="form.upgradeXp">
            <template slot="prepend">成长值达到</template>
          </el-input>
          <div class="help-block">如成长值为空，则为固定等级，会员等级不升不降。</div>
        </el-form-item>
        <el-form-item label="降级规则" prop="expiredKind">
          <el-radio-group v-model="form.expiredKind" :disabled="crud.action === 'edit' && form.upgradeXp === null">
            <el-radio label="none">不降级</el-radio>
            <el-radio label="by_month">获得等级后按月过期，如果期间用户的成长值未达到等级条件则降级。</el-radio>
          </el-radio-group>
          <div v-if="form.expiredKind === 'by_month'" style="margin-top: 10px;">
            <el-input v-model.number="form.expiredMonth" :disabled="crud.action === 'edit' && form.upgradeXp === null">
              <template slot="append">月</template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status" type="primary" @click="submit">确认</el-button>
        <el-button @click="crudCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vip_level from '@/api/vip_level'
import vip_setting from '@/api/vip_setting'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
const defaultForm = {
  label: null,
  vipInterestIds: [],
  upgradeXp: null,
  expiredKind: 'none',
  expiredMonth: null
}

export default {
  components: {
    VueQr
  },
  data() {
    return {
      list: [],
      vip_interest_list: [],
      crud: {
        action: 'add',
        show: false,
        status: false
      },
      previewDialog: {
        show: false,
        url: null
      },
      form: Object.assign({}, defaultForm),
      rules: {
        label:
          { required: true, message: '名称不能为空', trigger: 'blur' }
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员等级设置' }
    ])
    vip_setting.vip_interest_list().then(response => {
      this.vip_interest_list = response.data
    })
    this.fetch()
  },
  methods: {
    fetch() {
      vip_level.list().then(response => {
        this.list = response.data
      })
    },
    del(data) {
      if (confirm('确定删除？')) {
        vip_level.del(data).then(response => {
          this.fetch()
        })
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.crud.status = true
          vip_level[this.crud.action](this.form).then(() => {
            this.crudCancel()
            this.fetch()
          }).catch(_error => {
            this.crud.status = false
          })
        } else {
          return false
        }
      })
    },
    edit(data) {
      this.crud.show = true
      this.crud.action = 'edit'
      data.expiredKind === null ? (data.expiredKind = 'none') : data.expiredKind
      data.vipInterestIds = data.vipInterests.map(item => item.id)
      this.form = Object.assign({}, data)
    },
    crudCancel() {
      this.crud.status = false
      this.crud.show = false
      this.crud.action = 'add'
      this.form = Object.assign({}, defaultForm)
    },
    preview(data) {
      this.previewDialog.show = true
      this.previewDialog.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/vips/demo?vip_level_id=${data.id}`
    },
    previewDialogClose() {
      this.previewDialog.show = false
      this.previewDialog.url = null
    }
  }
}
</script>

<style lang="scss" scoped>

.data p {
  margin-top: 0;
  margin-bottom: 0;
}
::v-deep {
  .preview {
    .el-dialog__header {
      border-bottom: none;
      .el-dialog__headerbtn .el-dialog__close {
        font-size: 30px;
        font-weight: bold;
        color: #FFF;
      }
    }
    .el-dialog__body {max-height: 100vh; overflow: hidden;}
    .el-dialog {
      margin-top: 10px !important;
      background: transparent;
      box-shadow: none;

    }
  }
  .el-input-group__prepend, .el-input-group__append {
    background: #EEE !important;
    border-color: #CCC !important;
    color: #555 !important;
  }
  .full {
    .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
  .join-activity{
    .el-input__inner {
      border-radius: 0;
    }
  }
  .el-radio-group .el-radio {
    line-height: 1.4;
  }
}
</style>
