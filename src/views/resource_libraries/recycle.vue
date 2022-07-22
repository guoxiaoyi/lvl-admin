<template>
  <div class="app-container">
    <el-card>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选
      </el-checkbox>
      <el-button
        type="success"
        @click="deleteAll"
        :disabled="checkedImages.length === 0"
        style="margin-left: 20px">
        批量恢复
      </el-button>
    </el-card>
    <el-card>
      <div class="assets-list">
        <div class="item" v-for="(item, index) in crud.data" :key="index">
          <div class="item-content">
            <div class="thumb" :style="{backgroundImage: `url(${item.urls.small})`}"></div>
            <div class="item-info">
              <div class="flex">
                <el-checkbox-group
                  v-model="checkedImages"
                  @change="handleCheckedCitiesChange"
                  class="item-info"
                >
                  <el-checkbox :key="item.id" :label="item.imgName" />
                </el-checkbox-group>
                <div class="type">({{item.attachmentContentType | content_type}})</div>
              </div>
              <div class="flex">
                <span>{{item.width}} x {{item.height}}</span>
                <span>{{item.attachmentFileSize | content_size}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <pagination />
    </el-card>
  </div>
</template>

<script>
import crudImage from '@/api/image'
import CRUD, { presenter, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
export default {
  data() {
    return {
      isIndeterminate: true,
      checkAll: false,
      checkedImages: []
    }
  },
  components: { pagination },
  cruds() {
    return CRUD({ title: '素材库', url: '/lmp/admin/api/image/recycle', crudMethod: { ...crudImage }})
  },
  watch: {
    'crud.data'() {
      this.checkedImages = []
      this.isIndeterminate = true
      this.checkAll = false
    }
  },
  mixins: [presenter(), crud()],
  filters: {
    content_type(value) {
      return value.substring(value.lastIndexOf("/")+1).toUpperCase()
    },
    content_size(limit) {
      var size = "";
      if(limit < 0.1 * 1024){                         //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
      }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
        size = (limit/1024).toFixed(2) + "KB"
      }else if(limit < 0.1 * 1024 * 1024 * 1024){     //小于0.1GB，则转化成MB
        size = (limit/(1024 * 1024)).toFixed(2) + "MB"
      }else{                                          //其他转化成GB
        size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
      }

      var sizeStr = size + "";                        //转成字符串
      var index = sizeStr.indexOf(".");               //获取小数点处的索引
      var dou = sizeStr.substr(index + 1 ,2)          //获取小数点后两位的值
      if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size;
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedImages = val ? this.crud.data.map(item => item.imgName) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.crud.data.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.crud.data.length;
    },
    deleteAll() {
      this.$confirm('此操作将已选择图片恢复到素材库。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.checkedImages.map(obj => this.crud.data.find(item => item.imgName === obj).id)

        crudImage.restoreImages(ids).then(response => {
          this.crud.refresh()
          this.$message({
            message: '恢复成功',
            type: 'success'
          });
        })
      }).catch(() => {

      });
    }
  }
}
</script>

<style lang="scss" scoped>
.assets-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    flex: 1 0 0;
    min-width: 210px;
    flex-grow: 0;
    background: #FFFFFF;
    padding: 10px;
    .item-content {
      border: 1px solid #EEEEEE;
    }
    .thumb {
      width: 100%;
      padding-top: 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 10px;
    box-sizing: border-box;
    ::v-deep {
      .el-checkbox-group {
        width: calc(100% - 50px);
        text-overflow: ellipsis;
      }
      .el-checkbox {
        width: 100%;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
      }
      .el-checkbox__label {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        font-size: 13px;
        font-weight: 400;
        color: #333;
        padding-left: 5px;
      }
    }
    .type {
      width: 45px;
      text-align: right;
      font-size: 13px;
      font-weight: 400;
      color: #333;
    }
    &+.flex {
      margin-top: -6px;
      padding-top: 0px;
      padding-left: 29px;

      span {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>

