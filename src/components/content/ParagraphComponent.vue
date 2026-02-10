<template>
  <p class="content-component paragraph-component" :style="cssStyles">
    {{ config.content }}
  </p>
</template>

<script>
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'ParagraphComponent',
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
    
    return {
      cssStyles
    };
  }
};
</script>