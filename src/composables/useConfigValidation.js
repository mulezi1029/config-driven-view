import { ref } from 'vue';

export function useConfigValidation() {
  const errors = ref([]);
  const warnings = ref([]);
  
  // 验证配置文件格式
  const validateConfig = (config) => {
    errors.value = [];
    warnings.value = [];
    
    // 检查必要字段
    if (!config) {
      errors.value.push('配置文件不能为空');
      return false;
    }
    
    if (!config.children || !Array.isArray(config.children)) {
      errors.value.push('配置文件必须包含children数组');
    }
    
    if (!config.version) {
      warnings.value.push('建议添加version字段');
    }
    
    // 验证内容结构
    validateContent(config.children);
    
    return errors.value.length === 0;
  };
  
  // 递归验证内容项
  const validateContent = (contentItems, path = 'children') => {
    if (!Array.isArray(contentItems)) return;
    
    contentItems.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      
      if (!item.type) {
        errors.value.push(`${itemPath} 缺少type字段`);
        return;
      }
      
      // 验证特定类型的必要字段
      switch (item.type) {
        case 'heading':
          if (!item.level || !item.content) {
            errors.value.push(`${itemPath} (heading) 缺少必要字段level或content`);
          }
          break;
        case 'paragraph':
        case 'richText':
          if (!item.content) {
            errors.value.push(`${itemPath} (${item.type}) 缺少content字段`);
          }
          break;
        case 'note':
          if (!item.children || !Array.isArray(item.children)) {
            errors.value.push(`${itemPath} (note) 缺少children数组`);
          } else if (item.children.length > 1) {
            errors.value.push(`${itemPath} (note) children最多1个元素`);
          } else if (item.children.length === 1) {
            validateContent(item.children, `${itemPath}.children`);
          }
          break;
        case 'list':
          if (!item.children || !Array.isArray(item.children)) {
            errors.value.push(`${itemPath} (list) 缺少children数组`);
          } else {
            validateContent(item.children, `${itemPath}.children`);
          }
          break;
        case 'table':
          if (!item.headers || !Array.isArray(item.headers)) {
            errors.value.push(`${itemPath} (table) 缺少headers数组`);
          }
          if (!item.children || !Array.isArray(item.children)) {
            errors.value.push(`${itemPath} (table) 缺少children数组`);
          } else {
            item.children.forEach((row, rowIdx) => {
              if (!row.type || row.type !== 'tableRow') {
                errors.value.push(`${itemPath}.children[${rowIdx}] 应为tableRow节点`);
              } else if (!row.children || !Array.isArray(row.children)) {
                errors.value.push(`${itemPath}.children[${rowIdx}] (tableRow) 缺少children数组`);
              } else {
                validateContent(row.children, `${itemPath}.children[${rowIdx}].children`);
              }
            });
          }
          break;
        case 'section':
          if (!item.children || !Array.isArray(item.children)) {
            errors.value.push(`${itemPath} (section) 缺少children数组`);
          } else {
            validateContent(item.children, `${itemPath}.children`);
          }
          break;
        case 'text':
          if (item.content === undefined || item.content === null) {
            errors.value.push(`${itemPath} (text) 缺少content字段`);
          }
          break;
        case 'tableRow':
          if (!item.children || !Array.isArray(item.children)) {
            errors.value.push(`${itemPath} (tableRow) 缺少children数组`);
          } else {
            validateContent(item.children, `${itemPath}.children`);
          }
          break;
        case 'image':
          if (!item.src) {
            errors.value.push(`${itemPath} (image) 缺少src字段`);
          }
          break;
        case 'link':
          if (!item.href || !item.content) {
            errors.value.push(`${itemPath} (link) 缺少必要字段href或content`);
          }
          break;
        case 'styledText':
          if (!item.content) {
            errors.value.push(`${itemPath} (styledText) 缺少content字段`);
          }
          break;
      }
    });
  };
  
  return {
    errors,
    warnings,
    validateConfig
  };
}