/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROCESSES: '/processes',
  ADMISSION_CONTROLLER: {
    INDEX: '/admission_controller',
    TAB: '/admission_controller/:tab_id',
    RULES: '/admission_controller/rules',
    TESTS: '/admission_controller/tests',
  },
  WEB_HOOKS_MANAGER: '/web_hooks_manager',
  AUDIT_LOGS: '/audit_logs',
  DECISION_LOGS: '/decision_logs',
  METRICS: '/metrics',
  COMPLIANCE: '/compliance',
  CONFIGURATION: '/configuration',
  IMPACT_ANALYSIS: '/impact_analysis',
  PUBLISH: '/publish',
};
