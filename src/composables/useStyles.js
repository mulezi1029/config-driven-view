import { computed, isRef } from 'vue';

/**
 * @param {import('vue').Ref|Object} configItemRef - 配置项，传 ref 时随 props 更新会触发样式重算
 * @param {import('vue').Ref|Object} stylesRef - 样式配置，传 ref 时随 props 更新会触发样式重算
 */
export function useStyles(configItemRef, stylesRef) {
  const configItem = isRef(configItemRef) ? configItemRef : { value: configItemRef };
  const styles = isRef(stylesRef) ? stylesRef : { value: stylesRef };

  // 合并基础样式和自定义样式（依赖 ref 以便 props.styles 更新后重算）
  const mergedStyles = computed(() => {
    const item = configItem.value;
    const s = styles.value || {};
    let baseStyles = {};
    // heading 等按 level 取子对象，避免把 { h1, h2 } 当样式键展开
    if (item.level && s[item.type]?.[`h${item.level}`]) {
      baseStyles = { ...baseStyles, ...s[item.type][`h${item.level}`] };
    } else if (s[item.type] && typeof s[item.type] === 'object' && !hasNestedLevelKeys(s[item.type])) {
      baseStyles = { ...baseStyles, ...s[item.type] };
    }
    if (item.style && s.customStyles?.[item.style]) {
      baseStyles = { ...baseStyles, ...s.customStyles[item.style] };
    }
    if (item.inlineStyles) {
      baseStyles = { ...baseStyles, ...item.inlineStyles };
    }
    return baseStyles;
  });

  // 转换为CSS样式字符串（仅展平值为字符串或数字的项）
  const cssStyles = computed(() => {
    return Object.entries(mergedStyles.value)
      .filter(([, value]) => value != null && typeof value !== 'object')
      .map(([key, value]) => `${kebabCase(key)}: ${value}`)
      .join('; ');
  });

  
  return {
    mergedStyles,
    cssStyles
  };
}

function hasNestedLevelKeys(obj) {
  return Object.keys(obj).some((k) => /^h\d+$/.test(k));
}

// 辅助函数: 驼峰转短横线命名
function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}