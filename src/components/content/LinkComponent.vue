<template>
  <a 
    class="content-component link-component" 
    :href="config.href"
    :target="config.target || '_self'"
    :rel="config.rel || ''"
    :style="cssStyles"
  >
    {{ config.content }}
  </a>
</template>

<script>
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'LinkComponent',
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