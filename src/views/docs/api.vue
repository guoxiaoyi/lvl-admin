<template>
  <div>
    <vue-markdown :source="markdownContent" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },
  data() {
    return {
      markdownContent: '',
    };
  },
  mounted() {
    this.loadMarkdownFile();
  },
  methods: {
    async loadMarkdownFile() {
      try {
        const markdownFile = require('./api.md')
        this.markdownContent = markdownFile.default || markdownFile;
      } catch (error) {
        console.error('Error loading Markdown file', error);
      }
    },
  },
};
</script>
