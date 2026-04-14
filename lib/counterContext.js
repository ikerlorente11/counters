import React, { createContext, useContext, useState } from "react";
import { DEFAULT_LAYOUT_MODE, normalizeLayoutMode } from "./layoutMode";

const CounterContext = createContext();

export const useCounter = () => useContext(CounterContext);

export const CounterProvider = ({ children, initialLayoutMode = DEFAULT_LAYOUT_MODE }) => {
  const [counterId, setCounterId] = useState(null);
  const [layoutMode, setLayoutMode] = useState(normalizeLayoutMode(initialLayoutMode));

  return (
    <CounterContext.Provider value={{ counterId, setCounterId, layoutMode, setLayoutMode }}>
      {children}
    </CounterContext.Provider>
  );
};
