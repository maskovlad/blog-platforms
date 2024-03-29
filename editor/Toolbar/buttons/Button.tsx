
const Button = (props) => {
  const { children, hint, active, ...rest } = props
  return (
    <button 
      style={{ 
        color: active ? "#45ff48" : "var(--c-black)",
        width: '20px', 
        height: '20px', 
        background: "transparent",
        display: 'flex',
        alignItems: "center",
        cursor: "pointer",
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
      {...rest}>
      {children}
    </button>
  )
}

export default Button;

