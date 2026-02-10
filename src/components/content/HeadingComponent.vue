<template>
  <component
    :is="`h${config.level}`"
    class="content-component heading-component"
    :style="cssStyles"
  >
    {{ config.content }}
  </component>
</template>

<script>
import { computed } from 'vue';
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'HeadingComponent',
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