import React from 'react';

export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const DevOnly: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return isDev() ? React.createElement(React.Fragment, null, children) : null;
};