<template>
  <div class="content-component image-component" :style="cssStyles">
    <img 
      :src="config.src" 
      :alt="config.alt || ''" 
      :width="config.width" 
      :height="config.height"
      class="image"
    />
    <p v-if="config.caption" class="image-caption" :style="captionStyles">
      {{ config.caption }}
    </p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { toRef } from 'vue';
import { useStyles } from '../../composables/useStyles';

export default {
  name: 'ImageComponent',
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

    console.log("🚀 ~ :35 ~ cssStyles:", cssStyles.value);

    
    const captionStyles = computed(() => {
      return props.styles.imageCaption || {};
    });
    
    return {
      cssStyles,
      captionStyles
    };
  }
};
</script>