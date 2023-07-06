import { Descendant, BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type ParagraphElement = {
  type: "paragraph";
  align?: string;
  children: Descendant[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  align?: string;
  children: Descendant[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  align?: string;
  children: Descendant[];
};

export type NumberedListElement = {
  type: "numbered-list";
  align?: string;
  children: Descendant[];
};

export type CheckListItemElement = {
  type: "check-list-item";
  checked: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: "editable-void";
  children: EmptyText[];
};

export type HeadingOneElement = {
  type: "heading-one";
  align?: string;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: "heading-two";
  align?: string;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: "heading-three";
  align?: string;
  children: Descendant[];
};

export type ImageElement = {
  type: "image";
  url: string;
  children: EmptyText[];
};

export type LinkElement = {
  type: "link";
  url: string;
  children: Descendant[];
};

export type ButtonElement = {
  type: "button";
  children: Descendant[];
};

export type ListItemElement = {
  type: "list-item";
  children: Descendant[];
};

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
  align?: string;
  children: Descendant[];
};

export type TableElement = { 
  type: "table"; 
  children: TableRow[] 
};

export type TableCellElement = { 
  type: "table-cell"; 
  children: CustomText[] 
};

export type TableRowElement = { 
  type: "table-row"; 
  children: TableCell[] 
};

export type TitleElement = { 
  type: "title"; 
  children: Descendant[] 
};

export type VideoElement = {
  type: "video";
  url: string;
  children: EmptyText[];
};

export type YoutubeElement = {
  type: "youtube";
  videoId: string;
  children: EmptyText[]; 
}

export type CodeBlockElement = {
  type: "code-block";
  language: string;
  url: string;
  children: Descendant[];
};

export type CodeLineElement = {
  type: "code-line";
  children: Descendant[];
};

type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingOneElement
  | HeadingTwoElement
  | ImageElement
  | LinkElement
  | ButtonElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement
  | YoutubeElement
  | CodeBlockElement
  | CodeLineElement;

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  text: string;
};

export type EmptyText = {
  text: string;
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
  };

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }
}

/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */
export interface RenderLeafProps {
  children: any;
  leaf: CustomText;
  text: Text;
  attributes: {
    'data-slate-leaf': true;
  };
}

export interface RenderElementProps {
  children: any;
  element: AlignElement;
  attributes: {
    'data-slate-node': 'element';
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
}

