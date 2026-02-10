# 配置驱动视图 — 文档索引

## 总览

- **[00-技术方案总览](./00-技术方案总览.md)**：系统目标、架构、配置约定、技术点与文档索引。

## 组件与模块（按类型）

### 内容渲染与映射

- [ComponentRenderer](./components/ComponentRenderer.md) — 按 `config.type` 分发到具体组件
- [componentMap](./components/componentMap.md) — type → Vue 组件映射表

### 内容组件（content）

- [HeadingComponent](./components/HeadingComponent.md)
- [ParagraphComponent](./components/ParagraphComponent.md)
- [ListComponent](./components/ListComponent.md)
- [TableComponent](./components/TableComponent.md)
- [SectionComponent](./components/SectionComponent.md)
- [NoteComponent](./components/NoteComponent.md)
- [StyledTextComponent](./components/StyledTextComponent.md)
- [RichTextComponent](./components/RichTextComponent.md)
- [ImageComponent](./components/ImageComponent.md)
- [LinkComponent](./components/LinkComponent.md)
- [DividerComponent](./components/DividerComponent.md)

### 通用组件（common）

- [ConfigEditor](./components/ConfigEditor.md)
- [PreviewPanel](./components/PreviewPanel.md)
- [VersionControl](./components/VersionControl.md)

### 布局

- [EditorLayout](./components/EditorLayout.md)

### 组合式（composables）

- [useStyles](./components/useStyles.md)
- [useConfigValidation](./components/useConfigValidation.md)
- [useVersionControl](./components/useVersionControl.md)

### 工具（utils）

- [configParser](./components/configParser.md)
