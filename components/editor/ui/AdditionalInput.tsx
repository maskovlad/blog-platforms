import { css } from "@emotion/css"
import { useState } from "react"

export const AdditionalInput = ({ prop, onChange, className, placeholder, hint }) => {
  const [value, setValue] = useState(prop || "")
  return (
    <label 
      className={css`
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
      font-size: 12px;

      :hover input,input:focus {
        box-shadow: 0 0 3px 3px lightgray;
      }
    `}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      ✏️
      <input
        name="prop"
        className={className}
        value={value}
        onClick={e => e.stopPropagation()}
        style={{
          boxSizing: 'border-box',
          fontSize: "14px",
          lineHeight: "2rem",
          fontStyle: "italic",
          textAlign: "center",
          borderRadius: "5px"
        }}
        onChange={e => {
          const newProp = e.target.value
          setValue(newProp)
          onChange(newProp)
        }}
        placeholder={placeholder}
      />
    </label>
  )
}
