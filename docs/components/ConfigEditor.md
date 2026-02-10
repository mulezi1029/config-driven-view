# ConfigEditor

## 文件路径

`src/components/common/ConfigEditor.vue`

## 职责

提供配置的 JSON 编辑能力：文本框与 config 双向同步、校验、保存/重置，并展示错误与警告。

## Props / Emits

| 类型 | 名称 | 说明 |
|------|------|------|
| props | modelValue (Object) | 必填，当前配置对象 |
| emits | update:modelValue | 校验通过时抛出解析后的 config |
| emits | save | 用户点击「保存配置」时抛出当前解析的 config |
| emits | reset | 用户点击「重置」时触发，父组件可恢复为上次保存版本 |

## 实现要点

- 内部维护 `configText`（JSON 字符串），与 `modelValue` 通过 `parseConfig` / `formatConfig` 同步；输入时 `onConfigChange` 解析并校验，通过则 `emit('update:modelValue', parsedConfig)`。
- 使用 `useConfigValidation` 的 `validateConfig`，结果展示在 errors / warnings 区域；`isValid` 为 false 时禁用保存按钮。
- 保存：`emit('save', parseConfig(configText.value))`；重置：`initEditor()` 恢复为 `props.modelValue` 的格式化字符串并 `emit('reset')`。
- 使用 Prism 做 JSON 高亮（在 textarea 上通过 ref 调用 highlightElement）。
