import HeadingComponent from './HeadingComponent.vue';
import ParagraphComponent from './ParagraphComponent.vue';
import ListComponent from './ListComponent.vue';
import TableComponent from './TableComponent.vue';
import SectionComponent from './SectionComponent.vue';
import StyledTextComponent from './StyledTextComponent.vue';
import RichTextComponent from './RichTextComponent.vue';
import ImageComponent from './ImageComponent.vue';
import LinkComponent from './LinkComponent.vue';
import DividerComponent from './DividerComponent.vue';
import NoteComponent from './NoteComponent.vue';

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