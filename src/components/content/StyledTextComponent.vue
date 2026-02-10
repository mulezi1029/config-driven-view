<template>
  <span class="content-component styled-text-component" :style="cssStyles">
    {{ config.content }}
  </span>
</template>

<script>
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'StyledTextComponent',
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