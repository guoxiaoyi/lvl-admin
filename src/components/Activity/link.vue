<script>
export default {
  name: 'ActivityLink',
  functional: true, // 使用 functional 组件
  props: {
    to: {
      type: Object,
      default: () => { return {} },
      required: true
    },
    title: {
      type: String,
      default: '查看详情' // 当没有 slot 时的默认文本
    },
    customStyle: {
      type: Object,
      default: () => {}
    },
    target: {
      type: String,
      default: '_self' // 默认是当前窗口
    }
  },
  render(h, { props, slots, parent }) {
    let routeName = ''
    // 根据 activityType 动态生成路由路径
    const activityType = props.to.type || parent.$store.getters.activityData.type
    if (activityType === 'AntiFakeActivity') {
      routeName = 'Anti' + props.to.name
    } else {
      routeName = props.to.name ? props.to.name : 'ActivityShow'
    }
    // 优先使用 slot 内容，如果 slot 不存在，则使用 props.title
    const slotContent = slots().default ? slots().default : props.title
    console.log(props.target)
    return h(
      'router-link',
      {
        style: props.customStyle,
        props: {
          to: { name: routeName, params: { activityId: props.to.params.activityId }}
        },
        target: props.target // 添加 target 属性
      },
      slotContent // 使用 slot 或 props 传递的文本
    )
  }
}
</script>
