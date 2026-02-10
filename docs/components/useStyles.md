# useStyles

## 文件路径

`src/composables/useStyles.js`

## 职责

根据当前内容项配置与全局 styles 对象，合并出最终样式（类型基础、类型子级、自定义样式名、内联样式），并转换为可绑定的 CSS 字符串（驼峰转 kebab）。

## 用法

```js
const { mergedStyles, cssStyles } = useStyles(configItem, styles);
// 模板中 :style="cssStyles" 或按需使用 mergedStyles
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| configItem | Object | 当前节点 config，可含 type、level、style、inlineStyles |
| styles | Object | 根级 config.styles，含各 type 及 customStyles |

## 合并顺序（优先级从低到高）

1. `styles[configItem.type]`：该类型基础样式
2. `styles[configItem.type]['h' + configItem.level]`：仅当有 level 时（如 heading 的 h1/h2）
3. `styles.customStyles[configItem.style]`：config 的 style 字段指向的自定义样式名
4. `configItem.inlineStyles`：节点内联样式

## 返回值

| 名称 | 类型 | 说明 |
|------|------|------|
| mergedStyles | ComputedRef<Object> | 合并后的样式对象（驼峰键） |
| cssStyles | ComputedRef<string> | 转为 "key: value; ..." 的 CSS 字符串，键经 kebabCase 转换 |

## 内部

- `kebabCase(str)`：驼峰转短横线，供 CSS 属性名使用。
