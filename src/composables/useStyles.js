import { computed } from 'vue';

export function useStyles(configItem, styles) {
  // 合并基础样式和自定义样式
  const mergedStyles = computed(() => {
    let baseStyles = {};
    
    // 应用类型基础样式
    if (styles[configItem.type]) {
      baseStyles = { ...baseStyles, ...styles[configItem.type] };
    }
    
    // 应用特定元素样式 (如 h1, h2)
    if (configItem.level && styles[configItem.type]?.[`h${configItem.level}`]) {
      baseStyles = { ...baseStyles, ...styles[configItem.type][`h${configItem.level}`] };
    }
    
    // 应用自定义样式
    if (configItem.style && styles.customStyles?.[configItem.style]) {
      baseStyles = { ...baseStyles, ...styles.customStyles[configItem.style] };
    }
    
    // 应用内联样式
    if (configItem.inlineStyles) {
      baseStyles = { ...baseStyles, ...configItem.inlineStyles };
    }
    
    return baseStyles;
  });

  console.log("🚀 ~ :31 ~ useStyles ~ mergedStyles:", mergedStyles.value);

  
  // 转换为CSS样式字符串
  const cssStyles = computed(() => {
    return Object.entries(mergedStyles.value)
      .map(([key, value]) => `${kebabCase(key)}: ${value}`)
      .join('; ');
  });

  console.log("🚀 ~ :41 ~ useStyles ~ cssStyles:", cssStyles.value);

  
  return {
    mergedStyles,
    cssStyles
  };
}

// 辅助函数: 驼峰转短横线命名
function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}