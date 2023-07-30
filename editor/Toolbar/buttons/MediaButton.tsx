import Button from './Button'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { insertImage } from "../../utils/insertImage"
import { insertYoutube } from "../../utils/insertYoutube"
import Icon from "../../ui/Icon"
import { BaseSelection, } from 'slate'
import { useRef, useState } from 'react'
import usePopup from "../../customHooks/usePopup"
import { css } from '@emotion/css'

export const MediaButton = ({ format, hint }) => {
  const editor = useSlateStatic()
  const urlInputRef = useRef(null);
  const [showInput, setShowInput] = usePopup(urlInputRef);
  const [url, setUrl] = useState<string>("");
  const [href, setHref] = useState<string>("");
  const [float, setFloat] = useState<string>("");
  const [selection, setSelection] = useState<BaseSelection>();
  const [leftPosition, setLeftPosition] = useState(false)


  const handleButtonClick = (e) => {
    e.preventDefault();
    // коригування позиції popup, коли він упирається в край вікна
    const buttonLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if (buttonLeftCoord < (documentWidth - 250)) setLeftPosition(true); else setLeftPosition(false)

    setSelection(editor.selection);
    selection && ReactEditor.focus(editor);
    // @ts-ignore
    setShowInput((prev) => !prev);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // selection && Transforms.select(editor, selection);
    // selection && ReactEditor.focus(editor);
    if (!url) return
    if (format === "image") insertImage(editor, url, href, float)
    else if (format === "youtube") insertYoutube(editor, url)
    // @ts-ignore
    setShowInput(false); setUrl(""); setHref(""); setFloat("");
  };


  // const handleImageUpload = () => {
  //   // @ts-ignore
  //   setShowInput(false);
  // };

  return (
    <div
      ref={urlInputRef}
      className={css`
        display: inline;
        position: relative;
      `}
    >
      <Button
        onClick={handleButtonClick}
        hint={hint}
      >
        <Icon icon={format} />
      </Button>

      {showInput && (
        <div 
          className={css`
            position: absolute;
            ${leftPosition ? "left: 0;" : "right: 0;"}
            background-color: var(--c-lightgrey);
            padding: 6px 10px;
            border: 1px solid var(--c-cyan);
            border-radius: 5px;
            height: fit-content;
            z-index: 234;
          `}>

          <div
            className={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                font-size: 14px;

                label {
                  font-size: 0.8rem;
                  line-height: 1rem;
                }

                input {
                  border-radius: 3px;
                  padding: 0.2rem;
                }
              `}
          >

            <label>Вставте посилання на медіафайл сюди або в будь-яке місце допису АБО перетягніть медіафайл в потрібне місце</label>
            <input
              type="text"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <label>Якщо потрібно, додайте адресу, на яку вестиме це зображення</label>
            <input
              type="text"
              placeholder="https://..."
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />

            <div className={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}>
              <label>Обтікання медіа текстом (вставляти медіа необхідно на початку або всередині тексту)</label>
              <div className={css`
                display: flex;
                gap: 1rem
              `}>
                <label>
                  <input
                    type="radio"
                    className={css``}
                    name="float"
                    value="left"
                    onChange={() => setFloat("left")}
                    checked={
                      float
                        ? float === "left" ? true : false
                        : false
                    }
                  />
                  {" "}Справа
                </label>
                <label>
                  <input
                    type="radio"
                    className={css``}
                    name="float"
                    value="right"
                    onChange={() => setFloat("right")}
                    checked={
                      float
                        ? float === "right" ? true : false
                        : false
                    }
                  />
                  {" "}Зліва
                </label>
              </div>
            </div>

            <div
              onClick={handleSubmit}
              className={css`
                background-color: var(--c-green);
                color: white;
                border-radius: 5px;
                padding: 0.4rem;
                cursor: pointer;
              `}>
              Додати
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
