# NoteComponent

## 文件路径

`src/components/content/NoteComponent.vue`

## 类型名

`note`

## 职责

将配置渲染为提示/说明块；内容可为纯文本或单个嵌套块（通过 ComponentRenderer 渲染）。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string \| object | 是 | 文本或带 type 的配置对象 |
| icon | string | 否 | 可选图标展示 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 若 `typeof config.content === 'object'`，用 `<component-renderer :config="config.content" :styles="styles" />`；否则 `{{ config.content }}`。
- 根节点应用 useStyles 的 cssStyles；若有 `config.icon` 在左侧展示。
- ComponentRenderer 使用 defineAsyncComponent 引入，避免循环依赖。
