import { ref, reactive, readonly } from 'vue';

/**
 * 为单份配置创建版本状态（当前版本号、历史列表、保存/回滚方法）
 * @param {Object} initialConfig - 初始配置对象
 * @returns {Object} 版本状态与方法
 */
function createVersionState(initialConfig) {
  const currentVersion = ref(initialConfig?.version || '1.0.0');
  const versionHistory = reactive([
    {
      version: currentVersion.value,
      timestamp: new Date().toISOString(),
      config: JSON.parse(JSON.stringify(initialConfig || {}))
    }
  ]);

  const incrementVersion = (version) => {
    const parts = String(version || '1.0.0').split('.');
    parts[2] = String(parseInt(parts[2] || 0, 10) + 1);
    return parts.join('.');
  };

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

  const rollbackToVersion = (version) => {
    const versionData = versionHistory.find((v) => v.version === version);
    if (versionData) {
      currentVersion.value = version;
      return JSON.parse(JSON.stringify(versionData.config));
    }
    return null;
  };

  const getHistory = () => [...versionHistory].reverse();

  return {
    currentVersion,
    versionHistory: readonly(versionHistory),
    saveVersion,
    rollbackToVersion,
    getHistory
  };
}

/**
 * 按配置文件维度的版本控制仓库：每个 configKey 对应独立版本历史
 * @returns {Object} getOrCreateVersionState(configKey, initialConfig)
 */
export function useVersionControlStore() {
  const byKey = reactive({});

  /**
   * 获取或创建指定配置的版本状态
   * @param {string} configKey - 配置标识（如示例 id、'default'）
   * @param {Object} initialConfig - 该配置的初始/当前内容，仅在建新条目时使用
   * @returns {Object} 该配置的版本状态（currentVersion, versionHistory, saveVersion, rollbackToVersion, getHistory）
   */
  const getOrCreateVersionState = (configKey, initialConfig) => {
    const key = configKey || 'default';
    if (!byKey[key]) {
      byKey[key] = createVersionState(initialConfig);
    }
    return byKey[key];
  };

  return {
    getOrCreateVersionState,
    byKey
  };
}

/**
 * 单份配置的版本控制（兼容原有用法，内部复用 createVersionState）
 * @param {Object} initialConfig - 初始配置
 */
export function useVersionControl(initialConfig) {
  return createVersionState(initialConfig);
}
