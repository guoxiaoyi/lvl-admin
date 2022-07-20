<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <a href="javascript:void(0)">员工审核</a> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form v-if="!loading" size="small" ref="form" label-width="16.6666%" :rules="rules" :model="user">

          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name" disabled></el-input>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="user.phone" disabled></el-input>
          </el-form-item>


          <el-form-item v-for="item in get_custom_fields" :key="item.value" :label="find_custom_field(item.value)['label']">
            <div class="el-input el-input--small is-disabled">

              <input v-if="find_custom_field(item.value)['c_kind'] !== 'picture'" :value="find_custom_field(item.value)['c_value']" type="text" autocomplete="off" class="el-input__inner" disabled>
              <a v-else :href="find_custom_field(item.value)['c_value']" target='_blank' class="activity_forms_image_a">
                <img :src="find_custom_field(item.value)['c_value']" width="70">
              </a>
            </div>
          </el-form-item>

          <el-form-item label="权限">
            <el-checkbox-group v-model="form.permissions">
              <el-checkbox
                v-for="(item, index) in permissions"
                :key="index + 'item.key'"
                :label="item.key"
                name="permissions">
                {{item.value}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <hr />
          <el-button type="success" @click="submit" :loading="submitting" size="small"> 保存并通过</el-button>
          <el-button type="danger" size="small" @click="reject.modal.show = true"> 驳回</el-button>

        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="reject.modal.show"
      title="填写驳回理由" width="600px">
        <el-input type="textarea" v-model="rejectReason" :rows="5" placeholder="填写驳回理由" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="reject.button.status" @click="submit_reject">确认</el-button>
        <el-button @click="cancel_reject">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import worker_register from "@/api/worker_register"
import account from '@/api/account'
import custom_form from "@/api/custom_form"

export default {
  data(){
    return {
      loading: false,

      // 自定义表单
      custom_form: {

      },

      user: {},
      rules: {
        parentId: [
          { required: true, message: '所属上级为必填', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '名称为必填', trigger: 'blur' },
        ]
      },

      form: {
        permissions: []
      },

      permissions: [],

      submitting: false,
      reject_submitting: false,

      rejectReason: '',

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

  async mounted(){
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      {title: '员工审核列表', path: {name: 'RegisterChannelWorkers'}},
      {title: '员工审核', path: {name: 'RegisterChannelWorkersEdit', params: {id: this.$route.params.id}}}
    ])

    worker_register.show(this.$route.params).then(response => {
      this.user = response.data
    })

    account.permissions().then(response => {
      this.permissions = response.data
    })

    custom_form.index({type: `CustomForms::ChannelWorker`}).then(response => {
      this.custom_form = response.data
    })
  },
  computed: {
    get_custom_fields () {
      const cfv = this.custom_form.fieldsList ?
        this.custom_form.fieldsList.filter(f => f.type === 'custom') : []
      return cfv
    }
  },
  methods: {
    find_custom_field(id) {
      const values = {}
      if(this.user.customFieldValues) {
        const ucfv = this.user.customFieldValues.find(_ucfv => _ucfv.customFieldId === id)
        if(ucfv) {
          values.c_kind = ucfv.customField.kind

          if(ucfv.customField.kind === 'select') {
            values.c_value = ucfv.value
          }
          if(ucfv.customField.kind === 'string') {
            values.c_value = ucfv.value
          }
          if(ucfv.customField.kind === 'citizenid') {
            values.c_value = ucfv.value
          }
          if(ucfv.customField.kind === 'checkboxes') {
            values.c_value = ucfv.valueList
          }

          if(ucfv.customField.kind === 'picture') {
            values.c_value = ucfv.pictureUrl
          }

        } else {
          values.c_kind = 'string'
          values.c_value = null
        }
      }
      return {...this.custom_form.customFields.find(cfv => cfv.id === id), ...values}
    },

    submit () {
      this.submitting = true
      worker_register.audit({...this.$route.params, state: 'enabled', permission: this.form.permissions}).then(response =>{
        this.submitting = false
        this.$router.push({name: 'RegisterChannelWorkers'})
      }).catch(() => {
        this.submitting = false
      })
    },
    submit_reject() {
      this.reject.button.status = true
      worker_register.audit({state: 'rejected', rejectReason: this.rejectReason, id: this.$route.params.id}).then(response => {
        this.$router.push({name: 'RegisterChannelWorkers'})
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
