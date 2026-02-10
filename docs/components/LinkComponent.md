# LinkComponent

## 文件路径

`src/components/content/LinkComponent.vue`

## 类型名

`link`

## 职责

将配置渲染为超链接。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| href | string | 是 | 链接地址 |
| content | string | 是 | 链接文案 |
| target | string | 否 | 如 `_blank`，默认 `_self` |
| rel | string | 否 | 如 noopener |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- `<a :href="config.href" :target="config.target || '_self'" :rel="config.rel" :style="cssStyles">{{ config.content }}</a>`。
- 叶子组件，无子节点。
