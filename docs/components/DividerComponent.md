# DividerComponent

## 文件路径

`src/components/content/DividerComponent.vue`

## 类型名

`divider`

## 职责

将配置渲染为一条水平分割线（`<hr>`）。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 模板：`<hr :style="cssStyles" />`，`cssStyles` 来自 useStyles。
- 叶子组件，无子节点。
