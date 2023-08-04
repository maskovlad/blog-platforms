import usePopup from "../../customHooks/usePopup";
import { useEffect, useRef, useState } from "react";
import { useSlate } from "slate-react";
import { css } from "@emotion/css";
import Button from "./Button";
import Icon from "@/editor/ui/Icon";
import headingOne from "../toolbarIcons/headingOne.svg"
import headingTwo from "../toolbarIcons/headingTwo.svg"
import headingThree from "../toolbarIcons/headingThree.svg"
import { isBlockActive, toggleBlock } from "@/editor/utils/toggleBlock";

type Heading = "heading-one" | "heading-two" | "heading-three" | "heading-four" | "heading-five" | "heading-six"
const HeadingTypes: Heading[] = ["heading-one", "heading-two", "heading-three", "heading-four", "heading-five", "heading-six"]

type BlockOption = {
  id: number;
  format: Heading;
  ico: string;
  title: string;
  fontSize: {fontSize: number};
}

const blockOptions: BlockOption[] =[
  {
    id: 1,
    format: "heading-one",
    ico: headingOne.src,
    title: "Заголовок 1",
    fontSize: {fontSize: 16},
  },
  {
    id: 2,
    format: "heading-two",
    ico: headingTwo.src,
    title: "Заголовок 2",
    fontSize: {fontSize: 14},
  },
  {
    id: 3,
    format: "heading-three",
    ico: headingThree.src,
    title: "Заголовок 3",
    fontSize: {fontSize: 12},
  },
]

export default function HeadingSelect() {
  const editor = useSlate()
  const dialogRef = useRef(null);
  const [showDialog, setShowDialog] = usePopup(dialogRef);
  const [leftPosition, setLeftPosition] = useState(false)
  const [activeFormat, setActiveFormat] = useState<Heading | undefined>(undefined)

  const handleShowDialog = (e) => {
    // коригування позиції popup, коли він упирається в край вікна
    const buttonLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if (buttonLeftCoord < (documentWidth - 250)) setLeftPosition(true); else setLeftPosition(false)

    setShowDialog((prev) => !prev)
  }

  useEffect(() => {
    HeadingTypes.map((item) => {
      if (isBlockActive(editor, item)) {
        setActiveFormat(item)
        return
      }
    })
  }, [editor.selection])


  const formatClick = (e) => {
    setActiveFormat(e.target.value)
    toggleBlock(editor, e.target.value)
    setShowDialog(false)
  }

  return (
    <div ref={dialogRef}
      className={css`
        display: inline;
        position: relative;
      `}
    >

      <Button
        className={css`
          ${showDialog ? "border: 1px solid lightgray;border-bottom: none;" : ""}
          ::after {
            content: "⬇️";
            position: absolute;
            left: 13px;
            top: 13px;
            font-size: 8px;
          }
        `}
        active={!!activeFormat}
        onClick={handleShowDialog}
        hint={`Вирівнювання тексту: ${activeFormat}`}
      >
        <Icon icon={activeFormat ? activeFormat : "heading-one"} />
      </Button>

      {showDialog && (
        <div className={css`
            position: absolute;
            ${leftPosition ? "left: 0;" : "right: 0;"}
            background-color: var(--c-lightgrey);
            padding: 2px 0;
            border: 1px solid var(--c-cyan);
            border-radius: 5px;
            height: fit-content;
            z-index: 234;
            display: flex;
            flex-direction: column;
        `}>

          {blockOptions.map((item) => (
            <button
              key={item.id}
              value={item.format}
              onClick={formatClick}
              style={item.fontSize}
              className={css`
                width: 100%;
                display: flex;
                gap: 0.5rem;
                padding: 0 3px 0 30px;
                text-wrap: nowrap;
                font-size: 0.9rem;
                cursor: ${activeFormat === item.format ? "not-allowed" : "pointer"};
                background-image: url(${item.ico});
                background-repeat: no-repeat;
                background-color: transparent;
                background-position-x: 2px;
                border: 1px solid transparent;
                transition: all 0.2s;
                line-height: 1.5rem;

                :hover {
                  border: 1px solid var(--c-grey);
                }
                :disabled {
                  color: var(--c-grey);
                }
              `}
              disabled={activeFormat === item.format}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

    </div>
  )

}