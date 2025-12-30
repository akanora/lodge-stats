import React, { createContext, useState, useContext } from 'react';

const ServerContext = createContext();

export function ServerProvider({ children }) {
    const [serverTick, setServerTick] = useState('100'); // '100' or '128'

    return (
        <ServerContext.Provider value={{ serverTick, setServerTick }}>
            {children}
        </ServerContext.Provider>
    );
}

export function useServer() {
    return useContext(ServerContext);
}
