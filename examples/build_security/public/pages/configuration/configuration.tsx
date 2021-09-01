/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiPageTemplate, EuiSpacer, EuiTabbedContent, EuiText, EuiTitle } from '@elastic/eui';
import React, { useState } from 'react';
import { generatePath, Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { MutationTable } from './mutation_table';
import { TestTable } from './test_table';
import { ValidationTable } from './validation_table';
import { GitIntegration } from './git_integration';
import { Settings } from './settings';

export const Configuration = () => {
  return (
    <>
      <Route exact path={ROUTES.CONFIGURATION.INDEX}>
        <Redirect
          to={generatePath(ROUTES.CONFIGURATION.TAB, {
            tab_id: 'settings',
          })}
        />
      </Route>
      <Route path={`/:page_id/:tab_id`}>
        <ConfigurationTabs />
      </Route>
    </>
  );
};

const tabs = [
  {
    id: 'settings',
    name: 'Settings',
    content: <Settings />,
  },
  {
    id: 'git_integration',
    name: 'Git Integration',
    content: <GitIntegration />,
  },
];

const ConfigurationTabs = () => {
  const params = useParams<{ tab_id: string }>();
  const history = useHistory();

  return (
    <EuiTabbedContent
      tabs={tabs}
      selectedTab={tabs.find((tab) => tab.id === params.tab_id)}
      onTabClick={(tab) => {
        history.push(generatePath(ROUTES.CONFIGURATION.TAB, { tab_id: tab.id }));
      }}
    />
  );
};
