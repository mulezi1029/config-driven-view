<template>
  <div class="editor-layout h-full flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-blue-600">配置驱动视图编辑器</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="dropdown relative" v-if="exampleConfigs.length > 0">
            <button 
              class="btn btn-secondary flex items-center"
              @click="toggleDropdown"
            >
              加载示例
              <span class="ml-2">▼</span>
            </button>
            <div 
              class="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
              v-show="dropdownOpen"
              @click.outside="dropdownOpen = false"
            >
              <div 
                v-for="example in exampleConfigs" 
                :key="example.id"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="loadExample(example)"
              >
                {{ example.name }}
              </div>
            </div>
          </div>
          <button 
            class="btn btn-primary"
            @click="exportConfig"
          >
            导出配置
          </button>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="flex-1 flex overflow-hidden">
      <!-- 左侧配置编辑区 -->
      <div class="w-1/2 border-r border-gray-200 flex flex-col">
        <div class="flex-1 p-4 overflow-auto">
          <config-editor
            :key="currentConfigKey"
            v-model="config"
            @save="saveConfig"
            @reset="resetConfig"
          />
        </div>
      </div>
      
      <!-- 右侧预览区与版本控制 -->
      <div class="w-1/2 flex flex-col">
        <div class="flex-1 p-4 overflow-auto">
          <preview-panel :key="currentConfigKey" :config="config" />
        </div>
        <div class="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
          <version-control
            v-if="activeVersionState"
            :current-version="currentVersionDisplay"
            :version-history="versionHistoryDisplay"
            @save-version="onSaveVersion"
            @rollback-version="onRollbackVersion"
          />
        </div>
      </div>
    </main>
    
    <!-- 底部状态栏 -->
    <footer class="bg-white border-t border-gray-200 py-2 px-4 text-sm text-gray-600">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <span v-if="saveStatus" :class="saveStatus.success ? 'text-green-600' : 'text-red-600'">
            {{ saveStatus.message }}
          </span>
        </div>
        <div>
          <span v-if="currentConfigKey">{{ currentConfigName }} · </span>
          版本: {{ currentVersionDisplay }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ConfigEditor from '../components/common/ConfigEditor.vue';
import PreviewPanel from '../components/common/PreviewPanel.vue';
import VersionControl from '../components/common/VersionControl.vue';
import { loadConfig, saveConfig as saveConfigUtil, getExampleConfigs } from '../utils/configParser';
import { useVersionControlStore } from '../composables/useVersionControl';

export default {
  name: 'EditorLayout',
  components: {
    ConfigEditor,
    PreviewPanel,
    VersionControl
  },
  setup() {
    // 配置数据（使用 ref 以便切换示例时整体替换引用，强制编辑器和预览更新）
    const config = ref({
      version: '1.0.0',
      metadata: {
        title: '未命名文档',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: 'Unknown'
      },
      styles: {
        global: {
          fontFamily: 'Arial, sans-serif',
          color: '#333333'
        },
        heading: {
          h1: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px'
          },
          h2: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '15px'
          }
        },
        paragraph: {
          marginBottom: '15px',
          lineHeight: '1.6'
        },
        customStyles: {
          highlight: {
            backgroundColor: '#ffffcc',
            padding: '2px 4px'
          },
          warning: {
            color: '#e74c3c',
            fontWeight: 'bold'
          }
        }
      },
      content: [
        {
          type: 'heading',
          level: 1,
          content: '欢迎使用配置驱动视图编辑器'
        },
        {
          type: 'paragraph',
          content: '这是一个示例文档，您可以在左侧编辑器中修改配置，右侧将实时显示预览效果。'
        },
        {
          type: 'section',
          title: '功能介绍',
          content: [
            {
              type: 'paragraph',
              content: '本编辑器支持以下功能：'
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                '配置驱动的视图渲染',
                '支持嵌套结构的内容展示',
                '支持富文本、列表、表格等多种内容格式',
                '实时预览配置变更效果',
                '版本控制与回滚机制'
              ]
            }
          ]
        }
      ]
    });
    
    // 保存状态
    const saveStatus = ref(null);
    
    // 示例配置列表
    const exampleConfigs = ref([]);
    const dropdownOpen = ref(false);

    // 按配置文件维度的版本控制：当前配置 key、对应版本状态
    const DEFAULT_CONFIG_KEY = 'default';
    const currentConfigKey = ref(DEFAULT_CONFIG_KEY);
    const versionStore = useVersionControlStore();
    const activeVersionState = ref(null);

    const currentVersionDisplay = computed(() => {
      const state = activeVersionState.value;
      return state?.currentVersion?.value ?? config.value?.version ?? '1.0.0';
    });
    const versionHistoryDisplay = computed(() => {
      return activeVersionState.value?.getHistory() ?? [];
    });
    const currentConfigName = computed(() => {
      if (currentConfigKey.value === DEFAULT_CONFIG_KEY) return '未命名';
      const ex = exampleConfigs.value.find((e) => e.id === currentConfigKey.value);
      return ex?.name ?? currentConfigKey.value;
    });

    
    // 加载示例配置
    const loadExampleConfigs = async () => {
      try {
        exampleConfigs.value = await getExampleConfigs();
      } catch (error) {
        console.error('加载示例配置失败:', error);
      }
    };
    
    // 加载示例：整体替换 config 引用，确保编辑器和预览都切换到新数据
    const loadExample = async (example) => {
      try {
        const loadedConfig = await loadConfig(example.path);
        currentConfigKey.value = example.id;
        activeVersionState.value = versionStore.getOrCreateVersionState(example.id, loadedConfig);
        config.value = JSON.parse(JSON.stringify(loadedConfig));
        dropdownOpen.value = false;
      } catch (error) {
        console.error('加载示例失败:', error);
        saveStatus.value = {
          success: false,
          message: `加载示例失败: ${error.message}`
        };
        setTimeout(() => {
          saveStatus.value = null;
        }, 3000);
      }
    };
    
    // 保存配置（newConfig 为编辑器 save 事件传来的当前内容，先写回 config 以触发预览重渲染，再持久化）
    const saveConfig = async (newConfig) => {
      try {
        if (newConfig) {
          config.value = JSON.parse(JSON.stringify(newConfig));
        }
        const success = await saveConfigUtil(config.value);
        if (success) {
          activeVersionState.value?.saveVersion(config.value);
          saveStatus.value = {
            success: true,
            message: '配置保存成功'
          };
        } else {
          throw new Error('保存失败');
        }
      } catch (error) {
        console.error('保存配置失败:', error);
        saveStatus.value = {
          success: false,
          message: `保存失败: ${error.message}`
        };
      }
      setTimeout(() => {
        saveStatus.value = null;
      }, 3000);
    };
    
    // 重置配置：恢复到当前配置文件最近一次保存的版本
    const resetConfig = () => {
      if (confirm('确定要重置配置吗？当前未保存的更改将会丢失。')) {
        const history = activeVersionState.value?.getHistory();
        const latest = history?.[0];
        if (latest?.config) {
          config.value = JSON.parse(JSON.stringify(latest.config));
        }
      }
    };

    // 版本控制：保存新版本（由 VersionControl 触发）
    const onSaveVersion = (customVersion) => {
      const newVersion = activeVersionState.value?.saveVersion(config.value, customVersion || null);
      if (newVersion) {
        saveStatus.value = { success: true, message: `已保存为版本 ${newVersion}` };
        setTimeout(() => { saveStatus.value = null; }, 2000);
      }
    };

    // 版本控制：回滚到指定版本
    const onRollbackVersion = (version) => {
      const rolled = activeVersionState.value?.rollbackToVersion(version);
      if (rolled) {
        config.value = JSON.parse(JSON.stringify(rolled));
      }
    };
    
    // 导出配置
    const exportConfig = () => {
      const dataStr = JSON.stringify(config.value, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `config-${config.value?.metadata?.title || 'document'}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    };
    
    // 切换下拉菜单
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };
    
    // 组件挂载时加载示例配置，并初始化默认配置的版本状态
    onMounted(() => {
      loadExampleConfigs();
      activeVersionState.value = versionStore.getOrCreateVersionState(DEFAULT_CONFIG_KEY, config.value);
    });

    return {
      config,
      saveStatus,
      exampleConfigs,
      dropdownOpen,
      currentConfigKey,
      activeVersionState,
      currentVersionDisplay,
      versionHistoryDisplay,
      currentConfigName,
      loadExample,
      saveConfig,
      resetConfig,
      exportConfig,
      toggleDropdown,
      onSaveVersion,
      onRollbackVersion
    };
  }
};
</script>

<style scoped>
.editor-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.dropdown-menu {
  min-width: 160px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

/* 按钮样式 */
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>