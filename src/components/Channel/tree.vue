<template>
  <div>
    <table class="table table-bordered table-hover" id="table-jsTree">
      <thead>
        <tr>
          <th>名称</th>
          <th>代码</th>
          <th>类型</th>
          <th>所在地</th>
          <th>管理员</th>
          <th>添加时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in content" :key="item.key" data-level="0" data-disabled="true" :data-id="item.id" data-parent="0">
          <td>
            <div style="padding-left:0px">
              <span v-if="item.hasChild" true class="fa fa-plus-square-o" style="margin-right: 10px;" />
              <router-link :to="{name: 'ChannelShow', params: {id: item.id}}">{{item.name}}</router-link>
              <i class="fa fa-spinner fa-spin hidden" />
            </div>
          </td>
          <td>{{item.code}}</td>
          <td>{{item.typeName}}</td>
          <td style="width: 150px">
            <div class="citys"> {{item.provinceName}} {{item.cityName}} {{item.districtName}}</div>
          </td>
          <td>{{item.manager}}</td>

          <td>{{item.createdAt}}</td>
          <td>
            <div v-if="item.type !== 'Channels::TerminalShop'" style="display: inline">
              <router-link :to="{name: 'ChannelListNew', query: {channel_type: item.type, parent_id: item.id}}">
                新建子渠道
              </router-link>
              -
            </div>
            <router-link :to="{name: 'ChannelShow', params: {id: item.id}}">
              查看
            </router-link>

            <div v-if="!item.hasChild" style="display: inline">
              -
              <el-button type="text" @click="crud.doDelete(item)">删除</el-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import channels from "@/api/channels";
import $ from 'jquery'

