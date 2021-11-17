/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiTabbedContent } from '@elastic/eui';
import React, { useState } from 'react';
import { generatePath, Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { Summary } from './summary';
import { Compliance } from './compliance';
import { Analyze } from './analyze';

export const ImpactAnalysis = () => {
  return (
    <>
      <Route exact path={ROUTES.IMPACT_ANALYSIS.INDEX}>
        <Redirect
          to={generatePath(ROUTES.IMPACT_ANALYSIS.TAB, {
            tab_id: 'summary',
          })}
        />
      </Route>
      <Route path={`/:page_id/:tab_id`}>
        <ImpactAnalysisTabs />
      </Route>
    </>
  );
};

const tabs = [
  {
    id: 'summary',
    name: 'Summary',
    content: <Summary />,
  },
  {
    id: 'compliance',
    name: 'Compliance',
    content: <Compliance />,
  },
  {
    id: 'analyze',
    name: 'Analyze',
    content: <Analyze />,
  },
];

const ImpactAnalysisTabs = () => {
  const params = useParams<{ tab_id: string }>();
  const history = useHistory();

  return (
    <EuiTabbedContent
      tabs={tabs}
      selectedTab={tabs.find((tab) => tab.id === params.tab_id)}
      onTabClick={(tab) => {
        history.push(generatePath(ROUTES.IMPACT_ANALYSIS.TAB, { tab_id: tab.id }));
      }}
    />
  );
};
