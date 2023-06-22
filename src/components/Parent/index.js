import React, { useState, useRef, useCallback } from "react";

import MovableBox from "../MovableBox";

import "./styles.css";

const Parent = () => {
  const parentRef = useRef(null);

  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  /**
   * Función que agrega una caja al contenedor
   */
  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
      },
    ]);
  };

  /**
   * Función que actualiza la posición de las cajas, la función también valida
   * que las cajas no se salgan del contenedor principal al ser arrastradas
   */
  const updateMoveable = useCallback(
    (id, newComponent, updateEnd = false) => {
      if (!parentRef.current) return;

      const rect = parentRef.current.getBoundingClientRect();

      const updatedMoveables = moveableComponents.map((moveable, i) => {
        if (moveable.id !== id) return moveable;

        if (newComponent.top < 0) newComponent.top = 0;
        if (newComponent.left < 0) newComponent.left = 0;
        if (newComponent.left + newComponent.width > rect.width)
          newComponent.left = rect.width - newComponent.width;
        if (newComponent.top + newComponent.height > rect.height)
          newComponent.top = rect.height - newComponent.height;

        return { id, ...newComponent, updateEnd };
      });
      setMoveableComponents(updatedMoveables);
    },
    [moveableComponents]
  );


  /**
   * Función que destruye una sola caja
   */
  const handleDestroy = useCallback(
    (idRemoved) => {
      setMoveableComponents((current) =>
        current.filter(({ id }) => id !== idRemoved)
      );
    },
    []
  );
    
  /**
   * Función que destruye todas las cajas
   */
  const handleDestroyAll = useCallback(() => {
    setMoveableComponents([])
  }, []);

  return (
    <main>
      <h1 className="title">MovableBox!</h1>
      <div className="controls">
        <button className="add-button" onClick={addMoveable}>
          Add Moveable!
        </button>
        <button className="destroy-button" onClick={handleDestroyAll}>
          Destroy everything!
        </button>
      </div>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
          overflow: "hidden",
        }}
        ref={parentRef}
      >
        {moveableComponents.map((item, index) => (
          <MovableBox
            {...item}
            key={item.id}
            imgId={index + 1}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            onDestroy={handleDestroy}
          />
        ))}
      </div>
    </main>
  );
};

export default Parent;
