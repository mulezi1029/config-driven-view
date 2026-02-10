# ImageComponent

## 文件路径

`src/components/content/ImageComponent.vue`

## 类型名

`image`

## 职责

将配置渲染为图片与可选图注。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | string | 是 | 图片地址 |
| alt | string | 否 | 替代文本 |
| width / height | string | 否 | 尺寸 |
| caption | string | 否 | 图注文案 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 根节点为 div，应用 useStyles 的 cssStyles；内层 `<img>` 绑定 src/alt/width/height。
- 若有 `config.caption`，使用 `styles.imageCaption` 渲染图注。
- 叶子组件，无子节点。
