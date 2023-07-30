import React, { useRef, useState } from "react";
import { useFocused, useSelected, useSlate } from "slate-react";
import { removeLink } from "../utils/link.js";
import { css } from "@emotion/css";
import usePopup from "../customHooks/usePopup";

const Link = ({ attributes, element, children }) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const settingsRef = useRef(null)

  const [leftPosition, setLeftPosition] = useState(false)
  const [showSettings, setShowSettings] = usePopup(settingsRef)

  const mouseDown = (e) => {
    // коригування позиції popup, коли він упирається в край вікна
    const textLinkLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if ((textLinkLeftCoord + 370) < documentWidth) setLeftPosition(true); else setLeftPosition(false)
  }

  const onClick = () => {
    setShowSettings(prev => !prev)
  }

  return (
    <span
      ref={settingsRef}
      onMouseDown={mouseDown}
      onClick={onClick}
      className={css`
      display: inline;
      position: relative;
    `}>
      <a
        href={element.href}
        {...attributes}
        {...element.attr}
        target={element.target}
        className={css`
          color: var(--c-blue);
          cursor: context-menu;
        `}
      >
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </a>

      {showSettings && (
        <span className={css`
          position: absolute;
          ${leftPosition ? "left: 0;" : "right: 0;"}
          display: flex;
          align-items: center;
          background-color: var(--c-lightgrey);
          border: 1px solid var(--c-cyan);
          border-radius: 5px;
          padding: 6px 10px;
          gap: 10px;
          border-radius: 6px;
          border: 1px solid lightgray;
          width: fit-content;
          z-index: 1;
          font-size: 0.8rem; 

          img{
            height: 13px;
          }

          a {
            max-width: 300px;
          }
        `}
          contentEditable={false}>

          <a href={element.url} target={element.target}>
            {element.url}
          </a>
          <button
            style={{
              display: "flex",
              background: "var(--c-white)",
              padding: 5,
              borderRadius: 5,
              cursor: "pointer",
            }}
            onClick={() => removeLink(editor)}
            data-tooltip-id="format-tooltip" data-tooltip-content="Прибрати"
          >
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="unlink" className={css`color:red;width: 15px;height: auto;`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304.083 405.907c4.686 4.686 4.686 12.284 0 16.971l-44.674 44.674c-59.263 59.262-155.693 59.266-214.961 0-59.264-59.265-59.264-155.696 0-214.96l44.675-44.675c4.686-4.686 12.284-4.686 16.971 0l39.598 39.598c4.686 4.686 4.686 12.284 0 16.971l-44.675 44.674c-28.072 28.073-28.072 73.75 0 101.823 28.072 28.072 73.75 28.073 101.824 0l44.674-44.674c4.686-4.686 12.284-4.686 16.971 0l39.597 39.598zm-56.568-260.216c4.686 4.686 12.284 4.686 16.971 0l44.674-44.674c28.072-28.075 73.75-28.073 101.824 0 28.072 28.073 28.072 73.75 0 101.823l-44.675 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.598 39.598c4.686 4.686 12.284 4.686 16.971 0l44.675-44.675c59.265-59.265 59.265-155.695 0-214.96-59.266-59.264-155.695-59.264-214.961 0l-44.674 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.597 39.598zm234.828 359.28l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941L63.598 7.029c-9.373-9.373-24.569-9.373-33.941 0L7.029 29.657c-9.373 9.373-9.373 24.569 0 33.941l441.373 441.373c9.373 9.372 24.569 9.372 33.941 0z"></path></svg>
          </button>

        </span>
      )}
    </span>
  );
};

export default Link;

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
      font-size: 0;
    `}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)
