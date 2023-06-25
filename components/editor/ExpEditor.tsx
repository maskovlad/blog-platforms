import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { CustomEditor, CustomElement, CustomText } from "@/types/editor";

import { Button, Icon, Toolbar } from '@/components/editor/components'
import { useCallback, useMemo, useState } from 'react';

import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import { css } from '@emotion/react';
import styles from "./SviyEditor.module.css"

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const CODE_BLOCK_TYPE = 'code-block'
const CODE_LINE_TYPE = 'code-line'
const PARAGRAPH_TYPE = 'paragraph'
const LIST_ITEM_TYPE = 'list-item'

export default function ExpEditor({ content, onChange }: { content: Descendant[], onChange: any }) {

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <>
      <Tooltip id='format-tooltip' />
      <Slate
        editor={editor}
        value={content}
        onChange={(content) => onChange(content)}
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
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </>
  )
}


const toggleBlock = (editor, format) => {

  const isList = LIST_TYPES.includes(format)
  const isCode = CODE_BLOCK_TYPE === format
  const isAlign = TEXT_ALIGN_TYPES.includes(format)

  //* чи увімкнений format, що прийшов з кнопки зараз на цьому блоці
  const isActiveFormat = isBlockActive(
    editor,
    format,
    isAlign ? 'align' : 'type'
  )

  //* знімаємо у списка або у блока коду wrapper 
  Transforms.unwrapNodes(editor, {
    match: node => {
      return !Editor.isEditor(node) &&  // не є глобальним обьєктом Editor
        SlateElement.isElement(node) && // вузол є елементом
        (LIST_TYPES.includes(node.type) || CODE_BLOCK_TYPE === node.type) &&  // вузол є списком або кодом
        !isAlign  //? не є вирівнюванням
    },
    split: true,
  })

  let newProps: Partial<SlateElement>

  if (!isActiveFormat) {
    if (isAlign) {
      newProps = { align: format }
    } else if (isList) {
      newProps = { type: LIST_ITEM_TYPE }
    } else if (isCode) {
      newProps = { type: CODE_LINE_TYPE }
    } else {
      newProps = { type: format }
    }
  } else {
    if (isAlign) {
      newProps = { align: undefined }
    } else {
      newProps = { type: PARAGRAPH_TYPE }
    }
  }

  //* встановлюємо тип блоку або вирівнювання
  Transforms.setNodes<SlateElement>(editor, newProps)

  //* список або код обертаємо wrapper'ом
  if (!isActiveFormat && (isList || isCode)) {
    const block: CustomElement = { type: format, children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align ?? '' }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          style={style}
          className={styles['block-quote']}
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'heading-one':
      return (
        <h1
          style={style}
          className={styles['heading-one']}
          {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2
          style={style}
          className={styles['heading-two']}
          {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol
          style={style}
          className={styles['numbered-list']}
          {...attributes}>
          {children}
        </ol>
      )
    case 'bulleted-list':
      return (
        <ul
          style={style}
          className={styles['bulleted-list']}
          {...attributes}>
          {children}
        </ul>
      )
    case 'code-block':
      return (
        <pre>
          <code
            className={styles['code-block']}
            {...attributes}>
            {children}
          </code>
        </pre>
      )
    case 'code-line':
      return (
        <span
          className={styles['code-line']}
          style={style}
          {...attributes}>
          {children}
        </span>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: { attributes: Node, children: any, leaf: CustomText }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
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

const initialValue: Descendant[] = [
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
