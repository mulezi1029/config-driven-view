<template>
  <div class="component-renderer">
    <component
      v-if="comp"
      :is="comp"
      :config="config"
      :styles="styles"
    />
    <div v-else class="error-message">
      未知组件类型: {{ config.type }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { componentMap } from './componentMap';

export default {
  name: 'ComponentRenderer',
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
    const comp= computed(() => {
      return componentMap[props.config.type];
    });

    console.log("🚀 ~ :36 ~ comp:", comp.value)
    
    return {
      comp
    };
  }
};
</script>

<style scoped>
.error-message {
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  border-left: 4px solid #e74c3c;
}
</style>