# PreviewPanel

## 文件路径

`src/components/common/PreviewPanel.vue`

## 职责

展示文档元信息（metadata）并遍历根级 content，对每项使用 ComponentRenderer 渲染，支持全屏预览。

## Props

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| config | Object | 是 | 根配置（含 metadata、styles、content） |

## 实现要点

- 顶部展示 `config.metadata`（title、lastUpdated、author），日期经 formatDate 格式化。
- 内容区：`v-for="(item, index) in config.content"`，每项 `<component-renderer :config="item" :styles="config.styles" />`。
- 全屏：isFullscreen 控制预览区域 class 与 body overflow；Escape 退出全屏；onUnmounted 时恢复 body。
- 通过 :deep() 为预览容器内 h1/h2/h3/p/ul/ol/table/hr/.note 等提供默认样式，与 config.styles 配合使用。
