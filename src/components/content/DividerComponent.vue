<template>
  <hr class="content-component divider-component" :style="cssStyles" />
</template>

<script>
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'DividerComponent',
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