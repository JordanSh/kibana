/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { BuildSecurityApp } from './components/app';

export const renderApp = async (
  { notifications, http }: CoreStart,
  plugins: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  const defaultIndexPattern = await plugins.data.indexPatterns.getDefault();

  ReactDOM.render(
    <BuildSecurityApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      plugins={plugins}
      defaultIndexPattern={defaultIndexPattern}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
