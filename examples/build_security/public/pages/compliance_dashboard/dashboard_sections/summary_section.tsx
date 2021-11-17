/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { CloudPostureScoreChart } from '../compliance_charts/cloud_posture_score_chart';
import { ResourcesAtRiskChart } from '../compliance_charts/resources_at_risk_chart';
import { ScorePerAccountChart } from '../compliance_charts/score_per_account_chart';
import { ChartPanel } from '../../../components/chart_panel';
import { ComplianceScoreGoalChart } from '../compliance_charts/compliance_score_goal_chart';

export const SummarySection = () => (
  <EuiFlexGrid columns={3}>
    <EuiFlexItem>
      <ChartPanel
        title="Cloud Posture Score"
        description="Percentage out of all policy rules passed"
        chart={ComplianceScoreGoalChart}
      />
    </EuiFlexItem>
    <EuiFlexItem>
      <ChartPanel
        title="Top 5 Resources Types At Risk"
        description="Non compliant first"
        chart={ResourcesAtRiskChart}
      />
    </EuiFlexItem>
    <EuiFlexItem>
      <ChartPanel
        title="Score Per Account / Cluster"
        description="Non compliant first"
        chart={ScorePerAccountChart}
      />
    </EuiFlexItem>
  </EuiFlexGrid>
);
