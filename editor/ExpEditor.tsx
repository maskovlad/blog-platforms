"use client"

import { createEditor, Descendant } from 'slate'
import { withReact, Slate, } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { ToolBar } from './Toolbar/ToolBar'
import { useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { withMedia } from './plugins/withMedia'
import { initialValue } from './initialValue'
import { SetNodeToDecorations } from './Editable/codeDecorate/CodeDecorate'
import { MarkButton } from './Toolbar/buttons/MarkButton'
import { BlockButton } from "./Toolbar/buttons/BlockButton"
import { MediaButton } from "./Toolbar/buttons/MediaButton"
import TableSelector from './Elements/Table/TableSelector';
import withLinks from "./plugins/withLinks"
import withTable from "./plugins/withTable"
import LinkButton from './Toolbar/buttons/LinkButton'
import ColorPicker from "./Elements/ColorPicker/ColorPicker"
// import "material-icons/iconfont/material-icons.css"
import { withHtml } from './plugins/withHtml';
import EditableWithDecorate from './Editable/EditableWithDecorate';

// @refresh reset
export default function NewEditor() {

  const editor: CustomEditor = useMemo(() =>
    withHtml(
      withTable(
        withLinks(
          withMedia(
            withHistory(
              withReact(
                createEditor())))))), [])
  const [value, setValue] = useState<Descendant[]>(initialValue);

  console.log(value)
  return (
    <>
      <Tooltip id='format-tooltip' />
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(content) => setValue(content)}
      >
        <ToolBar>
          <MarkButton format="bold" hint="Жирний" />
          <MarkButton format="italic" hint="Нахилений" />
          <MarkButton format="underline" hint="Підкреслений" />
          <MarkButton format="code" hint="Код" />
          <MarkButton format="strikethrough" hint="Перекреслений" />
          <MarkButton format="superscript" hint="Верхній індекс" />
          <MarkButton format="subscript" hint="Нижній індекс" />
          <ColorPicker format="color" hint="Колір тексту" />
          <ColorPicker format="bgColor" hint="Колір тла" />
          <BlockButton format="heading-one" hint="Заголовок 1" />
          <BlockButton format="heading-two" hint="Заголовок 2" />
          <BlockButton format="heading-three" hint="Заголовок 3" />
          <BlockButton format="block-quote" hint="Цитата" />
          <BlockButton format="numbered-list" hint="Нумерований" />
          <BlockButton format="bulleted-list" hint="Список" />
          <BlockButton format="left" hint="По лівому краю" />
          <BlockButton format="center" hint="По центру" />
          <BlockButton format="right" hint="По правому краю" />
          <BlockButton format="justify" hint="По ширині" />
          <BlockButton format="code-block" hint="Блок коду" />
          <TableSelector hint="Таблиця" />
          <LinkButton hint="Виділіть текст у пості і натисніть цю кнопку, щоб додати посилання" />
          <MediaButton format="image" hint="Вставити зображення" />
          <MediaButton format="youtube" hint="Вставити відео Youtube" />
        </ToolBar>

        <SetNodeToDecorations />

        <EditableWithDecorate />
      </Slate>
    </>
  )
}

