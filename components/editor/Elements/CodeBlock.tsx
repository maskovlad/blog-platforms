import { css, cx } from '@emotion/css'
import React from 'react'
import { Transforms, Element as SlateElement } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import styles from "../elements.module.css"
import { AdditionalInput } from '../ui'

const CodeBlock = ({ attributes, children, element }) => {

  const editor = useSlateStatic()

  const { url } = element

  const setLanguage = (language: string) => {
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes(editor, { language }, { at: path })
  }

  const inputHandler = (val) => {
    const path = ReactEditor.findPath(editor, element)
    const newProperties: Partial<SlateElement> = {
      url: val,
    }
    Transforms.setNodes<SlateElement>(editor, newProperties, {
      at: path,
    })
  }


  return (
    <pre className={cx(
      prismThemeCss,
      css`
        margin: 2rem auto;
        max-width: 800px;
      `)}
    >
      <code className={css`
          font-family: monospace;
          font-size: 16px;
          line-height: 20px;
          margin: 0 auto;
          border: 1px solid var(--c-grey);
          border-radius: 5px;
          width: 100%;
          background: #9ea4b0;

          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #999faf;
            box-shadow: -2px -2px 3px grey;
          }
          ::-webkit-scrollbar-thumb {
            background-color: var(--c-grey);
          }
          ::-webkit-scrollbar-track {
            background-color: #999faf;
          }

          @media (max-width: 450px) {
            font-size: 13px;
            line-height: 15px;
          }
        `}
        {...attributes}
        style={{ height: "auto", maxHeight: "800px", overflow: "scroll", display: "block" }}
        spellCheck={false}
      >

        <div className={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background-color: #999faf;
          box-shadow: 0px 2px 2px grey;
        `}>
          <div contentEditable={false} className={css`
            overflow: hidden;
            color: var(--c-blue);
            border: 1px solid var(--c-grey);
            border-radius: 5px;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 5px;
            line-height: 1.5rem;
            margin-right: 1rem;

            @media (max-width: 450px) {
              line-height: 1.3rem;
            }
          `}>
            FILE:
            <AdditionalInput
              prop={url}
              onChange={inputHandler}
              className={css`
                background-color: transparent;
                color: var(--c-grey);
                width: 100%;
                margin-left: 1rem;
              `}
              placeholder="Додайте ім&apos;я файлу..."
            />
          </div>
          <LanguageSelect
            value={element.language}
            onChange={e => setLanguage(e.target.value)}
          />
        </div>

        <div className={css`display: block; padding: 1rem;`}>{children}</div>
      </code>
    </pre>
  )
}

export default CodeBlock

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select
      data-test-id="language-select"
      contentEditable={false}
      className={css`
        z-index: 1;
        color: var(--c-blue);
        background-color: transparent;
        cursor: pointer;
        border: 1px solid var(--c-grey);
        border-radius: 5px;
      `}
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
