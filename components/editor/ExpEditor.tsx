"use client"

import { createEditor, Descendant, Node } from 'slate'
import { withReact, Slate, Editable, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { Toolbar } from '@/components/editor/ui/ui'
import { useCallback, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { withMedia } from './plugins/withMedia'
import { initialValue } from './initialValue'
import { RenderElement, RenderLeaf } from './Elements/elements'
// import 'material-icons/iconfont/material-icons.css'
import { SetNodeToDecorations, useDecorate } from './codeDecorate/CodeDecorate'
import useOnKeydown from './customHooks/useOnKeyDown'
import { BlockButton, MarkButton, MediaButton } from './buttons/buttons';


export default function ExpEditor() {

  const renderElement = useCallback(props => <RenderElement {...props} />, [])
  const renderLeaf = useCallback(props => <RenderLeaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withMedia(withHistory(withReact(createEditor()))), [])
  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor)
  const [value, setValue] = useState<Descendant[]>(initialValue)

  console.log(value)
  return (
    <>
      <Tooltip id='format-tooltip'/>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(c) => setValue(c)}
      >
        <Toolbar>
          <MarkButton format="bold" hint="Жирний" />
          <MarkButton format="italic" hint="Нахилений" />
          <MarkButton format="underline" hint="Підкреслений" />
          <MarkButton format="code" hint="Код" />
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
          <MediaButton format="image" hint="Вставити зображення" />
          <MediaButton format="youtube" hint="Вставити відео Youtube" />
        </Toolbar>
        
        <SetNodeToDecorations />
        
        <Editable
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={onKeyDown}
          style={{padding:"0 3rem"}}
        />
      </Slate>
    </>
  )
}


