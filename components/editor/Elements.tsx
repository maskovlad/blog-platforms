import { RenderLeafProps } from "@/types/editor"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import styles from "./Elements.module.css"
import {css} from "@emotion/css"


export const RenderElement = ({ attributes, children, element }) => {
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
        <pre className={prismThemeCss}>
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
}

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {

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

  return <span
    {...attributes}
    className={Object.keys(rest).join(' ')}
  >{children}</span>
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

// Prismjs theme stored as a string instead of emotion css function.
// It is useful for copy/pasting different themes. Also lets keeping simpler Leaf implementation
// In the real project better to use just css file
const prismThemeCss = css`
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
