# ParagraphComponent

## 文件路径

`src/components/content/ParagraphComponent.vue`

## 类型名

`paragraph`

## 职责

将配置渲染为段落 `<p>`，并应用样式。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 段落文本 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 模板：`<p :style="cssStyles">{{ config.content }}</p>`，`cssStyles` 来自 useStyles。
- 叶子组件，无子节点。
