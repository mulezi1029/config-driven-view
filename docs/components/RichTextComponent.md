# RichTextComponent

## 文件路径

`src/components/content/RichTextComponent.vue`

## 类型名

`richText`

## 职责

将配置中的 HTML 字符串渲染为富文本块，经 DOMPurify 净化后通过 `v-html` 输出，防止 XSS。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | HTML 字符串 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 使用 `DOMPurify.sanitize(props.config.content)` 得到 `sanitizedContent`，再 `v-html="sanitizedContent"`。
- 根节点应用 useStyles 的 cssStyles。
- 叶子组件；不解析 content 内的配置对象，仅作为 HTML 展示。
