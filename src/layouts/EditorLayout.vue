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
            v-model="config"
            @save="saveConfig"
            @reset="resetConfig"
          />
        </div>
      </div>
      
      <!-- 右侧预览区 -->
      <div class="w-1/2 flex flex-col">
        <div class="flex-1 p-4 overflow-auto">
          <preview-panel :config="config" />
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
          版本: {{ currentVersion }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import ConfigEditor from '../components/common/ConfigEditor.vue';
import PreviewPanel from '../components/common/PreviewPanel.vue';
import VersionControl from '../components/common/VersionControl.vue';
import { loadConfig, saveConfig as saveConfigUtil, getExampleConfigs } from '../utils/configParser';
import { useVersionControl } from '../composables/useVersionControl';

export default {
  name: 'EditorLayout',
  components: {
    ConfigEditor,
    PreviewPanel,
    VersionControl
  },
  setup() {
    // 配置数据
    const config = reactive({
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
    
    // 版本控制
    const { 
      currentVersion, 
      versionHistory, 
      saveVersion, 
      rollbackToVersion 
    } = useVersionControl(config);

    
    // 加载示例配置
    const loadExampleConfigs = async () => {
      try {
        exampleConfigs.value = await getExampleConfigs();
      } catch (error) {
        console.error('加载示例配置失败:', error);
      }
    };
    
    // 加载示例
    const loadExample = async (example) => {
      try {
        const loadedConfig = await loadConfig(example.path);
        Object.assign(config, loadedConfig);
        saveVersion(config);
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
    
    // 保存配置
    const saveConfig = async () => {
      try {
        const success = await saveConfigUtil(config);
        if (success) {
          saveVersion(config);
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
    
    // 重置配置
    const resetConfig = () => {
      if (confirm('确定要重置配置吗？当前未保存的更改将会丢失。')) {
        const latestVersion = versionHistory.value[versionHistory.value.length - 1];
        if (latestVersion) {
          Object.assign(config, JSON.parse(JSON.stringify(latestVersion.config)));
        }
      }
    };
    
    // 导出配置
    const exportConfig = () => {
      const dataStr = JSON.stringify(config, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `config-${config.metadata?.title || 'document'}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    };
    
    // 切换下拉菜单
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };
    
    // 组件挂载时加载示例配置
    onMounted(() => {
      loadExampleConfigs();
    });
    
    return {
      config,
      saveStatus,
      exampleConfigs,
      dropdownOpen,
      currentVersion,
      versionHistory,
      loadExample,
      saveConfig,
      resetConfig,
      exportConfig,
      toggleDropdown,
      saveVersion,
      rollbackToVersion
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