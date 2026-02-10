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
    
    <div class="editor-content">
      <textarea
        ref="editorTextarea"
        class="code-editor w-full h-[500px] p-4 border rounded"
        v-model="configText"
        @input="onConfigChange"
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
    const { errors, warnings, validateConfig } = useConfigValidation();
    const isValid = ref(true);
    
    // 初始化编辑器内容
    const initEditor = () => {
      configText.value = formatConfig(props.modelValue);
      nextTick(() => {
        highlightCode();
      });
    };
    
    // 高亮代码
    const highlightCode = () => {
      if (editorTextarea.value) {
        Prism.highlightElement(editorTextarea.value);
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
      initEditor();
    }, { deep: true });
    
    // 初始化
    initEditor();
    
    return {
      configText,
      editorTextarea,
      errors,
      warnings,
      isValid,
      onConfigChange,
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
  overflow: auto;
}

/* 覆盖Prism样式以适应我们的编辑器 */
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