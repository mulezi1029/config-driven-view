<template>
  <div class="version-control">
    <div class="version-header flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">版本控制</h3>
      <div class="version-info">
        当前版本: <span class="font-mono">{{ currentVersion }}</span>
      </div>
    </div>
    
    <div class="version-actions mb-4">
      <button 
        class="btn btn-primary" 
        @click="saveNewVersion"
      >
        保存当前版本
      </button>
      <div class="version-input ml-2 inline-block">
        <input 
          type="text" 
          v-model="newVersionName" 
          placeholder="自定义版本号 (可选)"
          class="px-2 py-1 border rounded text-sm"
        />
      </div>
    </div>
    
    <div class="version-history">
      <h4 class="font-semibold mb-2">版本历史</h4>
      <div class="overflow-auto max-h-[300px]">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">版本号</th>
              <th class="border p-2 text-left">时间</th>
              <th class="border p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(version, index) in versionHistory" 
              :key="index"
              :class="{ 'bg-blue-50': version.version === currentVersion }"
            >
              <td class="border p-2 font-mono">{{ version.version }}</td>
              <td class="border p-2">{{ formatDateTime(version.timestamp) }}</td>
              <td class="border p-2">
                <button 
                  class="btn btn-sm btn-secondary"
                  @click="rollbackToVersion(version.version)"
                  :disabled="version.version === currentVersion"
                >
                  回滚
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'VersionControl',
  props: {
    currentVersion: {
      type: String,
      required: true
    },
    versionHistory: {
      type: Array,
      required: true
    }
  },
  emits: ['save-version', 'rollback-version'],
  setup(props, { emit }) {
    const newVersionName = ref('');
    
    // 保存新版本
    const saveNewVersion = () => {
      emit('save-version', newVersionName.value || null);
      newVersionName.value = '';
    };
    
    // 回滚到指定版本
    const rollbackToVersion = (version) => {
      if (confirm(`确定要回滚到版本 ${version} 吗？当前未保存的更改将会丢失。`)) {
        emit('rollback-version', version);
      }
    };
    
    // 格式化日期时间
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
    
    return {
      newVersionName,
      saveNewVersion,
      rollbackToVersion,
      formatDateTime
    };
  }
};
</script>

<style scoped>
.version-control {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.version-actions {
  display: flex;
  align-items: center;
}

.version-history {
  flex: 1;
  overflow: auto;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>