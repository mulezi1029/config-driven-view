import { ref, reactive, readonly } from 'vue';

export function useVersionControl(initialConfig) {
  const currentVersion = ref(initialConfig.version || '1.0.0');
  const versionHistory = reactive([
    {
      version: currentVersion.value,
      timestamp: new Date().toISOString(),
      config: JSON.parse(JSON.stringify(initialConfig))
    }
  ]);
  
  // 保存当前版本
  const saveVersion = (config, version) => {
    const newVersion = version || incrementVersion(currentVersion.value);
    currentVersion.value = newVersion;
    
    versionHistory.push({
      version: newVersion,
      timestamp: new Date().toISOString(),
      config: JSON.parse(JSON.stringify(config))
    });
    
    return newVersion;
  };
  
  // 回滚到指定版本
  const rollbackToVersion = (version) => {
    const versionData = versionHistory.find(v => v.version === version);
    if (versionData) {
      currentVersion.value = version;
      return JSON.parse(JSON.stringify(versionData.config));
    }
    return null;
  };
  
  // 获取所有版本历史
  const getHistory = () => {
    return [...versionHistory].reverse();
  };
  
  // 版本号自增
  const incrementVersion = (version) => {
    const parts = version.split('.');
    parts[2] = String(parseInt(parts[2] || 0) + 1);
    return parts.join('.');
  };
  
  return {
    currentVersion,
    versionHistory: readonly(versionHistory),
    saveVersion,
    rollbackToVersion,
    getHistory
  };
}