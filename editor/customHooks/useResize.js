import { useEffect, useState } from "react";

const useResize = (width, height, ratio ) => {
  // console.log({ width, height,ratio })

  const [size, setSize] = useState({ width, height });
  const [resizing, setResizing] = useState(false);

  useEffect(()=>{
    setSize({width,height})
  },[width,height])

  const onMouseDown = () => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    setResizing(true);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    setResizing(false);
  };

  const onMouseMove = (e) => {
    setSize((currentSize) => ({
      width: currentSize.width + e.movementX,
      height: e.ctrlKey
        ? currentSize.width / ratio
        : currentSize.height + e.movementY,
    }));
  };

  return [size, onMouseDown, resizing];
};

export default useResize;
