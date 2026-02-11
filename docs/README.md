# 配置驱动视图 — 文档索引

## 总览

- **[00-技术方案总览](./00-技术方案总览.md)**：系统目标、架构、配置约定、技术点与文档索引。
- **[01-为什么递归在容器组件而非 ComponentRenderer](./01-为什么递归在容器组件而非ComponentRenderer.md)**：递归放在容器内而非 ComponentRenderer 的设计原因（职责、数据形态、包裹结构、扩展性、可读性）。
- **[02-递归与树形设计问答](./02-递归与树形设计问答.md)**：从「为什么不能自递归」开始的系列问答（自递归+按类型渲染、Vue 的递归、JSON 配置的树形是否明确）。

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