export default {
  data() {
    return {
      searchLoading: false,
      content: []
    }
  },
  async activated() {

  },
  async mounted() {
    let _this = this
    channels.type().then(response => {
      this.channelType = response.data.filter(t => t.key !== 'Channels::Level0')
    })
    await channels.index({type: 'Channels::Level0'}).then(response => {
      this.content = response.data.content
    })

    this.$nextTick(() => {
      if($("#table-jsTree tbody tr").eq(0).find('span').hasClass("fa-plus-square-o")) {
        $("#table-jsTree tbody tr").eq(0).find('span').trigger('click')
      }
    })

    $('#table-jsTree').on('click', 'tr td span', function(event) {
      event.preventDefault();
      var disabled = $(this).closest('tr').data('disabled')
      var node = $(this).closest('tr')
      var level = parseInt(node.data('level'))
      $(this).toggleClass('fa-plus-square-o fa-minus-square-o');
      var loading = $(this).parent().find('.fa.fa-spinner')
      if ($(this).hasClass('fa-minus-square-o')) {
        if (disabled) {
          loading.removeClass('hidden');

          channels.index({parentId: node.data('id'), size: 25, sort: 'createdAt,desc'}).then(res => {
            res.current_page = 0
            _this.channel_callback(res, node, level, "plus")
            loading.addClass('hidden')
          }).catch(() => {
            loading.addClass('hidden')
          })
        }else{
          _this.eachTree(node.data('id'), 'show')
        }
        node.data('disabled', false)
      }else{
        _this.eachTree(node.data('id'), 'hide')
      }
    })

    $('#table-jsTree').on('click', 'tr td a.delete', function(event) {
      var that = $(this)
      var node = {id: that.closest('tr').data('id')}
     if (confirm("您确定要删除吗？")) {
        channels.del(node).then(() => {
          that.closest('tr').remove()
          _this.$message.success('删除成功')
        })
     }
      // _this.$confirm(`确定删除本条数据吗？`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
       
      // }).catch(()=>{})

    });

    $('#table-jsTree').on('click', 'tr td a.create_channel', function() {
      var that = $(this)
      var node = $(this).data('item')
      _this.$router.push({name: 'ChannelListNew', query: {parent_id: that.closest('tr').data('id'), channel_type: node} })
    });

    $('#table-jsTree').on('click', 'tr td a.show_channel', function() {
      var that = $(this)
      _this.$router.push({name: 'ChannelShow', params: {id: that.closest('tr').data('id')}})
    });

    $('#table-jsTree').on('click', 'tr td.more', function(event) {
      var that = $(this)
      var node = that.closest('tr')
      var level = parseInt(node.data('level'))

      let is_disabled = parseInt(node.data('disabled-more'))
      if(is_disabled === 0){
        node.data('disabled-more', 1)
        node.find('.fa-spinner').removeClass('hidden')
        node.find('a').attr('disabled','true')
        let page = Math.floor(that.closest('tr').data('page')) + 1
        channels.index({parentId: that.closest('tr').data('parent'), size: 25, sort: 'createdAt,desc', page: page}).then(res => {
          that.closest('tr').data('page', page)
          _this.channel_callback(res, node, level-1, "more")
          node.data('disabled-more', 0);
          node.find('.fa-spinner').addClass('hidden')
          node.find('a').removeAttr('disabled');
          page === (Math.floor(node.data('total-pages')) - 1) ?
            node.remove() : node.data('page', res.data.current_page)
        })
      }
    });

  },
  methods: {
    eachTree(target, render) {
      $('#table-jsTree tbody tr').each((index, el) => {
      if ($(el).data('parent') == target){
        switch(render){
          case 'show':
            $(el).show();
            if (!$(el).data('disabled')) {
              $(el).find('span.fa').removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
            }
            break;
          case 'hide':
            $(el).hide().find('span.fa').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
            break;
        }

        this.eachTree($(el).data('id'), render)
      }
    });
    },
    channel_callback(res, node, level, _type) {
      var data_tr = '';
      var parent_id = (_type === 'more' ? node.data('parent') : node.data('id'))
      
      for (var i = res.data.content.length - 1; i >= 0; i--) {
        data_tr += this.createTr(res.data.content[i], {level: level+1, parent: parent_id, id: res.data.content[i].id })
      }

      if(res.data.totalPages > 1 && _type != 'more'){
        data_tr += '<tr data-level='+(level+1)+' data-disabled-more="0" data-page="'+res.current_page+'" data-total-pages='+res.data.totalPages+' data-parent='+node.data('id')+'>\
                      <td colspan="7" style="padding-left:'+((level+1)*30+10)+'px" class="more">\
                        <a href="javascript:void(0)" class="btn btn-default">\
                          <i class="fa fa-plus" aria-hidden="true"></i>\
                          点击加载更多<i class="fa fa-spinner fa-spin hidden"></i></a>\
                      </td>\
                    </tr>'
      }

      _type === 'more' && node.before(data_tr)
      _type === 'plus' && node.after(data_tr)
    },

    createTr(obj, params) {
      var r = '<tr data-level="' + params.level + '" data-disabled="true" data-id="' + params.id + '" data-parent="' + params.parent + '">\
          <td>\
            <div style="padding-left:' + params.level * 30 + 'px"> \
              <span ' + obj.hasChild + ' class="fa fa-plus-square-o"  style="margin-right: 10px;"></span>\
              <a class="show_channel">'+ obj.name + '</a>\
              <i class="fa fa-spinner fa-spin hidden"></i>\
            </div>\
          </td>\
          <td width="100"><div class="text-nowrap">' + obj.code + '</div></td>\
          <td width="150"><div class="text-nowrap">' + obj.typeName + '</div></td>\
          <td><div class="citys">' + obj.provinceName + obj.cityName + obj.districtName + '</div></td>\
          <td width="160"><div class="text-nowrap">' + (obj.manager || '-') + '</div></td>\
          <td width="160"><div class="text-nowrap">' + obj.createdAt + '</div></td>\
          <td width="200"><div class="text-nowrap">'
      if (obj.type != 'Channels::TerminalShop')
        r += '<a class="create_channel" data-item='+obj.type+'>新建子渠道</a>\
            '+ (obj.destroy_enable && obj.create_child_enable ? '- ' : '' )+' - '
      

      r += '<a class="show_channel">详情</a>\
            '+ ( obj.hasChild ? '' : '- <a class="delete" data-item='+JSON.stringify(obj)+'>删除</a>' ) +'\
        </div></td>\
      </tr>';

      return r
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .hidden {
    display: none !important;
  }
  #table-jsTree{
    tr span{cursor: pointer; }
    tr span[true], tr td a[true]{display: inline; }
    tr span[false], tr td a[false]{display: none; }
    .table > tbody + tbody{
      border: 1px solid #ddd;
    }
  }
  .btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.428571429;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
    &:hover{
      color: #333;
      background-color: #e6e6e6;
      border-color: #adadad;
    }
  }
  .table {
    margin-bottom: 0px;
    th {
      border-top: none !important;
    }
    
  }
}
</style>
