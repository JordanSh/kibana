/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButtonEmpty, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';
import { i18n } from '@kbn/i18n';
import { useParams } from 'react-router-dom';
import { Chart, Settings, Partition, PartitionLayout } from '@elastic/charts';
import { useCspIntegrationLink } from '../../common/navigation/use_csp_integration_link';
import { useNavigateFindings } from '../../common/hooks/use_navigate_findings';
import { cloudPosturePages } from '../../common/navigation/constants';
import { CSPM_POLICY_TEMPLATE, RULE_PASSED } from '../../../common/constants';
import { statusColors } from '../../common/constants';
import { useCspBenchmarkIntegrationsV2 } from '../benchmarks/use_csp_benchmark_integrations';
import { DASHBOARD_COUNTER_CARDS } from '../compliance_dashboard/test_subjects';
import { CspCounterCard } from '../../components/csp_counter_card';
import { useKibana } from '../../common/hooks/use_kibana';

const EvaluationPieChart = ({ failed, passed }: { failed: number; passed: number }) => {
  const {
    services: { charts },
  } = useKibana();

  return (
    <Chart size={{ height: 30, width: 30 }}>
      <Settings
        theme={[
          {
            partition: {
              linkLabel: { maximumSection: Infinity, maxCount: 0 },
              outerSizeRatio: 0.75,
              emptySizeRatio: 0.7,
            },
          },
        ]}
        baseTheme={charts.theme.useChartsBaseTheme()}
      />
      <Partition
        id={'id'}
        data={[
          { label: 'Failed', value: failed },
          { label: 'Passed', value: passed },
        ]}
        valueGetter="percent"
        valueAccessor={(d) => d.value}
        layout={PartitionLayout.sunburst}
        layers={[
          {
            groupByRollup: (d: { label: string }) => d.label,
            shape: {
              fillColor: (label) =>
                label.toLowerCase() === RULE_PASSED.toLowerCase()
                  ? statusColors.passed
                  : statusColors.failed,
            },
          },
        ]}
      />
    </Chart>
  );
};

export const RulesCounters = () => {
  const { http } = useKibana().services;
  const rulesPageParams = useParams<{ benchmarkId: string; benchmarkVersion: string }>();
  const getBenchmarks = useCspBenchmarkIntegrationsV2();
  const navToFindings = useNavigateFindings();
  const cspmIntegrationLink = useCspIntegrationLink(CSPM_POLICY_TEMPLATE);

  const benchmarkRulesStats = getBenchmarks.data?.items.find(
    (benchmark) =>
      benchmark.id === rulesPageParams.benchmarkId &&
      benchmark.version === rulesPageParams.benchmarkVersion
  );

  console.log(benchmarkRulesStats);

  const scores = {
    failed: benchmarkRulesStats?.score.totalFailed || 0,
    passed: benchmarkRulesStats?.score.totalPassed || 0,
    postureScore: benchmarkRulesStats?.score.postureScore || 0,
  };

  const counters = [
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate(
        'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedDescription',
        { defaultMessage: 'Posture Score' }
      ),
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EvaluationPieChart failed={scores.failed} passed={scores.passed} />
          {`${scores.postureScore}%`}
        </div>
      ),
      button: (
        <EuiButtonEmpty
          iconType="pivot"
          target="_blank"
          href={http.basePath.prepend(`/app/security${cloudPosturePages.dashboard.path}`)}
        >
          {i18n.translate(
            'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedButtonTitle',
            { defaultMessage: 'Dashboard' }
          )}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate(
        'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedDescription',
        { defaultMessage: 'Accounts Evaluated' }
      ),
      title: benchmarkRulesStats?.evaluation || 0,
      button: (
        <EuiButtonEmpty
          iconType="listAdd"
          target="_blank"
          // href={dashboardType === KSPM_POLICY_TEMPLATE ? kspmIntegrationLink : cspmIntegrationLink}
          href={cspmIntegrationLink}
        >
          {i18n.translate(
            'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedButtonTitle',
            { defaultMessage: 'Add more accounts' }
          )}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate(
        'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedDescription',
        { defaultMessage: 'Failed Findings' }
      ),
      title: scores.failed,
      titleColor: scores.failed > 0 ? statusColors.failed : undefined,
      button: (
        <EuiButtonEmpty
          iconType="pivot"
          target="_blank"
          // TODO: add benchmark and version
          onClick={() => navToFindings({ 'result.evaluation': 'failed' })}
        >
          {i18n.translate(
            'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedButtonTitle',
            { defaultMessage: 'View all failed findings' }
          )}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate(
        'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedDescription',
        { defaultMessage: 'Disabled Rules' }
      ),
      title: 'title',
      button: (
        <EuiButtonEmpty
          iconType="listAdd"
          target="_blank"
          // href={dashboardType === KSPM_POLICY_TEMPLATE ? kspmIntegrationLink : cspmIntegrationLink}
        >
          {i18n.translate(
            'xpack.csp.dashboard.summarySection.counterCard.accountsEvaluatedButtonTitle',
            { defaultMessage: 'Enroll more accounts' }
          )}
        </EuiButtonEmpty>
      ),
    },
  ];

  return (
    <EuiFlexGroup>
      {counters.map((counter) => (
        <EuiFlexItem key={counter.id}>
          <CspCounterCard {...counter} />
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};
