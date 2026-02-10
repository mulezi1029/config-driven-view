<template>
  <table class="content-component table-component" :style="cssStyles">
    <thead v-if="config.headers">
      <tr>
        <th
          v-for="(header, index) in config.headers"
          :key="index"
          class="table-header"
          :style="getHeaderCellStyle(index)"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in config.rows" :key="rowIndex">
        <td
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          class="table-cell"
          :style="getBodyCellStyle(rowIndex, cellIndex, row)"
        >
          <component-renderer
            v-if="isCellObject(cell)"
            :config="cell"
            :styles="styles"
          />
          <template v-else>{{ cell }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue';
import { useStyles } from '../../composables/useStyles';

const ComponentRenderer = defineAsyncComponent(() => import('./ComponentRenderer.vue'));

export default {
  name: 'TableComponent',
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

    const tableRadius = computed(() => {
      return props.styles?.table?.borderRadius || '8px';
    });

    const headerStyles = computed(() => {
      return props.styles.tableHeader || {};
    });

    const cellStyles = computed(() => {
      return props.styles.tableCell || {};
    });

    const BORDER_KEYS = ['border', 'borderTop', 'borderLeft', 'borderRight', 'borderBottom'];

    const borderValue = computed(() => {
      return headerStyles.value.border || cellStyles.value.border || '1px solid #ddd';
    });

    function baseWithoutBorder(styleObj) {
      const out = { ...styleObj };
      BORDER_KEYS.forEach((k) => delete out[k]);
      return out;
    }

    const getHeaderCellStyle = (index) => {
      const base = baseWithoutBorder(headerStyles.value);
      const alignments = props.config.columnAlignments;
      const radius = tableRadius.value;
      const headerCount = props.config.headers?.length ?? 0;
      const border = borderValue.value;
      const cellBorder = {
        borderTop: border,
        borderRight: border,
        borderBottom: border
      };
      if (index === 0) {
        cellBorder.borderLeft = border;
        cellBorder.borderTopLeftRadius = radius;
      }
      if (headerCount > 0 && index === headerCount - 1) {
        cellBorder.borderTopRightRadius = radius;
      }
      if (alignments && alignments[index]) {
        cellBorder.textAlign = alignments[index];
      }
      return { ...base, ...cellBorder };
    };

    const getBodyCellStyle = (rowIndex, cellIndex, row) => {
      const base = baseWithoutBorder(cellStyles.value);
      const alignments = props.config.columnAlignments;
      const radius = tableRadius.value;
      const rowCount = props.config.rows?.length ?? 0;
      const isLastRow = rowCount > 0 && rowIndex === rowCount - 1;
      const colCount = row?.length ?? 0;
      const border = borderValue.value;
      const cellBorder = {
        borderRight: border,
        borderBottom: border
      };
      if (cellIndex === 0) {
        cellBorder.borderLeft = border;
      }
      if (isLastRow && cellIndex === 0) {
        cellBorder.borderBottomLeftRadius = radius;
      }
      if (isLastRow && colCount > 0 && cellIndex === colCount - 1) {
        cellBorder.borderBottomRightRadius = radius;
      }
      if (alignments && alignments[cellIndex]) {
        cellBorder.textAlign = alignments[cellIndex];
      }
      return { ...base, ...cellBorder };
    };

    const isCellObject = (cell) => {
      return cell && typeof cell === 'object' && cell.type;
    };

    return {
      cssStyles,
      tableRadius,
      headerStyles,
      cellStyles,
      getHeaderCellStyle,
      getBodyCellStyle,
      isCellObject
    };
  }
};
</script>