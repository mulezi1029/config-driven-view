<template>
  <p class="content-component paragraph-component" :style="cssStyles">
    {{ config.content }}
  </p>
</template>

<script>
import { toRef } from 'vue';
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
    const { cssStyles } = useStyles(toRef(props, 'config'), toRef(props, 'styles'));
    
    return {
      cssStyles
    };
  }
};
</script>