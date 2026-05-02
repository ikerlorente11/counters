import React, { createContext, useContext, useState } from "react";
import { DEFAULT_LAYOUT_MODE, normalizeLayoutMode } from "./layoutMode";
import { DEFAULT_UI_SCALE_INDEX, normalizeUiScaleIndex } from "./uiScale";

const CounterContext = createContext();

export const useCounter = () => useContext(CounterContext);

export const CounterProvider = ({
  children,
  initialLayoutMode = DEFAULT_LAYOUT_MODE,
  initialUiScaleIndex = DEFAULT_UI_SCALE_INDEX,
}) => {
  const [counterId, setCounterId] = useState(null);
  const [layoutMode, setLayoutMode] = useState(normalizeLayoutMode(initialLayoutMode));
  const [uiScaleIndex, setUiScaleIndex] = useState(normalizeUiScaleIndex(initialUiScaleIndex));
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <CounterContext.Provider value={{ counterId, setCounterId, layoutMode, setLayoutMode, uiScaleIndex, setUiScaleIndex, refreshKey, triggerRefresh }}>
      {children}
    </CounterContext.Provider>
  );
};
