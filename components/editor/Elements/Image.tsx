import { css } from "@emotion/css"
import { Transforms, Element as SlateElement } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { AdditionalInput, Button } from "../ui"
import Icon from "../Icon"

export const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  console.log({element,path})

  const inputHandler = (val) => {
    const path = ReactEditor.findPath(editor, element)
    const newProperties: Partial<SlateElement> = {
      description: val,
    }
    Transforms.setNodes<SlateElement>(editor, newProperties, {
      at: path,
    })
  }

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
          alt={element.description}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            border-radius: 5px;

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
          <Icon icon="removeMedia" />
        </Button>

        <AdditionalInput 
          prop={element.description} 
          onChange={inputHandler} 
          className={css`
            background-color: transparent;
            color: var(--c-grey);
            width: 100%;
            margin-left: 1rem;
          `}
          placeholder="Додайте опис зображення..."
        />
      </div>
    </div>
  )
}


