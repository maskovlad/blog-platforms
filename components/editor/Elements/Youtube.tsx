import { css } from "@emotion/css"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Transforms } from "slate"
import { Button } from "../ui/ui"
import Icon from "../ui/Icon"


const Youtube = (props) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
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
}

export default Youtube