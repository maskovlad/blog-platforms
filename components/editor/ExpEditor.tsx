"use client"

import { createEditor } from 'slate'
import { withReact, Slate, Editable, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { Button, Icon, Toolbar } from '@/components/editor/components'
import { useCallback, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { toggleBlock, isBlockActive, toggleMark, isMarkActive } from './utils'
import { initialValue } from './initialValue'
import { RenderElement, RenderLeaf } from './Elements'
import 'material-icons/iconfont/material-icons.css'
import { SetNodeToDecorations, useDecorate } from './CodeDecorate'
import useOnKeydown from './useOnKeyDown'

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


export default function ExpEditor() {

  const renderElement = useCallback(props => <RenderElement {...props} />, [])
  const renderLeaf = useCallback(props => <RenderLeaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withHistory(withReact(createEditor())), [])
  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor)
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <Tooltip id='format-tooltip'/>
      <Slate
        editor={editor}
        value={value}
        onChange={(c) => setValue(c)}
      >
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" hint="Жирний" />
          <MarkButton format="italic" icon="format_italic" hint="Нахилений" />
          <MarkButton format="underline" icon="format_underlined" hint="Підкреслений" />
          <MarkButton format="code" icon="code" hint="Код" />
          <BlockButton format="heading-one" icon="looks_one" hint="Заголовок 1" />
          <BlockButton format="heading-two" icon="looks_two" hint="Заголовок 2" />
          <BlockButton format="block-quote" icon="format_quote" hint="Цитата" />
          <BlockButton format="numbered-list" icon="format_list_numbered" hint="Нумерований" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" hint="Список" />
          <BlockButton format="left" icon="format_align_left" hint="По лівому краю" />
          <BlockButton format="center" icon="format_align_center" hint="По центру" />
          <BlockButton format="right" icon="format_align_right" hint="По правому краю" />
          <BlockButton format="justify" icon="format_align_justify" hint="По ширині" />
          <BlockButton format="code-block" icon="integration_instructions" hint="Блок коду" />
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

const BlockButton = ({ format, icon, hint }: { format: string, icon: string, hint: string }) => {
  const editor = useSlate()

  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon, hint }: { format: string, icon: string, hint: string }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}


