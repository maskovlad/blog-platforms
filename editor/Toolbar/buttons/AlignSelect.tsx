import usePopup from "../../customHooks/usePopup";
import { useEffect, useRef, useState } from "react";
import { BaseSelection } from "slate";
import { useSlate } from "slate-react";
import { css } from "@emotion/css";
import Button from "./Button";
import Icon from "@/editor/ui/Icon";
import alignLeftIco from "../toolbarIcons/align-left.svg"
import alignCenterIco from "../toolbarIcons/align-center.svg"
import alignRightIco from "../toolbarIcons/align-right.svg"
import alignJustifyIco from "../toolbarIcons/align-justify.svg"
import { isBlockActive, toggleBlock } from "@/editor/utils/toggleBlock";

type TextAlign = 'left' | 'center' | 'right' | 'justify'
const TEXT_ALIGN_TYPES: TextAlign[] = ['left', 'center', 'right', 'justify']

type BlockOption = {
  id: number;
  format: TextAlign;
  ico: string;
  title: string;
}

const blockOptions: BlockOption[] = [
  {
    id: 1,
    format: "left",
    ico: alignLeftIco.src,
    title: "Зліва",
  },
  {
    id: 2,
    format: "center",
    ico: alignCenterIco.src,
    title: "По центру",
  },
  {
    id: 3,
    format: "right",
    ico: alignRightIco.src,
    title: "Зправа",
  },
  {
    id: 4,
    format: "justify",
    ico: alignJustifyIco.src,
    title: "По ширині",
  },
]

export default function AlignSelect() {

  const editor = useSlate()
  const dialogRef = useRef(null);
  const [showDialog, setShowDialog] = usePopup(dialogRef);
  const [leftPosition, setLeftPosition] = useState(false)
  const [activeFormat, setActiveFormat] = useState<TextAlign | undefined>(undefined)

  useEffect(()=>{
    TEXT_ALIGN_TYPES.map((item)=>{
      if(isBlockActive(editor, item, "align")) {
        setActiveFormat(item)
        return
      }
    })
  },[editor.selection])

  const handleShowDialog = (e) => {
    // коригування позиції popup, коли він упирається в край вікна
    const buttonLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if (buttonLeftCoord < (documentWidth - 250)) setLeftPosition(true); else setLeftPosition(false)
    
    setShowDialog((prev) => !prev)
  }
  
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
        <Icon icon={activeFormat ? activeFormat : "left"} />
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

          {blockOptions.map((item)=>(
            <button 
              key={item.id}
              value={item.format}
              onClick={formatClick}
              className={css`
                width: 100%;
                display: flex;
                gap: 0.5rem;
                padding: 0 3px 0 30px;
                text-wrap: nowrap;
                font-size: 0.9rem;
                cursor: ${activeFormat===item.format ? "not-allowed" : "pointer"};
                background-image: url(${item.ico});
                background-repeat: no-repeat;
                background-color: transparent;
                background-position-x: 2px;
                border: 1px solid transparent;
                transition: all 0.2s;

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