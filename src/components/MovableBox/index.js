import React, { useState, useRef, useEffect, useCallback } from "react";

import Moveable from "react-moveable";

import './styles.css';

const MovableBox = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  imgId,
  onDestroy,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });
  const [img, setImg] = useState('');

  /**
   * Función que reacciona a los cambios de dimension de la caja
   * @param {*} e 
   */
  const onResize = async (e) => {
    let newWidth = e.width;
    let newHeight = e.height;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${newWidth}px`;
    ref.current.style.height = `${newHeight}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? top : top + translateY,
      left: left + translateX < 0 ? left : left + translateX,
    });
  };

  /**
   * Función que carga la imagen de la caja
   */
  const fetchImage = useCallback(async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${imgId}`)
      const json = await response.json();
      const { url } = json;
      setImg(url);
    } catch (error) {
      console.log(error.message)
    }
  }, [imgId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return (
    <>
      <div
        ref={ref}
        className="draggable box"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={() => setSelected(id)}
      >
        <img src={img} alt=""/>
        <button onClick={() => onDestroy(id)}>X</button>
      </div>

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
          });
        }}
        onResize={onResize}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

export default MovableBox;
