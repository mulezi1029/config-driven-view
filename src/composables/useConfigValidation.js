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
    
    if (!config.content || !Array.isArray(config.content)) {
      errors.value.push('配置文件必须包含content数组');
    }
    
    if (!config.version) {
      warnings.value.push('建议添加version字段');
    }
    
    // 验证内容结构
    validateContent(config.content);
    
    return errors.value.length === 0;
  };
  
  // 递归验证内容项
  const validateContent = (contentItems, path = 'content') => {
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
        case 'note':
          if (!item.content) {
            errors.value.push(`${itemPath} (${item.type}) 缺少content字段`);
          }
          break;
        case 'list':
          if (!item.items || !Array.isArray(item.items)) {
            errors.value.push(`${itemPath} (list) 缺少items数组`);
          }
          break;
        case 'table':
          if (!item.headers || !Array.isArray(item.headers)) {
            errors.value.push(`${itemPath} (table) 缺少headers数组`);
          }
          if (!item.rows || !Array.isArray(item.rows)) {
            errors.value.push(`${itemPath} (table) 缺少rows数组`);
          }
          break;
        case 'section':
          if (!item.content || !Array.isArray(item.content)) {
            errors.value.push(`${itemPath} (section) 缺少content数组`);
          } else {
            // 递归验证section内容
            validateContent(item.content, `${itemPath}.content`);
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