import { RenderLeafProps } from "@/types/editor"
import { css } from "@emotion/css"
import React from "react"
import { Image } from "./Image"
import CodeBlock from "./CodeBlock"
import Link from "./Link"
import Youtube from "./Youtube"


export const RenderElement = (props) => {
  const { attributes, children, element } = props
  const style = { textAlign: element.align }

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
    case 'link':
      return <Link {...props} />      
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
      return <Youtube {...props} />
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
    children = <code style={{ fontSize: "1rem" }}>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u style={{ textDecoration: "underline" }}>{children}</u>
  }

  if (leaf.strikethrough) {
    children = (
      <span style={{ textDecoration: "line-through" }}>{children}</span>
    );
  }

  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }

  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  if (leaf.bgColor) {
    children = (
      <span style={{ backgroundColor: leaf.bgColor }}>{children}</span>
    );
  }

  return <span
    {...attributes}
    className={Object.keys(rest).join(' ')}
  >{children}</span>
}


