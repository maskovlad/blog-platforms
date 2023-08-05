import React, { useRef, useState } from "react";
import { MdCheck } from "@react-icons/all-files/md/MdCheck";
import { colors } from "./defaultColors.js";
import { BaseSelection, Transforms } from "slate";
import usePopup from "../../customHooks/usePopup";
import { ReactEditor, useSlate } from "slate-react";
import { css } from "@emotion/css";
import { Editor } from "slate";
import { activeMark } from "../../utils/toggleMark";
import Button from "@/editor/Toolbar/buttons/Button";

const SvgFormatColorText = () => {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path fillOpacity=".36" d="M0 20h24v4H0z"></path>
      <path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"></path></svg>  
  )
}

const SvgFormatColorFill = () => {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"></path>
      <path fillOpacity=".36" d="M0 20h24v4H0z"></path></svg>
  )
}

const logo = {
  color: <SvgFormatColorText />,
  bgColor: <SvgFormatColorFill />,
};


const ColorPicker = ({ format, hint }) => {
  const editor = useSlate()
  const [selection, setSelection] = useState<BaseSelection>();
  const [hexValue, setHexValue] = useState("");
  const [validHex, setValidHex] = useState("");
  const colorPickerRef = useRef(null);
  const [showOptions, setShowOptions] = usePopup(colorPickerRef);

  const isValideHexSix = new RegExp("^#[0-9A-Za-z]{6}");
  const isValideHexThree = new RegExp("^#[0-9A-Za-z]{3}");

  const changeColor = (e) => {
    const clickedColor = e.target.getAttribute("data-value");
    selection && Transforms.select(editor, selection);
    selection && ReactEditor.focus(editor);

    addMarkData(editor, { format, value: clickedColor });
    //@ts-ignore
    setShowOptions(false);
  };

  const toggleOption = () => {
    setSelection(editor.selection);
    selection && ReactEditor.focus(editor);

    //@ts-ignore
    setShowOptions((prev) => !prev);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validHex) return;
    selection && Transforms.select(editor, selection);

    addMarkData(editor, { format, value: hexValue });
    //@ts-ignore
    setShowOptions(false);
    setValidHex("");
    setHexValue("");
    selection && ReactEditor.focus(editor);
  };

  const handleHexChange = (e) => {
    e.preventDefault();
    const newHex = e.target.value;
    //@ts-ignore
    setValidHex(isValideHexSix.test(newHex) || isValideHexThree.test(newHex));
    setHexValue(newHex);
  }

  return (
    <div 
      className={css`
        display: flex;
        align-items: center;
        position: relative;
        padding:0;
        cursor: pointer;

        form{
          display: flex;
          align-items: center;
          column-gap: 5px;
          width: 100%;
        }

        input{
          width: 65%;
          height:1.3em;
          border:1px solid lightgray;
          border-radius: 5px;
          padding-left:5px
        }
        input:focus{
          outline: none;
        }

        button{
          margin:0;
          padding:0;
          cursor: pointer;
        }
      `}
      ref={colorPickerRef}>

      <button
        style={{
          color: showOptions ? "black" : activeMark(editor, format),
          width: '20px',
          height: '20px',
          background: "transparent",
          display: 'flex',
          alignItems: "center",
          cursor: "pointer",
        }}
        className={css`
          // display: flex;
          // align-items: center;
          // background: transparent;
          ${showOptions ? "border: 1px solid lightgray;border-bottom: none;" : ""}
        `}
        onClick={toggleOption}
        data-tooltip-id="format-tooltip" data-tooltip-content={hint}
      >
        {logo[format]}
      </button>

      {showOptions && (
        <div className={css`
          position: absolute;
          left: 0;
          top: 25px;
          background-color: var(--c-lightgrey);
          padding: 6px 10px;
          border: 1px solid var(--c-cyan);
          border-radius: 5px;
          height: fit-content;
          z-index: 123;
        `}>
          <div className={css`
            display: grid;
            grid-template-columns: auto auto auto auto auto auto auto;
            align-items: center;
            gap: 5px;
          `}>

            {colors.map((color, index) => {
              return (
                <div
                  key={index}
                  data-value={color}
                  onClick={changeColor}
                  className={css`
                    width: 16px;
                    height: 16px;
                    background-color: #000000;
                    border: 1px solid black;
                  `}
                  style={{ background: color }}
                ></div>
              );
            })}
          </div>

          <p style={{ textAlign: "center", opacity: "0.7", width: "100%" }}>
            АБО
          </p>

          <form onSubmit={handleFormSubmit}>
            <div
              className={css`
                width: 16px;
                height: 16px;
                background-color: #000000;
              `}
              style={{ background: validHex ? hexValue : "#000000" }}
            ></div>

            <input
              type="text"
              placeholder="#000000"
              value={hexValue}
              onChange={handleHexChange}
              style={{
                border:
                //@ts-ignore
                  validHex === false ? "1px solid red" : "1px solid lightgray",
              }}
            />

            <button style={{ color: validHex ? "green" : "" }} type={"submit"}>
              <MdCheck size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

export const addMarkData = (editor, data) => {
  Editor.addMark(editor, data.format, data.value);
};

