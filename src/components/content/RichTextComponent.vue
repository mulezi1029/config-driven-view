<template>
  <div 
    class="content-component rich-text-component" 
    :style="cssStyles"
    v-html="sanitizedContent"
  ></div>
</template>

<script>
import { computed } from 'vue';
import { useStyles } from '../../composables/useStyles';
import DOMPurify from 'dompurify';

export default {
  name: 'RichTextComponent',
  props: {
    config: {
      type: Object,
      required: true
    },
    styles: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { cssStyles } = useStyles(props.config, props.styles);
    
    const sanitizedContent = computed(() => {
      // 使用DOMPurify净化HTML内容，防止XSS攻击
      return DOMPurify.sanitize(props.config.content);
    });
    
    return {
      cssStyles,
      sanitizedContent
    };
  }
};
</script>