<template>
  <tr>
    <td
      v-for="(cell, cellIndex) in config.children"
      :key="cellIndex"
      class="table-cell"
      :style="getCellStyle(cellIndex)"
    >
      <component-renderer
        :config="cell"
        :styles="styles"
      />
    </td>
  </tr>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const ComponentRenderer = defineAsyncComponent(() => import('./ComponentRenderer.vue'));

export default {
  name: 'TableRowComponent',
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
    },
    rowIndex: {
      type: Number,
      required: true
    },
    getBodyCellStyle: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const getCellStyle = (cellIndex) => {
      return props.getBodyCellStyle(props.rowIndex, cellIndex, props.config);
    };

    return {
      getCellStyle
    };
  }
};
</script>
