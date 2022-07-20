<template>
<div class="app-container">
  <ul class="nav nav-tabs page-tabs">
    <li class="active"> <a href="javascript:void(0)">选择类型</a> </li>
  </ul>
  <div class="panel panel-default">
    <div class="panel-body">
      <div role="alert" class="alert alert-info"> 
        渠道设置中可进行渠道名称设置更改，点击<router-link :to="{name: 'ChannelLabelSetting'}" target="_blank">【渠道类型设置】</router-link>进入渠道类型设置页面，进行渠道别名设置修改。
      </div>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in channel_types" :key="index">
            <div class="channel-new-list text-center">
              <router-link :to="{name: 'ChannelNew', query: {parent_id: parent_id, channel_type: item.key}}">
                <img :src="channel_images.find( m => m.key === item.key).url">
                <h4>{{item.value}}</h4>
                <p>{{type_hint[item.key]}}</p>
              </router-link>
            </div>
          </el-col>
        </el-row>
    </div>
  </div>
</div>
</template>

<script>
import channels from "@/api/channels";
export default {
  data() {
    return {
      type_hint: {
        'Channels::Level1': '如：总代、大区、总经销',
        'Channels::Level2': '如：一级代理、经销商',
        'Channels::Level3': "如：二级代理、分销商",
        'Channels::TerminalShop': '如：门店、店铺、旗舰店'
      },

      current_type: "<%= params[:channel_type] %>",
      channel_types: [],
      channel_images: [
        {key: "Channels::Level1", url: require('@/assets/channel/channel_list_level1.png')},
        {key: "Channels::Level2", url: require('@/assets/channel/channel_list_level2.png')},
        {key: "Channels::Level3", url: require('@/assets/channel/channel_list_level3.png')},
        {key: "Channels::TerminalShop", url: require('@/assets/channel/channel_list_terminal_shop.png')},
      ],
      parent_id: null
    }
  },
  async mounted(){
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{title: '渠道管理', path: {name: 'ChannelSearch'}}, {title: '选择类型', path: {name: 'ChannelListNew'}}])
    this.parent_id = this.$route.query.parent_id || null
    this.current_type = this.$route.query.channel_type || '',

    channels.type().then(response =>{
      let channel_types = response.data.filter(t => t.key !== 'Channels::Level0')
      const keys = channel_types.map(k => k.key)
      this.channel_types = this.current_type === '' ? channel_types : channel_types.slice(keys.indexOf(this.current_type) + 1)
    })

    if(!this.parent_id) {
      channels.all({type: 'Channels::Level0'}).then(response => {
        this.parent_id = response.data[0]['id']
      })
    }
  },
}
</script>

<style lang="scss" scoped>

.channel-new-list {
  padding-bottom: 15px;
  margin-bottom: 15px;
  font-weight: normal;
  border: 1px solid #ddd;
  border-radius: 6px;

  &:hover {
    background-color: #eee;
  }

  img{
    width: 100px;
    margin-top: 20px;
  }

  h4{
    font-size: 16px;
    line-height: 25px;
    color: #333;
  }
  p{
    color: #999;
  }
}
</style>>

</style>