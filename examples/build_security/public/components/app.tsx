/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useContext, useMemo, useState } from 'react';
import { i18n } from '@kbn/i18n';
import { I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router, Redirect, Route, useParams } from 'react-router-dom';
import { EuiButtonIcon, EuiPageTemplate, EuiStepsHorizontal, EuiToolTip } from '@elastic/eui';
// import styled from 'styled-components';
import { CoreStart } from '../../../../src/core/public';
import { Sidebar } from './sidebar';
import { ROUTES } from '../utils/routes';
import { pages } from '../utils/sections';
import { useProcess } from '../pages/processes_controller/processes';
import { GlobalContext, GlobalContextProvider } from './global_context';
import { StartDependencies } from '../plugin';

interface BuildSecurityAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  plugins: StartDependencies;
  defaultIndexPattern: any;
}

export const BuildSecurityApp = ({
  basename,
  notifications,
  http,
  plugins,
  defaultIndexPattern,
}: BuildSecurityAppDeps) => {
  // Use React hooks to manage state.
  const [timestamp, setTimestamp] = useState<string | undefined>();
  // eslint-disable-next-line no-console
  console.log('plugins', plugins);

  const onClickHandler = () => {
    // Use the core http service to make a response to the server API.
    http.get('/api/build_security/example').then((res) => {
      setTimestamp(res.time);
      // Use the core notifications service to display a success message.
      notifications.toasts.addSuccess(
        i18n.translate('buildSecurity.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <GlobalContextProvider>
      <Router basename={basename}>
        <I18nProvider>
          <>
            <Route exact path={`/`}>
              <Redirect to={ROUTES.DASHBOARD} />
            </Route>
            <Route path={`/:page_id`}>
              <FullPage plugins={plugins} defaultIndexPattern={defaultIndexPattern} />
            </Route>
          </>
        </I18nProvider>
      </Router>
    </GlobalContextProvider>
  );
};

export const FullPage: React.FC<any> = ({
  button = <></>,
  bottomBar,
  plugins,
  defaultIndexPattern,
}) => {
  const { processId } = useContext(GlobalContext);
  const params = useParams<{ page_id: keyof typeof pages }>();
  const currentPage = pages[params.page_id];

  const pageHeader = useMemo(
    () => ({
      iconType: 'logoElastic',
      pageTitle: currentPage.name,
      rightSideItems: [button],
    }),
    [button, currentPage.name]
  );

  return (
    <EuiPageTemplate
      pageSideBar={<Sidebar />}
      pageHeader={pageHeader}
      bottomBar={processId && <BottomBar />}
      bottomBarProps={{
        paddingSize: 'm',
      }}
    >
      <currentPage.component plugins={plugins} defaultIndexPattern={defaultIndexPattern} />
    </EuiPageTemplate>
  );
};

export const BottomBar = () => {
  const { processId, setProcessId } = useContext(GlobalContext);

  const { process } = useProcess(processId);
  const horizontalSteps = process?.steps;

  if (!process) return null;
  return (
    <div style={{ position: 'relative' }}>
      {/* <StyledEuiStepsHorizontal steps={horizontalSteps} />*/}
      <EuiStepsHorizontal steps={horizontalSteps} />
      <div style={{ position: 'absolute', top: '0', right: '0' }}>
        <EuiToolTip position="top" content={<p>Close</p>}>
          <EuiButtonIcon
            onClick={() => setProcessId(false)}
            display="fill"
            iconType="cross"
            aria-label="close"
          />
        </EuiToolTip>
      </div>
    </div>
  );
};
//
// const StyledEuiStepsHorizontal = styled(EuiStepsHorizontal)`
//   * {
//     color: white;
//   }
// `;
