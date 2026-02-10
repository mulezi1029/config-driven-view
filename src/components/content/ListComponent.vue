<template>
  <component
    :is="config.style === 'ordered' ? 'ol' : 'ul'"
    class="content-component list-component"
    :style="cssStyles"
  >
    <li
      v-for="(item, index) in config.items"
      :key="index"
      class="list-item"
      :style="listItemStyles"
    >
      <component-renderer
        v-if="typeof item === 'object'"
        :config="item"
        :styles="styles"
      />
      <template v-else>
        {{ item }}
      </template>
    </li>
  </component>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue';
import { useStyles } from '../../composables/useStyles';

const ComponentRenderer = defineAsyncComponent(() => import('./ComponentRenderer.vue'));

export default {
  name: 'ListComponent',
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
    
    const listItemStyles = computed(() => {
      return props.styles.listItem || {};
    });
    
    return {
      cssStyles,
      listItemStyles
    };
  }
};
</script>