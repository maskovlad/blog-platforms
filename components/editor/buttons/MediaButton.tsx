import { Button } from '@/components/editor/ui/ui'
import { toast, Toaster } from 'react-hot-toast'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { insertImage } from "../utils/insertImage"
import { insertYoutube } from "../utils/insertYoutube"
import Icon from "../ui/Icon"
import { BaseSelection, } from 'slate'
import { Editor } from 'slate'
import { useRef, useState } from 'react'
import usePopup from "../customHooks/usePopup"
import { css } from '@emotion/css'

export const MediaButton = ({ format, hint }) => {
  const editor = useSlateStatic()
  const urlInputRef = useRef(null);
  const [showInput, setShowInput] = usePopup(urlInputRef);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [selection, setSelection] = useState<BaseSelection>();


  const handleButtonClick = (e) => {
    e.preventDefault();
    
    setSelection(editor.selection);
    selection && ReactEditor.focus(editor);
    // @ts-ignore
    setShowInput((prev) => !prev);
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();

    // selection && Transforms.select(editor, selection);
    // selection && ReactEditor.focus(editor);
    if (!url) return
    if (format === "image") insertImage(editor, url)
    else if (format === "youtube") insertYoutube(editor, url)
    // @ts-ignore
    setShowInput(false);
    setUrl(undefined);
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
        data-tooltip-id="format-tooltip" data-tooltip-content={hint}
      >
        <Icon icon={format} />
      </Button>

      {showInput && (
        <div className={css`
            position: absolute;
            left: 0;
            background-color: var(--c-lightgrey);
            padding: 6px 10px;
            border: 1px solid var(--c-cyan);
            border-radius: 5px;
            height: fit-content;
            z-index: 234;
          `}>

          {/* {format === "image" && (
              <div>
                <div
                  style={{ display: "flex", gap: "10px" }}
                  onClick={handleImageUpload}
                >
                  <Icon icon="upload" />
                  <span>Upload</span>
                </div>
                <p style={{ textAlign: "center", opacity: "0.7", width: "100%" }}>
                  OR
                </p>
              </div>
            )} */}

          <form
            onSubmit={handleFormSubmit}
            className={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                font-size: 14px;

                input {
                  border-radius: 3px;
                  padding: 0.2rem;
                }

                button {
                  background-color: var(--c-green);
                  color: white;
                  border-radius: 5px;
                  padding: 0.4rem;
                  cursor: pointer;
                }
              `}>
            <label>
              Вставте посилання сюди або в будь-яке місце допису
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
            >
              Додати
            </button>
          </form>

        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />

    </div>
  )
}
