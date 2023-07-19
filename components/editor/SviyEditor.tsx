"use client"
import { RenderElement as Element, RenderLeaf as Leaf } from './Elements/elements'
import "material-icons/iconfont/material-icons.css"
import { createEditor, Descendant } from 'slate'
import { withReact, Slate, Editable } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { normalizeTokens } from './codeDecorate/normalize-tokens'
import { Toolbar } from '@/components/editor/ui/ui'
import { useCallback, useMemo, useState } from 'react';
import { ToolBar } from './Toolbar/ToolBar'
import { MarkButton } from './Toolbar/buttons/MarkButton'
import { BlockButton } from "./Toolbar/buttons/BlockButton"
import useOnKeydown from './customHooks/useOnKeyDown'
import { Tooltip } from 'react-tooltip'

export default function SviyEditor() {

  const [content, setContent] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withHistory(withReact(createEditor())), [])

  const onKeyDown = useOnKeydown(editor)

  return (
    <>
      <Tooltip id='format-tooltip' />
      <Slate
        editor={editor}
        initialValue={content}
        onChange={(content) => setContent(content)}
      >
        <Toolbar>
          <MarkButton format="bold" hint="Жирний" />
          <MarkButton format="italic" hint="Нахилений" />
          <MarkButton format="underline" hint="Підкреслений" />
          <MarkButton format="code" hint="Код" />
          <MarkButton format="strikethrough" hint="Перекреслений" />
          <MarkButton format="superscript" hint="Верхній індекс" />
          <MarkButton format="subscript" hint="Нижній індекс" />
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
        </Toolbar>
        
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text…"
          spellCheck
          autoFocus
          onKeyDown={onKeyDown}
        />
        
      </Slate>
    </>
  )
}



export const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'Почніть ' },
      { text: 'створювати', bold: true },
      { text: ' свій, ' },
      { text: 'найкращий', italic: true },
      { text: ' пост!' },
    ],
  },
]
