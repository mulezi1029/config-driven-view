# EditorLayout

## 文件路径

`src/layouts/EditorLayout.vue`

## 职责

整体布局：顶部导航（标题、加载示例、导出配置）、左侧 ConfigEditor、右侧 PreviewPanel、底部状态栏（保存状态、当前版本）；持有根 config 与版本历史，协调加载/保存/重置/导出。

## 实现要点

- 使用 reactive `config` 作为单一数据源，默认带 version、metadata、styles、content 示例。
- 左侧 `<config-editor v-model="config" @save="saveConfig" @reset="resetConfig" />`，右侧 `<preview-panel :config="config" />`，config 变更实时驱动预览。
- 版本：通过 `useVersionControl(config)` 得到 currentVersion、versionHistory、saveVersion、rollbackToVersion；加载示例或保存成功后调用 saveVersion；重置时用历史中最新版本覆盖 config。
- 加载示例：getExampleConfigs 得到列表，选择后 loadConfig(path) 并 Object.assign(config, loadedConfig)，再 saveVersion。
- 导出：将 config 序列化为 JSON 并触发下载。
- 底部 saveStatus 在保存成功/失败后显示 3 秒。
