/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { EuiCardProps } from '@elastic/eui/src/components/card/card';
import { EuiIcon } from '@elastic/eui';
import { EuiStepsHorizontalProps } from '@elastic/eui/src/components/steps/steps_horizontal';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { pages } from '../../utils/sections';
import { ROUTES } from '../../utils/routes';

interface ProcessProps {
  card: EuiCardProps;
  steps: EuiStepsHorizontalProps['steps'];
}

interface UseProcessReturnType {
  processes: ProcessProps[];
  process: ProcessProps | undefined;
}

type ProcessID = 'publish_policy';

export const useProcess = (processId?: ProcessID): UseProcessReturnType => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ page_id: string }>();

  const processes: ProcessProps[] = [
    {
      card: {
        id: 'publish_policy',
        icon: <EuiIcon size="xxl" type="dashboardApp" />,
        title: 'Kibana',
        description: "Example of a card's description. Stick to one or two sentences.",
        betaBadgeLabel: 'create',
        onClick: () => {
          // init progress bar
          // navigate to first step
        },
      },
      steps: [
        {
          title: 'Manage Policy Rules',
          status: history.location.pathname.endsWith('rules') ? 'current' : 'incomplete',
          onClick: () => {
            history.push(ROUTES.ADMISSION_CONTROLLER.RULES);
          },
        },
        {
          title: 'Create Tests',
          status: history.location.pathname.endsWith('tests') ? 'current' : 'incomplete',
          onClick: () => {
            history.push(ROUTES.ADMISSION_CONTROLLER.TESTS);
          },
        },
        {
          title: 'Impact Analysis',
          status: params.page_id === 'impact_analysis' ? 'current' : 'incomplete',
          onClick: () => {
            history.push(ROUTES.IMPACT_ANALYSIS);
          },
        },
        {
          title: 'Publish and notify',
          status: params.page_id === 'publish' ? 'current' : 'incomplete',
          onClick: () => {
            history.push(ROUTES.PUBLISH);
          },
        },
      ],
    },
    {
      card: {
        icon: <EuiIcon size="xxl" type="devToolsApp" />,
        title: 'Kibana',
        description: "Example of a card's description. Stick to one or two sentences.",
        betaBadgeLabel: 'create',
        onClick: () => {},
      },
      steps: [
        {
          title: 'Completed step 1',
          status: 'complete',
          onClick: () => {},
        },
      ],
    },
    {
      card: {
        icon: <EuiIcon size="xxl" type="monitoringApp" />,
        title: 'Kibana',
        description: "Example of a card's description. Stick to one or two sentences.",
        betaBadgeLabel: 'debug',
        onClick: () => {},
      },
      steps: [
        {
          title: 'Completed step 1',
          status: 'complete',
          onClick: () => {},
        },
      ],
    },
    {
      card: {
        icon: <EuiIcon size="xxl" type="lensApp" />,
        title: 'Kibana',
        description: "Example of a card's description. Stick to one or two sentences.",
        betaBadgeLabel: 'monitor',
        onClick: () => {},
      },
      steps: [
        {
          title: 'Completed step 1',
          status: 'complete',
          onClick: () => {},
        },
      ],
    },
  ];

  return {
    processes,
    process: processes.find((process) => process.card.id === processId),
  };
};
