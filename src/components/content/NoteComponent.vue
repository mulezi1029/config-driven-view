<template>
  <div class="content-component note-component" :style="cssStyles">
    <div v-if="config.icon" class="note-icon mr-2">
      {{ config.icon }}
    </div>
    <div class="note-content">
      <component-renderer
        v-if="typeof config.content === 'object'"
        :config="config.content"
        :styles="styles"
      />
      <template v-else>
        {{ config.content }}
      </template>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
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
    const { cssStyles } = useStyles(props.config, props.styles);
    
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