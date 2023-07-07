import { RenderLeafProps } from "@/types/editor"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import styles from "./elements.module.css"
import { css } from "@emotion/css"
import React from "react"
import { Button } from "./ui"
import Icon from "./Icon"
import { Image } from "./Elements/Image"
import CodeBlock from "./Elements/CodeBlock"


export const RenderElement = (props) => {
  const { attributes, children, element } = props
  const style = { textAlign: element.align }
  const editor = useSlateStatic()

  switch (element.type) {

    case 'block-quote':
      return (
        <blockquote
          style={style}
          className={css`
            padding-left: 0.625rem;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            border-left-width: 2px;
            border-style: solid;
            border-color: #ddd;
            color: #aaa;
          `}
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'heading-one':
      return (
        <h1
          style={style}
          className={css`
            font-size: 3rem;
            line-height: 4rem;
            margin: 2rem 0;
          `}
          {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2
          style={style}
          className={css`
            font-size: 2rem;
            line-height: 2.5rem;
            margin: 2rem 0;
          `}
          {...attributes}>
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3
          style={style}
          className={css`
            font-size: 1.5rem;
            line-height: 2rem;
            margin: 2rem 0;
          `}
          {...attributes}>
          {children}
        </h3>
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
          className={css`
            list-style-type: decimal;
            margin: 1rem 0 1rem 2rem
          `}
          {...attributes}>
          {children}
        </ol>
      )
    case 'bulleted-list':
      return (
        <ul
          style={style}
          className={css`
            list-style-type: disc;
            margin: 1rem 0 1rem 2rem
          `}
          {...attributes}>
          {children}
        </ul>
      )
    case 'image':
      return <Image {...props} />
    case 'code-block':
      return <CodeBlock {...props} />
    case 'code-line':
      return (
        <div 
          className={css`
            display: block;
          `}
          {...attributes} 
          style={{ position: 'relative' }} 
        >
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
          margin: 2rem;

          :hover button {
            display: flex;
            align-items: center;
            border-radius: 5px;
            padding: 8px;
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
              background-color: white !important;
              color: red !important;
            `}
            data-tooltip-id="format-tooltip" data-tooltip-content="Прибрати"
          >
            <Icon icon="removeMedia" />
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

