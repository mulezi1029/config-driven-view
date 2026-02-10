# useConfigValidation

## 文件路径

`src/composables/useConfigValidation.js`

## 职责

对根配置或解析后的 config 做结构校验，收集 errors 与 warnings，供 ConfigEditor 禁用保存并展示提示。

## 用法

```js
const { errors, warnings, validateConfig } = useConfigValidation();
const valid = validateConfig(parsedConfig);
// valid 为 true 表示无 errors；errors/warnings 为 ref 数组
```

## 返回值

| 名称 | 类型 | 说明 |
|------|------|------|
| errors | Ref<Array<string>> | 错误信息，存在则不应保存 |
| warnings | Ref<Array<string>> | 警告信息，如缺 version |
| validateConfig | (config) => boolean | 执行校验并填充 errors/warnings，返回是否无错误 |

## 校验规则摘要

- 根级：config 非空；必须含 content 且为数组；建议有 version（否则 warning）。
- 每项：必须含 type；按 type 校验必填字段：
  - heading：level、content
  - paragraph / richText / note：content
  - list：items 数组
  - table：headers、rows 数组
  - section：content 数组，并递归 validateContent
  - image：src
  - link：href、content
  - styledText：content
