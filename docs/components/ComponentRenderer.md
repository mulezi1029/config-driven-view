# ComponentRenderer

## 文件路径

`src/components/content/ComponentRenderer.vue`

## 职责

根据单条配置节点的 `type` 从组件映射表中取出对应 Vue 组件，并渲染该组件，传入 `config` 与 `styles`。**不负责递归子节点**，递归由各容器组件在内部完成。

## Props

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| config | Object | 是 | 当前节点的配置，必须含 `type` |
| styles | Object | 否 | 全局样式对象，默认 `{}` |

## 实现要点

- 使用 `componentMap[config.type]` 得到组件，用 Vue 的 `<component :is="comp">` 动态挂载。
- 未在 componentMap 中注册的 type 会显示错误提示：「未知组件类型: xxx」。
- 子节点由被渲染的容器组件（如 Section、List、Table、Note）内部再使用 ComponentRenderer 形成树形结构。

## 与循环依赖

容器组件通过 `defineAsyncComponent(() => import('./ComponentRenderer.vue'))` 引用本组件，避免 ComponentRenderer → componentMap → 容器组件 → ComponentRenderer 的同步循环依赖。
