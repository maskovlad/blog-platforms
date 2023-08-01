import { useRef, useState } from "react";
import { insertLink } from "../../utils/link.js";
import Button from "./Button";
import Icon from "../../ui/Icon"
import usePopup from "../../customHooks/usePopup";
import { BaseSelection, Transforms } from "slate";
import { css } from "@emotion/css";
import { useSlate } from "slate-react";
import { Location } from "slate";
import { isBlockActive } from "../../utils/toggleBlock";

const LinkButton = (props) => {

  const { hint } = props;
  const editor = useSlate()
  const linkInputRef = useRef(null);
  const [showInput, setShowInput] = usePopup(linkInputRef);
  const [url, setUrl] = useState("");
  const [showInNewTab, setShowInNewTab] = useState(false);
  const [selection, setSelection] = useState<BaseSelection>();
  const [leftPosition, setLeftPosition] = useState(false)

  const handleInsertLink = () => {
    Transforms.select(editor, selection as Location);
    insertLink(editor, { url, showInNewTab });
    setUrl("");
    // @ts-ignore
    setShowInput((prev) => !prev);
    setShowInNewTab(false);
  };

  const toggleLink = (e) => {

    // коригування позиції popup, коли він упирається в край вікна
    const buttonLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if (buttonLeftCoord < (documentWidth - 250)) setLeftPosition(true); else setLeftPosition(false)

    setSelection(editor.selection);
    // @ts-ignore
    setShowInput((prev) => !prev);
  };

  const handleInputChange = ({ target }) => {
    Transforms.deselect = () => { }
    if (target.type === "checkbox") {
      setShowInNewTab((prev) => !prev);
    } else {
      setUrl(target.value);
    }
  };

  return (
    <div ref={linkInputRef}
      className={css`
        display: inline;
        position: relative;
      `}
    >

      <Button
        // className={showInput ? css`border: 1px solid lightgray;border-bottom: none;` : ""}
        active={isBlockActive(editor, 'link')}
        onClick={toggleLink}
        hint={hint}
      >
        <Icon icon="link" />
      </Button>

      {showInput && (
        <div className={css`
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

                input {
                  border-radius: 3px;
                  padding: 0.2rem;
                }
              `}>

            <label>
              Вставте посилання
            </label>

            <input
              type="text"
              placeholder="https://google.com"
              value={url}
              onChange={handleInputChange}
            />

            <label>
              <input
                type="checkbox"
                checked={showInNewTab}
                onChange={handleInputChange}
              />
              <span style={{ fontSize: "0.8em", marginLeft: "4px" }}>Відкрити в новій вкладці</span>
            </label>

            <div
              onClick={handleInsertLink}
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
  );
};

export default LinkButton;
