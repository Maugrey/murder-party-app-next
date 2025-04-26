import { createContext, useContext } from 'react';
import { DataLoaderMode } from './dataLoader';

export const DataLoaderModeContext = createContext<DataLoaderMode>('static');
export const useDataLoaderMode = () => useContext(DataLoaderModeContext);
