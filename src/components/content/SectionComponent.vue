<template>
  <div class="content-component section-component">
    <div 
      class="section-header flex items-center cursor-pointer" 
      @click="toggleCollapse"
    >
      <span class="section-toggle mr-2">
        {{ isCollapsed ? '▶' : '▼' }}
      </span>
      <h2 v-if="config.title" class="section-title" :style="headingStyles">
        {{ config.title }}
      </h2>
    </div>
    <transition name="collapse">
      <div 
        v-show="!isCollapsed" 
        class="section-content collapse-transition"
        :style="{ maxHeight: isCollapsed ? '0' : '2000px' }"
      >
        <component-renderer
          v-for="(item, index) in config.children"
          :key="index"
          :config="item"
          :styles="styles"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useStyles } from '../../composables/useStyles';

const ComponentRenderer = defineAsyncComponent(() => import('./ComponentRenderer.vue'));

export default {
  name: 'SectionComponent',
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
    const isCollapsed = ref(false);
    
    const headingStyles = computed(() => {
      return props.styles.heading?.h2 || {};
    });
    
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };
    
    return {
      isCollapsed,
      headingStyles,
      toggleCollapse
    };
  }
};
</script>

<style scoped>
.section-header {
  user-select: none;
}

.section-toggle {
  font-size: 12px;
  color: #666;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>