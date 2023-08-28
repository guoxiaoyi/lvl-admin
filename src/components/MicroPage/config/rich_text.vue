<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :mode="mode"
    />
    <Editor
      v-model="values.data.html"
      :default-config="editorConfig"
      style="height: 300px; overflow-y: hidden;"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  components: { Editor, Toolbar },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editor: null,
      toolbarConfig: {
        toolbarKeys: [
          'fontSize',
          'fontFamily', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'bgColor', // 背景颜色
          'numberedList', // 有序列表
          'bulletedList', // 无序列表
          'insertTable' // 表格
        ]
      },
      html: null,
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'simple' // or 'simple'
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    }
  }
}
</script>
