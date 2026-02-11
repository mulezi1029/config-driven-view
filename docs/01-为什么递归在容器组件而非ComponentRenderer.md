# 为什么递归在容器组件而非 ComponentRenderer

本文说明：为何不在 ComponentRenderer 中做递归，而是由 Section、List、Table、Note 等容器组件在内部 `v-for` 子项并为每项渲染 `<component-renderer>`，从而形成树形渲染。

---

## 1. ComponentRenderer 的职责：只做「单节点 → 组件」

ComponentRenderer 只做一件事：拿到**一条** config，根据 `config.type` 选组件并渲染，不关心「谁有子节点、子节点在哪」。

- **输入**：一个配置节点 + styles  
- **输出**：一个对应类型的 Vue 组件实例  

若在 ComponentRenderer 里做递归，它就要知道「section 的子在 content、list 在 items、table 在 rows 且每个 cell 可能是对象……」——所有容器的数据结构都要塞进 ComponentRenderer，它会变成「既负责分发，又负责所有容器子节点结构」的大杂烩。

---

## 2. 子节点结构是「按类型各异」的，无法统一递归

各容器「子」的形态不一样，不是「都从一个数组里递归」这么简单：

| 容器   | 子从哪里来       | 形态说明                         |
|--------|------------------|----------------------------------|
| Section | `config.content` | 数组，每一项都是「块级 config」   |
| List    | `config.items`   | 数组，项可以是 **字符串** 或 **对象** |
| Table   | `config.rows`    | 二维数组，单元格可以是 **字符串** 或 **对象** |
| Note    | `config.content` | **单个**值，可以是字符串或对象   |

若递归写在 ComponentRenderer 里，就要在里边写满：

- 若 `type === 'section'` 则遍历 `config.content`
- 若 `type === 'list'` 则遍历 `config.items`，且要判断 item 是字符串还是对象
- 若 `type === 'table'` 则二层循环 rows，再对每个 cell 判断是否对象
- 若 `type === 'note'` 则判断 `config.content` 是否对象，是则渲染一个子节点

这些本来就和「section / list / table / note 各自长什么样」强相关，更适合放在各自组件里，而不是集中在一个「渲染器」里。

---

## 3. 容器还要决定「子节点放在什么结构里」

递归不仅要「遍历子 config」，还要决定**子节点被放在什么 DOM/结构里**：

- **List**：每个子要包在 `<li>` 里，再在里面用 ComponentRenderer 渲染对象项
- **Table**：每个子要放在 `<td>` 里，再在 td 里用 ComponentRenderer 渲染复杂单元格
- **Section**：子节点放在一个 div + 折叠动效的容器里
- **Note**：只有一个 content，可能是一段文字或一个子块

也就是说：**「子节点从哪来」和「子节点外面包什么」都是容器自己才知道的事。**

若 ComponentRenderer 负责递归，它只能「再渲染一串 ComponentRenderer」，没法决定外面要包 `<li>` 还是 `<td>` 还是带折叠的 div。要包的话，要么在 ComponentRenderer 里再按 type 写一堆布局（又变成上帝组件），要么再暴露一堆 slot/render 接口，复杂度会上去。

所以更自然的是：**容器负责「结构 + 循环」，在需要渲染子 config 的地方放一个 `<component-renderer>`。**

---

## 4. 放在容器里更符合「谁的数据谁负责」

- Section 的协议是：我有 `content` 数组，每一项都是一个块级配置。
- List 的协议是：我有 `items`，项可以是纯文本或内嵌块。
- Table 的协议是：我有 `headers` 和 `rows`，单元格可以是文本或内嵌块。

「我的子节点在哪、长什么样、要不要先判断类型」——这些是**容器组件和其配置契约**的一部分，放在 SectionComponent、ListComponent、TableComponent、NoteComponent 里，读模板就能一眼看出：

- `v-for="(item, index) in config.content"` → Section 的子在 content
- `v-for="(item, index) in config.items"` + `typeof item === 'object'` → List 的子在 items，且可能是对象

数据形状和渲染逻辑绑在同一个组件里，维护和扩展都更清晰。

---

## 5. 扩展时不用改 ComponentRenderer

新增一种容器（比如「手风琴」子节点在 `config.sections`）时：

- **当前做法**：只写一个 AccordionComponent，在模板里 `v-for` 遍历 `config.sections`，每项用 `<component-renderer :config="section" />`。**不用改 ComponentRenderer，也不用改 componentMap 以外的公共逻辑。**
- **若在 ComponentRenderer 里递归**：每多一种「带子节点」的 type，就要在 ComponentRenderer 里多一段「若 type === 'accordion' 则遍历 config.sections……」的 branch，ComponentRenderer 会不断膨胀，且所有容器结构都耦合在一个文件里。

---

## 6. 小结

| 维度         | 在 ComponentRenderer 里递归                     | 在容器里 v-for + ComponentRenderer（当前做法）     |
|--------------|--------------------------------------------------|---------------------------------------------------|
| 职责         | 既要「选组件」又要「知道所有容器的子在哪、怎么遍历」 | ComponentRenderer 只做「单节点 → 组件」          |
| 数据形态     | 要在同一处处理 content/items/rows/单 content 等  | 每个容器自己处理自己的 content/items/rows         |
| 子节点包裹   | 难以决定 `<li>` / `<td>` / 折叠 div 等           | 容器自己写布局，在需要的地方插 ComponentRenderer   |
| 扩展新容器   | 必须改 ComponentRenderer                         | 只加新组件 + componentMap，不动渲染器             |
| 可读性       | 递归逻辑集中、难读                               | 每个容器的模板即文档，一眼看出「子从哪来、怎么渲染」 |

**结论**：不在 ComponentRenderer 里递归，而在容器里 v-for 再渲染 ComponentRenderer，是为了让「渲染器」只做类型分发，让「子节点在哪、怎么遍历、包在什么结构里」都留在各自容器里，这样职责清晰、扩展简单、结构也更易读。
