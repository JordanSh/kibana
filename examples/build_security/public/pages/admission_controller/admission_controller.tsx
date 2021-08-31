/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiPageTemplate } from '@elastic/eui';
import React, { useState } from 'react';
import { generatePath, Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

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
  { label: 'Rules', id: 'rules' },
  { label: 'Tests', id: 'tests' },
];

const AdmissionControllerTabs = () => {
  const params = useParams<{ tab_id: string }>();
  const history = useHistory();

  return (
    <EuiPageTemplate
      pageHeader={{
        tabs: tabs.map((tab) => ({
          ...tab,
          isSelected: tab.id === params.tab_id,
          onClick: () =>
            history.push(generatePath(ROUTES.ADMISSION_CONTROLLER.TAB, { tab_id: tab.id })),
        })),
      }}
    >
      {<div>hi</div>}
    </EuiPageTemplate>
  );
};
