import { css, cx } from "@emotion/css"
import { Transforms, Element as SlateElement } from "slate"
import { ReactEditor, useSlateStatic, useSelected, useFocused } from "slate-react"
import { AdditionalInput, Button } from "../ui"
import useResize from "../customHooks/useResize";
import Icon from "../Icon"

export const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize();

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
    <div className={css`
        width: fit-content;
        margin: 2rem;

        img {
          width: 100%;
          height: 100%;
        }
      `} 
      {...attributes}>
      {children}
      
      <div contentEditable={false}
        data-expeditor="image-size"
        className={css`
          position: relative;
          display: flex;

          :hover {
            box-shadow: 0 0 3px 3px lightgray;
          }

          :hover button.remove-btn,
          :hover button.resize-btn {
              display: flex;
              align-items: center;
              border-radius: 5px;
            }
        `}
        style={{
        // @ts-ignore
          width: size.width, height: size.height
        }}
      >
        <img
          src={element.url}
          alt={element.description}
          // className={css`
          //   display: block;
          //   max-width: 100%;
          //   max-height: 20em;
          //   border-radius: 5px;

          //   :hover, :focus, :active {
          //     box-shadow: 0 0 0 3px #B4D5FF;
          //   }
          // `}
        />
          <button
          // @ts-ignore
            onMouseDown={onMouseDown}
            className={cx("resize-btn",css`
              display: none;
              position: absolute;
              right: 0;
              bottom: 0;
              width: 15px;
              height: 15px;
              opacity: 1;
              background: transparent;
              cursor: nwse-resize;
              padding: 0;
            `)}
            style={{
              
            }}
          >
            <Icon icon="resize" />
          </button>
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={cx("remove-btn",css`
            display: none;
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white !important;
            color: red !important;
            padding: 8px;
          `)}
          data-tooltip-id="format-tooltip" data-tooltip-content="Прибрати"
        >
          <Icon icon="removeMedia" />
        </Button>

      </div>
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
  )
}

