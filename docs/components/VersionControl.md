# VersionControl

## 文件路径

`src/components/common/VersionControl.vue`

## 职责

展示当前版本号与版本历史列表，提供「保存当前版本」与「回滚到指定版本」的 UI，具体版本数据与逻辑由父组件通过 useVersionControl 维护。

## Props / Emits

| 类型 | 名称 | 说明 |
|------|------|------|
| props | currentVersion (String) | 当前版本号 |
| props | versionHistory (Array) | 版本列表，项含 version、timestamp 等 |
| emits | save-version | 保存新版本，可带自定义版本号（或 null 自动递增） |
| emits | rollback-version | 回滚到指定版本号 |

## 实现要点

- 保存：用户输入可选版本号，点击后 `emit('save-version', newVersionName.value || null)`。
- 回滚：点击某版本「回滚」时 confirm 后 `emit('rollback-version', version)`；当前版本对应行禁用回滚按钮并高亮。
- 时间展示使用 formatDateTime（本地化字符串）。
