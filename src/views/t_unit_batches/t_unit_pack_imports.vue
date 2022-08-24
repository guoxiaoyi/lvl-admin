<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 导入关联（追溯码） </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div v-if="submited" class="packing">
          <div class="packing-info">
            <div class="progress">
              <div
                class="progress-bar progress-bar-success progress-bar-striped active"
                role="progressbar"
                aria-valuenow="45"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 100%"
              />
            </div>
            <p>任务进行中</p>
            <span>当前任务结束后才可以继续导入</span>
          </div>
        </div>
        <el-form v-else ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item v-if="result.unitSpec" label="产品套码规格">
            {{ result.unitSpec.product.name }}
            {{ result.unitSpec.specLabel }}
          </el-form-item>
          <el-form-item label="生产批次 *">
            {{ result.code }}
          </el-form-item>
          <el-form-item label="上传文件">
            <el-upload
              ref="upload"
              action="#"
              :file-list="fileList"
              :limit="1"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="help-block">
              <p>文件内需根据套码规格录入数据，例如 1箱X2盒 则需要第一列数据为一级码，第二列数据为二级码 <br>文件格式: csv </p>
            </div>

          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">开始导入</el-button>
        </el-form>
      </div>
    </div>
    <div class="panel panel-default table-responsive">
      <TotalPage />
      <el-table :data="crud.data" :loading="crud.loading">
        <el-table-column prop="createdAt" label="时间" />
        <el-table-column prop="fileFileName" label="文件" />
        <el-table-column prop="fileFileSize" label="大小" />
        <el-table-column prop="stateName" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 'failed' || scope.row.state === 'completed'" type="info" effect="dark">
              {{ scope.row.stateName }}
            </el-tag>
            <el-tag v-else type="danger" effect="dark">
              {{ scope.row.stateName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="failedMsg" label="失败原因" min-width="300px" />
      </el-table>
      <pagination />
    </div>
  </div>
</template>
<script>
import t_unit_batches from '@/api/t_unit_batches'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const id = this.parent.$route.params.id
    return CRUD({ title: '生产批次', url: `/lmp/admin/api/t_unit_batch/${id}/t_unit_pack_imports` })
  },

  data() {
    return {
      rules: {},
      form: {},
      result: { },
      fileList: [],
      submitting: false,
      submited: false
    }
  },
  async mounted() {
    const breadcrumb = [
      { title: '生产批次列表', path: { name: 'TUnitBatchesIndex' }}
    ]
    await t_unit_batches.show(this.$route.params).then(response => {
      this.result = response.data
      breadcrumb.push({ title: this.result.code, path: { name: 'TUnitBatchesShow', params: { id: this.result.id }}})
    })
    breadcrumb.push({ title: '导入关联（追溯码）' })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
    t_unit_batches.can_pack_imports().then(response => {
      this.submited = !response.data.state
    })
  },
  methods: {
    async submit() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error('请选择上传文件')
        return
      }
      this.submitting = true
      this.submited = true
      const formData = new FormData()
      this.$refs.upload.uploadFiles.forEach(f => {
        formData.append('file', f.raw, f.name)
      })

      await t_unit_batches.t_unit_pack_imports(this.result.id, formData).then(response => {
        this.submitting = false
        this.crud.refresh()
        this.$refs.upload.clearFiles()
      }).catch(() => {
        this.submitting = false
        this.submited = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep {
  .el-upload {
    text-align: left;
    &__text p{
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
.packing {
  .packing-info {
    margin: 20px auto;
    width: 320px;
    text-align: center;

    p {
      padding-top: 10px;
      font-size: 30px;
    }

    span {
      font-size: 20px;
    }
  }
}
.progress {
    overflow: hidden;
    height: 20px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
    box-shadow:inset 0 1px 2px rgba(0, 0, 0, 0.1)
}

.progress-bar {
    float: left;
    width: 0%;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #F34541;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    transition:width 0.6s ease
}

.progress-striped .progress-bar, .progress-bar-striped {
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size:40px 40px
}

.progress.active .progress-bar, .progress-bar.active {
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    animation:progress-bar-stripes 2s linear infinite
}

.progress-bar-success {
    background-color:#5cb85c
}

.progress-striped .progress-bar-success {
    background-image:linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)
}

.progress-bar-info {
    background-color:#5bc0de
}

.progress-striped .progress-bar-info {
    background-image:linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)
}

.progress-bar-warning {
    background-color:#f0ad4e
}

.progress-striped .progress-bar-warning {
    background-image:linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)
}

.progress-bar-danger {
    background-color:#d9534f
}

.progress-striped .progress-bar-danger {
    background-image:linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)
}
@-webkit-keyframes progress-bar-stripes {
    from {
        background-position:40px 0
    }

    to {
        background-position:0 0
    }
}

@keyframes progress-bar-stripes {
    from {
        background-position:40px 0
    }

    to {
        background-position:0 0
    }
}
</style>
