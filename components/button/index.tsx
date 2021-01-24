import cn from "clsx";

function Button({
  onClick = console.log,
  className = "",
  children = null,
  type = null,
  disabled = false,
  style = null,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-black",
        "text-white",
        "p-2",
        "rounded",
        "uppercase",
        "text-sm",
        "font-bold",
        {
          [className]: Boolean(className),
        }
      )}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
