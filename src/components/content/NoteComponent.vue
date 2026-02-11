<template>
  <div class="content-component note-component" :style="cssStyles">
    <div v-if="config.icon" class="note-icon mr-2">
      {{ config.icon }}
    </div>
    <div class="note-content">
      <component-renderer
        v-if="config.children?.length > 0"
        :config="config.children[0]"
        :styles="styles"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { toRef } from 'vue';
import { useStyles } from '../../composables/useStyles';

const ComponentRenderer = defineAsyncComponent(() => import('./ComponentRenderer.vue'));

export default {
  name: 'NoteComponent',
  components: {
    ComponentRenderer
  },
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

<style scoped>
.note-component {
  display: flex;
  align-items: flex-start;
}

.note-icon {
  font-size: 18px;
  line-height: 1;
}
</style>