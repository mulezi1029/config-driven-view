# SectionComponent

## 文件路径

`src/components/content/SectionComponent.vue`

## 类型名

`section`

## 职责

将配置渲染为可折叠的区块，标题 + 子内容列表；子内容由 ComponentRenderer 递归渲染。

## 配置字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 区块标题 |
| content | array | 是 | 子块配置数组 |
| style / inlineStyles | - | 否 | 见总览「内容项通用字段」 |

## 实现要点

- 标题区：可点击切换折叠，展示 `config.title`，样式可用 `styles.heading.h2`。
- 内容区：`v-for="(item, index) in config.content"`，每项用 `<component-renderer :config="item" :styles="styles" />`。
- 折叠：`isCollapsed` 控制 `v-show` 与 maxHeight 过渡。
- ComponentRenderer 使用 defineAsyncComponent 引入，避免循环依赖。
