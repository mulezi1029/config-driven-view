<template>
  <hr class="content-component divider-component" :style="cssStyles" />
</template>

<script>
import { toRef } from 'vue';
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
    const { cssStyles } = useStyles(toRef(props, 'config'), toRef(props, 'styles'));
    
    return {
      cssStyles
    };
  }
};
</script>