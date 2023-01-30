/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React, { useState, createContext } from 'react';
import { ProcessID } from '../pages/processes_controller/processes';

export const GlobalContext = createContext<{
  processId: ProcessID;
  setProcessId: any;
  isGitIntegrated: boolean;
  setIsGitIntegrated: any;
}>({});

export const GlobalContextProvider: React.FC = (props) => {
  const [processId, setProcessId] = useState<ProcessID>(false);
  const [isGitIntegrated, setIsGitIntegrated] = useState<boolean>(false);

  return (
    <GlobalContext.Provider
      value={{ processId, setProcessId, isGitIntegrated, setIsGitIntegrated }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
