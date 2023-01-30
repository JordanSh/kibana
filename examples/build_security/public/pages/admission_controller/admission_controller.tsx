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

export const AdmissionController = () => {
  return (
    <>
      <Route exact path={ROUTES.ADMISSION_CONTROLLER.INDEX}>
        <Redirect
          to={generatePath(ROUTES.ADMISSION_CONTROLLER.TAB, {
            tab_id: 'rules',
          })}
        />
      </Route>
      <Route path={`/:page_id/:tab_id`}>
        <AdmissionControllerTabs />
      </Route>
    </>
  );
};

const tabs = [
  {
    id: 'mutation',
    name: 'Mutations',
    content: <MutationTable />,
  },
  {
    id: 'validation',
    name: 'Validations',
    content: <ValidationTable />,
  },
  {
    id: 'test',
    name: 'Tests',
    content: <TestTable />,
  },
];

const AdmissionControllerTabs = () => {
  const params = useParams<{ tab_id: string }>();
  const history = useHistory();

  return (
    <EuiTabbedContent
      tabs={tabs}
      selectedTab={tabs.find((tab) => tab.id === params.tab_id)}
      onTabClick={(tab) => {
        history.push(generatePath(ROUTES.ADMISSION_CONTROLLER.TAB, { tab_id: tab.id }));
      }}
    />
  );
};
