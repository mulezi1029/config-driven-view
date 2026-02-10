# HeadingComponent

## 文件路径

`src/components/content/HeadingComponent.vue`

## 类型名

`heading`

## 职责

将配置渲染为标题标签（h1–h6），并应用样式。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| level | number | 是 | 1–6，对应 h1–h6 |
| content | string | 是 | 标题文本 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 使用动态标签：`:is="\`h${config.level}\`"`，绑定 useStyles 返回的 `cssStyles`。
- 叶子组件，不包含子节点渲染。
