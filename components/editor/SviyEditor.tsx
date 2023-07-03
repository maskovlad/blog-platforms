// @ts-nocheck

import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'

import isHotkey from 'is-hotkey'
import {
  createEditor,
  Node,
  Editor,
  Range,
  Element as SlateElement,
  Transforms,
  NodeEntry,
  Descendant,
} from 'slate'
import {
  withReact,
  Slate,
  Editable,
  useSlate,
  ReactEditor,
  useSlateStatic,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { 
  CustomEditor, 
  CustomElement, 
  CustomText, 
  CodeBlockElement,
  RenderLeafProps, 
  RenderElementProps } from "@/types/editor";
import { normalizeTokens } from './normalize-tokens'
import { Button, Icon, Toolbar } from '@/components/editor/components'
import { useCallback, useMemo } from 'react';

import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import styles from "./Elements.module.css"

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


export default function SviyEditor({ content, onChange }: { content: Descendant[], onChange: any }) {

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withHistory(withReact(createEditor())), [])

  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor)

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
        <SetNodeToDecorations />
        <Editable
          decorate={decorate}
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
        <style>{prismThemeCss}</style>
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

  //* список обертаємо wrapper'ом
  if (!isActiveFormat && isList) {
    const block: CustomElement = { type: format, children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
  if (!isActiveFormat && isCode) {
    const block: CustomElement = { type: format, language: 'css', url:"", children: [] }
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
  const style = { textAlign: element.align }
  const editor = useSlateStatic()
  
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
      const setLanguage = (language: string) => {
        const path = ReactEditor.findPath(editor, element)
        Transforms.setNodes(editor, { language }, { at: path })
      }
      return (
        <pre>
          <code
            className={styles['code-block']}
            {...attributes}
            style={{ position: 'relative', display: "block" }}
            spellCheck={false}
          >
            <LanguageSelect
              value={element.language}
              onChange={e => setLanguage(e.target.value)}
            />
            {children}
          </code>
        </pre>
      )
    case 'code-line':
      return (
        <div {...attributes} style={{ position: 'relative' }}>
          {children}
        </div>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }

  //? const Tag = editor.isInline(element) ? 'span' : 'div'
  //? return (
  //?   <Tag {...attributes} style={{ position: 'relative' }}>
  //?     {children}
  //?   </Tag>
  //? )

}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {

  const { text, ...rest } = leaf
  
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

  return <span {...attributes} className={Object.keys(rest).join(' ')}>{children}</span>
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

const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node, path]) => {
      if (SlateElement.isElement(node) && node.type === CODE_LINE_TYPE) {
        const ranges = editor.nodeToDecorations?.get(node) || []
        return ranges
      }

      return []
    },
    [editor.nodeToDecorations]
  )
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CodeBlockElement>) => {
  const nodeToDecorations = new Map<SlateElement, Range[]>()

  const text = block.children.map(line => Node.string(line)).join('\n')
  const language = block.language
  const tokens = Prism.tokenize(text, Prism.languages[language])
  const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
  const blockChildren = block.children as SlateElement[]

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index]
    const element = blockChildren[index]

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, [])
    }

    let start = 0
    for (const token of tokens) {
      const length = token.content.length
      if (!length) {
        continue
      }

      const end = start + length

      const path = [...blockPath, index, 0]
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map(type => [type, true])),
      }

      nodeToDecorations.get(element)!.push(range)

      start = end
    }
  }

  return nodeToDecorations
}

// precalculate editor.nodeToDecorations map to use it inside decorate function then
const SetNodeToDecorations = () => {
  const editor = useSlate()

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: n => SlateElement.isElement(n) && n.type === CODE_BLOCK_TYPE,
    })
  )

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations)
  )

  editor.nodeToDecorations = nodeToDecorations

  return null
}

const useOnKeydown = (editor: Editor) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(
    e => {
      if (isHotkey('tab', e)) {
        // handle tab key, insert spaces
        e.preventDefault()

        Editor.insertText(editor, '  ')
      }
    },
    [editor]
  )

  return onKeyDown
}

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select
      data-test-id="language-select"
      contentEditable={false}
      className={styles['language-select']}
      {...props}
    >
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  )
}

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>()

  for (const m of maps) {
    for (const item of m) {
      map.set(...item)
    }
  }

  return map
}

const toChildren = (content: string) => [{ text: content }]

const toCodeLines = (content: string): SlateElement[] =>
  content
    .split('\n')
    .map(line => ({ type: CODE_LINE_TYPE, children: toChildren(line) }))


// Prismjs theme stored as a string instead of emotion css function.
// It is useful for copy/pasting different themes. Also lets keeping simpler Leaf implementation
// In the real project better to use just css file
const prismThemeCss = `
  /**
   * prism.js default theme for JavaScript, CSS and HTML
   * Based on dabblet (http://dabblet.com)
   * @author Lea Verou
   */

  code[class*="language-"],
  pre[class*="language-"] {
      color: black;
      background: none;
      text-shadow: 0 1px white;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      font-size: 1em;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      line-height: 1.5;

      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;

      -webkit-hyphens: none;
      -moz-hyphens: none;
      -ms-hyphens: none;
      hyphens: none;
  }

  pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
  code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
      text-shadow: none;
      background: #b3d4fc;
  }

  pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
  code[class*="language-"]::selection, code[class*="language-"] ::selection {
      text-shadow: none;
      background: #b3d4fc;
  }

  @media print {
      code[class*="language-"],
      pre[class*="language-"] {
          text-shadow: none;
      }
  }

  /* Code blocks */
  pre[class*="language-"] {
      padding: 1em;
      margin: .5em 0;
      overflow: auto;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
      background: #f5f2f0;
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
      padding: .1em;
      border-radius: .3em;
      white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
      color: slategray;
  }

  .token.punctuation {
      color: #999;
  }

  .token.namespace {
      opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
      color: #905;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
      color: #690;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
      color: #9a6e3a;
      /* This background color was intended by the author of this theme. */
      background: hsla(0, 0%, 100%, .5);
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
      color: #07a;
  }

  .token.function,
  .token.class-name {
      color: #DD4A68;
  }

  .token.regex,
  .token.important,
  .token.variable {
      color: #e90;
  }

  .token.important,
  .token.bold {
      font-weight: bold;
  }
  .token.italic {
      font-style: italic;
  }

  .token.entity {
      cursor: help;
  }
`


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
