import { css, cx } from "@emotion/css"
import { Transforms, Element as SlateElement } from "slate"
import { ReactEditor, useSelected, useFocused, useSlate } from "slate-react"
import { AdditionalInput } from "../ui/AdditionalInput"
import { Button } from "../ui/ui"
import useResize from "../customHooks/useResize";
import Icon from "../ui/Icon"
import { ImageElement } from "@/types/editor"
import { useEffect, useState } from "react"

export const Image = ({ attributes, children, element }) => {
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, element)
  const selected = useSelected();
  const focused = useFocused();
  const { width, height, ratio } = element
  const [imgWidth, setImgWidth] = useState<number>(width)
  const [imgHeight, setImgHeight] = useState<number>(height)
  const [imgRatio, setImgRatio] = useState<number>(ratio)
  const [size, onMouseDown, resizing] = useResize(imgWidth, imgHeight, imgRatio );

  // console.log(
  //   {
  //     width:width?width:"null",
  //     height:height?height:"null",
  //     ratio:ratio?ratio:"null",
  //   })
    
  const onImageLoad = async (e) => {
    const w = +e.target?.naturalWidth
    const h = +e.target?.naturalHeight
    if (!width) setImgWidth(w)
    if (!height) setImgHeight(h)
    if (!ratio) setImgRatio(w/h)
  }

  useEffect(() => {
    if (!resizing) {
      //@ts-ignore
      setImgWidth(size.width); setImgHeight(size.height)
    }
  }, [resizing])

  useEffect(() => {
    const path = ReactEditor.findPath(editor, element)
    const newProperties = {
      width: imgWidth,
      height: imgHeight,
      ratio: imgRatio,
    }
    Transforms.setNodes<ImageElement>(editor, newProperties, {
      at: path,
    })
  }, [imgWidth, imgHeight])

  const inputHandler = (val) => {
    const path = ReactEditor.findPath(editor, element)
    const newProperties = {
      description: val,
    }
    Transforms.setNodes<ImageElement>(editor, newProperties, {
      at: path,
    })
  }

  // console.log({ imgWidth, imgHeight, imgRatio })

  return (
    <div className={cx("img-wrapper", css`
        width: fit-content;
        margin: 2rem;
        border: 2px solid transparent;
        ${element.float ? "float:" + element.float + ";" : null}
        ${selected && focused && "border: 2px solid var(--c-grey);"}

        img {
          width: 100%;
          height: 100%;
        }
      `)}
      {...attributes}
      contentEditable={false}
    >
      {children}

      <div
        data-expeditor="image-size"
        className={css`
          position: relative;
          display: flex;
          border-radius: 5px;
          max-width: 90vw;
          max-height: 90vh;
          margin-bottom: 0.5rem;

          :hover,:focus {
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
        {element.href
          ? <a href={element.href}>
            <img
              src={element.url}
              alt={element.description}
              onLoad={onImageLoad}
            />
          </a>
          : <img
            src={element.url}
            alt={element.description}
            onLoad={onImageLoad}
          />
        }
        <button
          // @ts-ignore
          onMouseDown={onMouseDown}
          className={cx("resize-btn", css`
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
          data-tooltip-id="format-tooltip" data-tooltip-content="Змінити розмір. CTRL - зберігати початкове співвідношення сторін"
        >
          <Icon icon="resize" />
        </button>
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={cx("remove-btn", css`
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
        hint="Використовується також для тегу alt"
      />
    </div>
  )
}


