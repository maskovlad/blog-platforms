"use client"

import { createEditor, Descendant } from 'slate'
import { withReact, Slate, Editable } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { Toolbar } from './ui/ui'
import { ToolBar } from './Toolbar/ToolBar'
import { useCallback, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { withMedia } from './plugins/withMedia'
import { initialValue } from './SviyEditor'
import { RenderElement, RenderLeaf } from './Elements/elements'
import { SetNodeToDecorations, useDecorate } from './codeDecorate/CodeDecorate'
import useOnKeydown from './customHooks/useOnKeyDown'
import { MarkButton } from './Toolbar/buttons/MarkButton'
import { BlockButton } from "./Toolbar/buttons/BlockButton"
import { MediaButton } from "./Toolbar/buttons/MediaButton"
import withLinks from "./plugins/withLinks"
import LinkButton from './Toolbar/buttons/LinkButton'
import ColorPicker from "./Elements/ColorPicker/ColorPicker"


export default function ExpEditor() {

  const renderElement = useCallback(props => <RenderElement {...props} />, [])
  const renderLeaf = useCallback(props => <RenderLeaf {...props} />, [])
  const editor: CustomEditor = useMemo(() =>
    withLinks(
      withMedia(
        withHistory(
          withReact(
            createEditor())))), [])
  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor)
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
          <MarkButton format="underline" hint="Під креслений" />
          <MarkButton format="code" hint="Код" />
          <MarkButton format="strikethrough" hint="Перекреслений" />
          <MarkButton format="superscript" hint="Верхній індекс" />
          <MarkButton format="subscript" hint="Нижній індекс" />
          <ColorPicker format="color" editor={editor} hint="Колір тексту" />
          <ColorPicker format="bgColor" editor={editor} hint="Колір тла" />
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
          <LinkButton editor={editor} hint="Виділіть текст у пості і натисніть цю кнопку, щоб додати посилання" />
          <MediaButton format="image" hint="Вставити зображення" />
          <MediaButton format="youtube" hint="Вставити відео Youtube" />
        </ToolBar>

        <SetNodeToDecorations />

        <Editable
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={onKeyDown}
          style={{ padding: "0 3rem" }}
        />
      </Slate>
    </>
  )
}


