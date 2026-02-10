# useVersionControl

## 文件路径

`src/composables/useVersionControl.js`

## 职责

在内存中维护配置的版本历史栈，支持保存当前配置为版本、按版本号回滚并返回该版本的 config 深拷贝。

## 用法

```js
const {
  currentVersion,
  versionHistory,
  saveVersion,
  rollbackToVersion,
  getHistory
} = useVersionControl(initialConfig);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| initialConfig | Object | 初始 config，用于生成第一条历史记录；会读取 initialConfig.version 作为初始版本号 |

## 返回值

| 名称 | 类型 | 说明 |
|------|------|------|
| currentVersion | Ref<string> | 当前版本号 |
| versionHistory | Readonly<Array> | 历史列表，项为 { version, timestamp, config } |
| saveVersion | (config, version?) => string | 深拷贝 config 入栈；可选传入版本号，否则自动递增 patch；返回新版本号 |
| rollbackToVersion | (version) => Object \| null | 根据版本号找到历史项，返回其 config 的深拷贝；未找到返回 null |
| getHistory | () => Array | 返回 versionHistory 的倒序副本 |

## 实现细节

- 版本号递增：incrementVersion 对 "x.y.z" 的 z 自增。
- 所有存入历史的 config 均为 JSON.parse(JSON.stringify(config)) 深拷贝，避免引用污染。
