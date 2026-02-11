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
      <table-row-component
        v-for="(row, rowIndex) in config.children"
        :key="rowIndex"
        :config="row"
        :styles="styles"
        :row-index="rowIndex"
        :get-body-cell-style="getBodyCellStyle"
      />
    </tbody>
  </table>
</template>

<script>
import { computed } from 'vue';
import { toRef } from 'vue';
import { useStyles } from '../../composables/useStyles';
import TableRowComponent from './TableRowComponent.vue';

export default {
  name: 'TableComponent',
  components: {
    TableRowComponent
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
      const rowCount = props.config.children?.length ?? 0;
      const isLastRow = rowCount > 0 && rowIndex === rowCount - 1;
      const colCount = row?.children?.length ?? 0;
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

    return {
      cssStyles,
      tableRadius,
      headerStyles,
      cellStyles,
      getHeaderCellStyle,
      getBodyCellStyle
    };
  }
};
</script>