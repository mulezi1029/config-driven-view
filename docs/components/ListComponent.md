# ListComponent

## 文件路径

`src/components/content/ListComponent.vue`

## 类型名

`list`

## 职责

将配置渲染为有序列表（ol）或无序列表（ul），每一项可为纯文本或嵌套块（通过 ComponentRenderer 渲染）。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| style | string | 否 | `'ordered'` 为 ol，否则 ul |
| items | array | 是 | 项为 string 或带 type 的对象 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 根元素为 `<ol>` 或 `<ul>`，由 `config.style === 'ordered'` 决定。
- 遍历 `config.items`：若 `typeof item === 'object'`，用 `<component-renderer :config="item" :styles="styles" />`；否则直接 `{{ item }}`。
- ComponentRenderer 使用 `defineAsyncComponent` 引入，避免循环依赖。
- 样式：根列表用 useStyles 的 cssStyles；列表项可使用 `styles.listItem`（若在 config.styles 中定义）。
