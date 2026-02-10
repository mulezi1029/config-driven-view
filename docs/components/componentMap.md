# componentMap

## 文件路径

`src/components/content/componentMap.js`

## 职责

维护「配置类型名（type）」到「Vue 组件」的映射表，供 ComponentRenderer 根据 `config.type` 解析出要渲染的组件。

## 导出

```js
export const componentMap = {
  heading: HeadingComponent,
  paragraph: ParagraphComponent,
  list: ListComponent,
  table: TableComponent,
  section: SectionComponent,
  styledText: StyledTextComponent,
  richText: RichTextComponent,
  image: ImageComponent,
  link: LinkComponent,
  divider: DividerComponent,
  note: NoteComponent
};
```

## 扩展方式

1. 在 `componentMap.js` 中 import 新组件并增加一行映射，例如：`accordion: AccordionComponent`。
2. 若新组件为容器型（有子节点），在组件内部对子数据做 `v-for`，每项用 `<component-renderer>` 渲染。
3. 在 `useConfigValidation.js` 中按需增加该 type 的必填字段校验。

## 注意

- 所有在 componentMap 中被引用的组件会在应用加载 componentMap 时被同步加载；容器组件通过异步引用 ComponentRenderer 打破循环依赖。
