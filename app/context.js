import React, { createContext, useContext, useState } from 'react';

const CounterContext = createContext();

export const useCounter = () => useContext(CounterContext);

export const CounterProvider = ({ children }) => {
  const [counterId, setCounterId] = useState(null);

  return (
    <CounterContext.Provider value={{ counterId, setCounterId }}>
      {children}
    </CounterContext.Provider>
  );
};