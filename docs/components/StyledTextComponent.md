# StyledTextComponent

## 文件路径

`src/components/content/StyledTextComponent.vue`

## 类型名

`styledText`

## 职责

将配置渲染为带样式的行内文本（`<span>`），用于段落内强调、高亮等。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 文本内容 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 模板：`<span :style="cssStyles">{{ config.content }}</span>`，`cssStyles` 来自 useStyles。
- 叶子组件，无子节点。
