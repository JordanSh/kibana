/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { ProcessesManager } from '../pages/processes_controller/processes_manager';
import { WebHooksManager } from '../pages/web_hooks_manager/web_hooks_manager';
import { AdmissionController } from '../pages/admission_controller/admission_controller';
import { ROUTES } from './routes';

interface RouteDef {
  name: string;
  id: string;
  route: string;
  component: React.FC;
}

interface SectionDef {
  name: string;
  id: string;
  items: RouteDef[];
}

export const pages = {
  dashboard: {
    name: 'Dashboard',
    id: 'dashboard',
    route: ROUTES.DASHBOARD,
    component: () => <div>Home</div>,
  },
  processes: {
    name: 'Processes',
    id: 'processes',
    route: ROUTES.PROCESSES,
    component: ProcessesManager,
  },
  metrics: {
    route: ROUTES.METRICS,
    name: 'Metrics',
    id: 'metrics',
    component: () => <div>Metrics</div>,
  },
  compliance: {
    route: ROUTES.COMPLIANCE,
    name: 'Compliance',
    id: 'compliance',
    component: () => <div>Compliance</div>,
  },
  configuration: {
    route: ROUTES.CONFIGURATION,
    name: 'Configuration',
    id: 'configuration',
    component: () => <div>Configuration</div>,
  },
  decision_logs: {
    route: ROUTES.DECISION_LOGS,
    name: 'Decision Logs',
    id: 'decision_logs',
    component: () => <div>DL</div>,
  },
  audit_logs: {
    route: ROUTES.AUDIT_LOGS,
    name: 'Audit Logs',
    id: 'audit_logs',
    component: () => <div>AL</div>,
  },
  admission_controller: {
    route: ROUTES.ADMISSION_CONTROLLER.INDEX,
    name: 'Admission Controller',
    id: 'admission_controller',
    component: AdmissionController,
  },
  web_hooks_manager: {
    route: ROUTES.WEB_HOOKS_MANAGER,
    name: 'Web Hooks Manager',
    id: 'web_hooks_manager',
    component: WebHooksManager,
  },
  publish: {
    route: ROUTES.PUBLISH,
    name: 'Publish',
    id: 'publish',
    component: () => <div>publish</div>,
  },
  impact_analysis: {
    route: ROUTES.IMPACT_ANALYSIS,
    name: 'Impact Analysis',
    id: 'impact_analysis',
    component: () => <div>impact analysis</div>,
  },
};

export const sections: SectionDef[] = [
  {
    name: 'General',
    id: 'general',
    items: [pages.dashboard, pages.processes, pages.configuration],
  },
  {
    name: 'Observability',
    id: 'observability',
    items: [
      pages.compliance,
      pages.metrics,
      pages.decision_logs,
      pages.audit_logs,
      pages.impact_analysis,
    ],
  },
  {
    name: 'Security',
    id: 'security',
    items: [pages.admission_controller, pages.web_hooks_manager, pages.publish],
  },
];
