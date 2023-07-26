<template>
  <div class="app-container">
    <tab :good-type="detail.type" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info">
          <h5>导入格式说明 <i class="fa fa-question-circle cursor" @click="help = !help" /> </h5>
          <div v-show="help" id="import_help" class="collapse">
            <p>一行一条卡密的兑换码。</p>
            <p>示例如下：</p>
            <pre>
1111111111
2222222222
3333333333 </pre>
            <p>兑换码可以是除了逗号之外的其他符号，如：</p>
            <pre>
1234-1234-1234-1234
1234 1234 1234 1234</pre>
          </div>

        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form" class="block-form">
          <el-form-item label="批量导入" class="form-item-tinymce">
            <el-input v-model="form.text" type="textarea" :rows="20" />
          </el-form-item>
          <el-form-item label="生效时间">
            <el-date-picker
              v-model="form.validatedAt"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :default-time="'00:00:00'"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="过期时间">
            <el-date-picker
              v-model="form.expiredAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="'23:59:59'"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" />
          </el-form-item>
          <hr>
          <el-button type="success" @click="submit">导入</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/goods_show'
import goods from '@/api/goods'
import store_goods from '@/api/store_goods'
export default {
  components: {
    tab
  },
  data() {
    return {
      help: false,
      detail: {},
      form: {
        expiredAt: '',
        note: '',
        text: '',
        validatedAt: ''
      },
      rules: {}
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'StoreGoodIndex' }}]
    await goods.show({ id: this.$route.params.goodsId }).then(response => {
      this.detail = response.data
      // breadcrumb.push({
      //   title: this.detail.name, path: { name: 'GoodsShow', params: this.$route.params.goodsId }
      // })
    })
    breadcrumb.push({
      title: '礼品详情'
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    // this.crud.refresh()
  },
  methods: {
    submit() {
      store_goods.add_coupon({ goodsId: this.$route.params.goodsId, ...this.form }).then(response => {
        this.$router.push({ name: 'GoodsCoupon', goodsId: this.$route.params.goodsId })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
  color: #da120e;
}
pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.428571429;
  word-break: break-all;
  word-wrap: break-word;
  color: #333333;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
