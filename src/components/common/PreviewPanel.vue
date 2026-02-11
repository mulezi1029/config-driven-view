<template>
  <div class="preview-panel">
    <div class="preview-header flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">实时预览</h3>
      <div class="preview-actions">
        <button 
          class="btn btn-secondary" 
          @click="toggleFullscreen"
        >
          {{ isFullscreen ? '退出全屏' : '全屏预览' }}
        </button>
      </div>
    </div>
    
    <div 
      class="preview-content preview-container"
      :class="{ 'fullscreen': isFullscreen }"
      ref="previewContainer"
    >
      <!-- 全屏时在内容区域顶部显示退出按钮，避免被遮挡 -->
      <div v-if="isFullscreen" class="fullscreen-exit-bar">
        <button
          class="btn btn-secondary"
          @click="toggleFullscreen"
        >
          退出全屏
        </button>
      </div>
      <div class="preview-header-info mb-4 pb-2 border-b">
        <h1 class="text-xl font-bold" v-if="config.metadata?.title">
          {{ config.metadata.title }}
        </h1>
        <div class="text-sm text-gray-500 mt-1" v-if="config.metadata">
          <span v-if="config.metadata.lastUpdated">
            最后更新: {{ formatDate(config.metadata.lastUpdated) }}
          </span>
          <span v-if="config.metadata.author" class="ml-4">
            作者: {{ config.metadata.author }}
          </span>
        </div>
      </div>
      
      <component-renderer
        v-for="(item, index) in config.content"
        :key="index"
        :config="item"
        :styles="config.styles"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ComponentRenderer from '../content/ComponentRenderer.vue';

export default {
  name: 'PreviewPanel',
  components: {
    ComponentRenderer
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    watch(() => props.config, (newVal) => {
      console.log("🚀 ~ :70 ~ watch ~ props.config:", newVal);
    }, { deep: true, immediate: true });
    const isFullscreen = ref(false);
    const previewContainer = ref(null);

    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;

      if (isFullscreen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen.value) {
        toggleFullscreen();
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleEscape);
    });
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      isFullscreen,
      previewContainer,
      toggleFullscreen,
      formatDate
    };
  }
};
</script>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  border-radius: 0;
  max-width: none;
}

.fullscreen-exit-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  background: #fff;
}

/* 应用全局样式 */
.preview-container :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
}

.preview-container :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #34495e;
}

.preview-container :deep(h3) {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #34495e;
}

.preview-container :deep(p) {
  margin-bottom: 15px;
  line-height: 1.6;
}

.preview-container :deep(ul),
.preview-container :deep(ol) {
  margin-bottom: 15px;
  padding-left: 20px;
}

.preview-container :deep(ol) {
  list-style-type: decimal;
  list-style-position: outside;
}

.preview-container :deep(ul) {
  list-style-type: disc;
  list-style-position: outside;
}

.preview-container :deep(li) {
  margin-bottom: 5px;
}

.preview-container :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.preview-container :deep(th),
.preview-container :deep(td) {
  padding: 10px;
  border: 1px solid #ddd;
}

/* TableComponent 使用 separate + 分边边框，此处不再统一加 border，避免重叠 */
.preview-container :deep(table.table-component th),
.preview-container :deep(table.table-component td) {
  border: none;
}

.preview-container :deep(th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

.preview-container :deep(hr) {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.preview-container :deep(.highlight) {
  background-color: #ffffcc;
  padding: 2px 4px;
  border-radius: 2px;
}

.preview-container :deep(.warning) {
  color: #e74c3c;
  font-weight: bold;
}

.preview-container :deep(.note) {
  background-color: #e8f4f8;
  border-left: 4px solid #3498db;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 0 4px 4px 0;
}
</style>