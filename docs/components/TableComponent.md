# TableComponent

## 文件路径

`src/components/content/TableComponent.vue`

## 类型名

`table`

## 职责

将配置渲染为表格；表头与单元格可为纯文本或嵌套块（如图片、Note 等），支持列对齐与圆角边框。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| headers | array | 是 | 表头字符串数组 |
| rows | array | 是 | 二维数组，单元格为 string 或带 type 的对象 |
| columnAlignments | array | 否 | 每列对齐方式，如 ['center','left','center'] |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 表头：遍历 `config.headers` 渲染 `<th>`，样式来自 `styles.tableHeader` 与 columnAlignments。
- 表体：遍历 `config.rows`，每个单元格若为对象且含 `type` 则用 `<component-renderer>` 渲染，否则直接显示文本。
- 样式：表格根用 useStyles；表头/表单元格分别用 `styles.tableHeader`、`styles.tableCell`；通过 `getHeaderCellStyle` / `getBodyCellStyle` 计算边框与圆角（首尾单元格），避免与 PreviewPanel 的 :deep 表格样式冲突。
- ComponentRenderer 使用 defineAsyncComponent 引入。
