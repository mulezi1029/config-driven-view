// 配置文件解析工具

// 加载配置文件
export const loadConfig = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`无法加载配置文件: ${filePath}`);
    }
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('加载配置文件失败:', error);
    throw error;
  }
};

// 保存配置文件（在实际应用中，这可能需要后端API支持）
export const saveConfig = async (config, filePath) => {
  // 模拟保存操作
  console.log('保存配置文件:', filePath, config);
  
  // 在实际应用中，这里应该发送API请求到后端
  // const response = await fetch(filePath, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(config),
  // });
  
  // return response.ok;
  
  // 模拟成功响应
  return true;
};

// 格式化配置文件为JSON字符串
export const formatConfig = (config) => {
  return JSON.stringify(config, null, 2);
};

// 解析JSON字符串为配置对象
export const parseConfig = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解析配置文件失败:', error);
    throw new Error(`无效的JSON格式: ${error.message}`);
  }
};

// 使用 public 目录路径，构建后会复制到 dist，部署后可访问；BASE_URL 适配 GitHub Pages 等子路径部署
const getExamplesBase = () => `${import.meta.env.BASE_URL}config/examples/`;

// 获取示例配置文件列表
export const getExampleConfigs = async () => {
  const base = getExamplesBase();
  return [
    {
      id: 'user-agreement',
      name: '用户服务协议',
      path: `${base}user-agreement.json`
    },
    {
      id: 'privacy-policy',
      name: '隐私政策',
      path: `${base}privacy-policy.json`
    },
    {
      id: 'tax-rules',
      name: '扣税规则',
      path: `${base}tax-rules.json`
    }
  ];
};