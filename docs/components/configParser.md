# configParser

## 文件路径

`src/utils/configParser.js`

## 职责

提供配置的加载、解析、格式化与示例列表等 I/O 与序列化能力。

## 导出 API

| 函数 | 说明 |
|------|------|
| loadConfig(filePath) | 异步 fetch 并 JSON 解析，返回 config 对象；失败抛错 |
| saveConfig(config, filePath) | 当前为占位实现（可接后端 API），返回 true |
| formatConfig(config) | 返回 JSON.stringify(config, null, 2) |
| parseConfig(jsonString) | JSON.parse，失败抛错并带信息 |
| getExampleConfigs() | 返回示例配置列表，项含 id、name、path（如 user-agreement、privacy-policy、tax-rules） |

## 使用场景

- EditorLayout：加载示例时用 loadConfig(example.path)；保存时调用 saveConfig；导出时用 formatConfig 得到字符串再生成下载。
- ConfigEditor：初始化与重置时用 formatConfig 转成编辑器字符串；输入时用 parseConfig 转回对象并校验。
