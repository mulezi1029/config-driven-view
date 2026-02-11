<template>
  <span class="content-component text-component" :style="cssStyles">
    {{ config.content }}
  </span>
</template>

<script>
import { toRef } from 'vue';
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'TextComponent',
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
