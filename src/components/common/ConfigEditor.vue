<template>
  <div class="config-editor">
    <div class="editor-header flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">配置编辑器</h3>
      <div class="editor-actions flex space-x-2">
        <button 
          class="btn btn-primary" 
          @click="saveConfig"
          :disabled="!isValid"
        >
          保存配置
        </button>
        <button 
          class="btn btn-secondary" 
          @click="resetConfig"
        >
          重置
        </button>
      </div>
    </div>
    
    <div class="editor-content editor-overlay-wrap">
      <pre class="editor-highlight-layer" aria-hidden="true"><code ref="highlightBlock" class="language-json">{{ configText }}</code></pre>
      <textarea
        ref="editorTextarea"
        class="code-editor code-editor-overlay w-full h-full p-4 border rounded"
        v-model="configText"
        wrap="off"
        @input="onConfigChange"
        @scroll="syncScroll"
        spellcheck="false"
      ></textarea>
    </div>
    
    <div v-if="errors.length > 0" class="errors-container mt-4">
      <h4 class="text-red-500 font-semibold mb-2">错误:</h4>
      <ul class="list-disc pl-5 text-red-500">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
    
    <div v-if="warnings.length > 0" class="warnings-container mt-4">
      <h4 class="text-yellow-500 font-semibold mb-2">警告:</h4>
      <ul class="list-disc pl-5 text-yellow-500">
        <li v-for="(warning, index) in warnings" :key="index">{{ warning }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import { parseConfig, formatConfig } from '../../utils/configParser';
import { useConfigValidation } from '../../composables/useConfigValidation';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-json';

export default {
  name: 'ConfigEditor',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'save', 'reset'],
  setup(props, { emit }) {
    const configText = ref('');
    const editorTextarea = ref(null);
    const highlightBlock = ref(null);
    const { errors, warnings, validateConfig } = useConfigValidation();
    const isValid = ref(true);
    
    // 初始化编辑器内容
    const initEditor = () => {
      configText.value = formatConfig(props.modelValue);
      nextTick(() => {
        highlightCode();
      });
    };
    
    // 高亮代码：在底层 pre/code 上渲染高亮结果，textarea 仅负责输入
    const highlightCode = () => {
      if (highlightBlock.value && configText.value !== undefined) {
        const html = Prism.highlight(
          configText.value,
          Prism.languages.json,
          'json'
        );
        highlightBlock.value.innerHTML = html;
      }
    };
    
    // 同步 textarea 滚动到高亮层，保证两者滚动一致
    const syncScroll = () => {
      const textarea = editorTextarea.value;
      const pre = highlightBlock.value?.parentElement;
      if (textarea && pre) {
        pre.scrollTop = textarea.scrollTop;
        pre.scrollLeft = textarea.scrollLeft;
      }
    };
    
    // 配置变更处理
    const onConfigChange = () => {
      try {
        const parsedConfig = parseConfig(configText.value);
        const valid = validateConfig(parsedConfig);
        isValid.value = valid;
        
        if (valid) {
          emit('update:modelValue', parsedConfig);
        }
      } catch (error) {
        errors.value = [error.message];
        isValid.value = false;
      }
      
      nextTick(() => {
        highlightCode();
      });
    };
    
    // 保存配置
    const saveConfig = () => {
      if (isValid.value) {
        emit('save', parseConfig(configText.value));
      }
    };
    
    // 重置配置
    const resetConfig = () => {
      initEditor();
      emit('reset');
    };
    
    // 监听props变化
    watch(() => props.modelValue, () => {
      console.log("🚀 ~ :140 ~ watch ~ props.modelValue changed, initEditor");
      initEditor();
    }, { deep: true });
    
    // 初始化
    initEditor();
    
    return {
      configText,
      editorTextarea,
      highlightBlock,
      errors,
      warnings,
      isValid,
      onConfigChange,
      syncScroll,
      saveConfig,
      resetConfig
    };
  }
};
</script>

<style scoped>
.config-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-content {
  flex: 1;
}

/* 高亮层 + 透明 textarea 叠加，实现可编辑 JSON 高亮；统一由容器高度约束 */
.editor-overlay-wrap {
  position: relative;
  height: 500px;
}

.editor-highlight-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 12px;
  overflow: auto;
  white-space: pre;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: #fff;
  pointer-events: none;
}

.editor-highlight-layer code {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  background: none;
  padding: 0;
  white-space: pre;
}

.code-editor-overlay {
  position: relative;
  z-index: 1;
  background: transparent !important;
  color: transparent;
  caret-color: #333;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre;
}

.code-editor-overlay::selection {
  background: rgba(59, 130, 246, 0.25);
}

/* 覆盖 Prism 样式以适应我们的编辑器 */
:deep(.token.property) {
  color: #905;
}

:deep(.token.string) {
  color: #690;
}

:deep(.token.number) {
  color: #905;
}

:deep(.token.boolean) {
  color: #905;
}

:deep(.token.null) {
  color: #905;
}

:deep(.token.punctuation) {
  color: #999;
}

:deep(.token.comment) {
  color: #999;
}
</style>