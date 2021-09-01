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
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { GlobalContext } from '../../components/global_context';

export interface ProcessProps {
  card: EuiCardProps;
  steps: EuiStepsHorizontalProps['steps'];
}

interface UseProcessReturnType {
  processes: ProcessProps[];
  process: ProcessProps | undefined;
}

export type ProcessID = false | 'publish_policy' | 'health_check';

const getStatus = (condition: boolean) => (condition ? 'current' : 'incomplete');

export const useProcess = (processId?: ProcessID): UseProcessReturnType => {
  const history = useHistory();
  const params = useParams<{ page_id: string }>();
  const { isGitIntegrated } = React.useContext(GlobalContext);

  const processes: ProcessProps[] = [
    {
      card: {
        id: 'publish_policy',
        icon: <EuiIcon size="xxl" type="dashboardApp" />,
        title: 'Admission Control',
        description: 'Manage your admission policy. Publish changes to the cloud.',
        betaBadgeLabel: 'Security',
      },
      steps: [
        {
          title: 'Enforce Mutations',
          status: getStatus(history.location.pathname.endsWith('mutation')),
          onClick: () => {
            history.push(ROUTES.ADMISSION_CONTROLLER.MUTATION);
          },
        },
        {
          title: 'Enforce Validations',
          status: getStatus(history.location.pathname.endsWith('validation')),
          onClick: () => {
            history.push(ROUTES.ADMISSION_CONTROLLER.VALIDATION);
          },
        },
        {
          title: 'Create Tests',
          status: getStatus(history.location.pathname.endsWith('test')),
          onClick: () => {
            history.push(ROUTES.ADMISSION_CONTROLLER.TEST);
          },
        },
        {
          title: 'Impact Analysis',
          status: getStatus(params.page_id === 'impact_analysis'),
          onClick: () => {
            history.push(ROUTES.IMPACT_ANALYSIS);
          },
        },
        ...(!isGitIntegrated
          ? [
              {
                title: 'Integrate With Github',
                status: getStatus(history.location.pathname.endsWith('git_integration')),
                onClick: () => {
                  history.push(ROUTES.CONFIGURATION.GIT_INTEGRATION);
                },
              },
            ]
          : []),
        {
          title: 'Publish and Notify',
          status: getStatus(params.page_id === 'publish'),
          onClick: () => {
            history.push(ROUTES.PUBLISH);
          },
        },
      ],
    },
    {
      card: {
        id: 'health_check',
        icon: <EuiIcon size="xxl" type="monitoringApp" />,
        title: 'Health Check',
        description: 'Monitor your system metrics, decisions, and health statuses.',
        betaBadgeLabel: 'Observability',
      },
      steps: [
        {
          title: "Check system's health",
          status: getStatus(params.page_id === 'health'),
          onClick: () => {
            history.push(ROUTES.HEALTH);
          },
        },
        {
          title: 'Inspect Decision Logs',
          status: getStatus(params.page_id === 'decision_logs'),
          onClick: () => {
            history.push(ROUTES.DECISION_LOGS);
          },
        },
        {
          title: "Monitor system's metrics",
          status: getStatus(params.page_id === 'metrics'),
          onClick: () => {
            history.push(ROUTES.METRICS);
          },
        },
      ],
    },
    {
      card: {
        icon: <EuiIcon size="xxl" type="devToolsApp" />,
        title: 'Kibana',
        description: "Example of a card's description. Stick to one or two sentences.",
        betaBadgeLabel: 'debug',
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
