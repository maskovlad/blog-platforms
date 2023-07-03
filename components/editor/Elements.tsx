import { RenderLeafProps } from "@/types/editor"
import { Element as SlateElement, Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import styles from "./Elements.module.css"
import { css } from "@emotion/css"
import React from "react"
import { Button, Icon } from "./components"


export const RenderElement = (props) => {
  const { attributes, children, element } = props
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
    case 'image':
      return <Image {...props} />
    case 'code-block':
      const { url } = element

      const setLanguage = (language: string) => {
        const path = ReactEditor.findPath(editor, element)
        Transforms.setNodes(editor, { language }, { at: path })
      }
      return (
        <pre className={prismThemeCss} style={{ margin: "2rem auto", maxWidth: "800px" }}>
          <code
            className={styles['code-block']}
            {...attributes}
            style={{ height: "auto", maxHeight: "800px", overflow: "scroll", display: "block" }}
            spellCheck={false}
          >

            <div className={styles['code-block_head']}>
              <div contentEditable={false} className={styles['code-block_file']}>
                FILE:
                <UrlInput
                  url={url}
                  onChange={val => {
                    const path = ReactEditor.findPath(editor, element)
                    const newProperties: Partial<SlateElement> = {
                      url: val,
                    }
                    Transforms.setNodes<SlateElement>(editor, newProperties, {
                      at: path,
                    })
                  }}
                />
              </div>
              <LanguageSelect
                value={element.language}
                onChange={e => setLanguage(e.target.value)}
              />
            </div>

            <div className={styles['code-line_wrapper']}>{children}</div>
          </code>
        </pre>
      )
    case 'code-line':
      return (
        <div {...attributes} style={{ position: 'relative' }} className={styles['code-line']}>
          {children}
        </div>
      )
    case 'youtube':
      const path = ReactEditor.findPath(editor, element)
      return (
        <div 
          {...attributes} 
          contentEditable={false}
          className={css`
          position: relative;
          :hover span {
            display: inline;
          }
        `}
        >
          <iframe
            contentEditable={false}
            title="Youtube video"
            src={`https://www.youtube.com/embed/${element?.videoId}`}
            frameBorder="0"
            className={css`
            width: 75vw;
            aspect-ratio: 2;
          `}
          ></iframe>
          {children}
          <Button
            active
            onClick={() => Transforms.removeNodes(editor, { at: path })}
            className={css`
              display: none;
              position: absolute;
              top: 0.5em;
              left: 0.5em;
              background-color: white;
              color: red !important;
            `}
            data-tooltip-id="format-tooltip" data-tooltip-content="Прибрати"
          >
            <Icon>delete</Icon>
          </Button>

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

const UrlInput = ({ url, onChange }) => {
  const [value, setValue] = React.useState(url || "")
  return (
    <input
      value={value}
      onClick={e => e.stopPropagation()}
      style={{ boxSizing: 'border-box', }}
      onChange={e => {
        const newUrl = e.target.value
        setValue(newUrl)
        onChange(newUrl)
      }}
    />
  )
}

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}
        className={css`
          position: relative;
          :hover span {
            display: inline;
          }
        `}
      >
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            :hover, :focus, :active {
              box-shadow: 0 0 0 3px #B4D5FF;
            }
          `}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: none;
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
            color: red !important;
          `}
          data-tooltip-id="format-tooltip" data-tooltip-content="Прибрати"
        >
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
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
      color: #555;
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

  @media print {
      code[class*="language-"],
      pre[class*="language-"] {
          text-shadow: none;
      }
  }
  ::-webkit-scrollbar {
  display: none;
}

  /* Code blocks */
  pre[class*="language-"] {
      padding: 1em;
      margin: .5em 0;
      overflow: auto;
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
      color: #d9d9d9;
  }

  .token.plain {
    color: #333;
  }

  .token.punctuation {
      color: #666;
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
      color: #080;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
      color: #b96400;
      /* This background color was intended by the author of this theme. */
      /* background: hsla(0, 0%, 100%, .5); */
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
      color: #0078a9;
  }

  .token.function,
  .token.class-name {
      color: #b91637;
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
