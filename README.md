# 配置驱动视图编辑器

一个基于 Vue 3 的配置驱动视图编辑器，允许用户通过修改 JSON 配置文件来动态生成内容规则/协议页面，无需修改前端代码。

## 功能特点

- **配置驱动视图渲染**：通过 JSON 配置文件定义页面内容和样式
- **支持多种内容格式**：标题、段落、列表、表格、富文本等
- **嵌套结构支持**：支持章节嵌套，实现复杂文档结构
- **样式差异化配置**：支持全局样式、类型样式和自定义样式
- **实时预览**：配置修改后即时查看渲染效果
- **版本控制**：保存多个版本，支持版本回滚
- **示例配置**：提供示例配置文件，快速上手

## 技术栈

- Vue 3
- Vite
- TailwindCSS
- DOMPurify (用于安全渲染HTML)
- Prism.js (用于代码高亮)

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 组件
│   ├── common/          # 通用组件
│   │   ├── ConfigEditor.vue     # 配置编辑器
│   │   ├── PreviewPanel.vue     # 预览面板
│   │   └── VersionControl.vue   # 版本控制
│   └── content/         # 内容渲染组件
│       ├── ComponentRenderer.vue    # 组件渲染器
│       ├── HeadingComponent.vue     # 标题组件
│       ├── ParagraphComponent.vue   # 段落组件
│       ├── ListComponent.vue        # 列表组件
│       ├── TableComponent.vue       # 表格组件
│       ├── SectionComponent.vue     # 章节组件
│       ├── StyledTextComponent.vue  # 样式文本组件
│       ├── RichTextComponent.vue    # 富文本组件
│       ├── ImageComponent.vue       # 图片组件
│       ├── LinkComponent.vue        # 链接组件
│       ├── DividerComponent.vue     # 分隔线组件
│       └── NoteComponent.vue        # 注释组件
├── composables/         # 组合式函数
│   ├── useStyles.js               # 样式处理
│   ├── useVersionControl.js       # 版本控制
│   └── useConfigValidation.js     # 配置验证
├── config/              # 配置文件
│   └── examples/        # 示例配置
│       └── user-agreement.json    # 用户协议示例
├── layouts/             # 布局组件
│   └── EditorLayout.vue           # 编辑器布局
├── utils/               # 工具函数
│   └── configParser.js            # 配置解析器
├── App.vue              # 应用入口组件
└── main.js              # 应用入口文件
```

## 配置文件格式

配置文件采用 JSON 格式，主要包含以下部分：

1. **版本信息**：`version` 字段指定配置文件版本
2. **元数据**：`metadata` 包含标题、更新日期、作者等信息
3. **样式定义**：`styles` 定义全局样式、类型样式和自定义样式
4. **内容定义**：`content` 包含页面的实际内容，支持多种内容类型

### 示例配置

```json
{
  "version": "1.0.0",
  "metadata": {
    "title": "用户服务协议",
    "lastUpdated": "2023-07-21",
    "author": "Content Team"
  },
  "styles": {
    "global": {
      "fontFamily": "Arial, sans-serif",
      "color": "#333333"
    },
    "heading": {
      "h1": {
        "fontSize": "24px",
        "fontWeight": "bold",
        "marginBottom": "20px"
      }
    },
    "customStyles": {
      "highlight": {
        "backgroundColor": "#ffffcc",
        "padding": "2px 4px"
      }
    }
  },
  "content": [
    {
      "type": "heading",
      "level": 1,
      "content": "用户服务协议"
    },
    {
      "type": "paragraph",
      "content": "欢迎使用我们的服务。"
    }
  ]
}
```

## 支持的内容类型

- **heading**：标题 (h1-h6)
- **paragraph**：段落
- **list**：列表 (有序/无序)
- **table**：表格
- **section**：章节 (可嵌套)
- **styledText**：带样式的文本
- **richText**：富文本 (HTML)
- **image**：图片
- **link**：链接
- **divider**：分隔线
- **note**：注释/提示框

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 自定义扩展

### 添加新的内容类型

1. 在 `src/components/content/` 目录下创建新的组件
2. 在 `src/components/content/componentMap.js` 中注册新组件
3. 确保组件接收 `config` 和 `styles` 属性

### 自定义样式

可以在配置文件的 `styles` 部分定义：
- `global`：全局样式
- 特定类型样式（如 `heading`、`paragraph` 等）
- `customStyles`：可在内容中引用的自定义样式

## 注意事项

- 富文本内容会通过 DOMPurify 进行净化，以防止 XSS 攻击
- 配置文件需要符合特定格式，否则可能无法正确渲染
- 对于复杂的嵌套结构，建议使用章节（section）组件