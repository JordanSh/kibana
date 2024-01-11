/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiImage,
} from '@elastic/eui';
import React from 'react';
import { i18n } from '@kbn/i18n';
import { useParams } from 'react-router-dom';
import { Chart, Partition, PartitionLayout, Settings } from '@elastic/charts';
import { FormattedMessage } from '@kbn/i18n-react';
import noDataIllustration from '../../assets/illustrations/no_data_illustration.svg';
import { BenchmarksCisId } from '../../../common/types/benchmarks/v2';
import { useCspIntegrationLink } from '../../common/navigation/use_csp_integration_link';
import { useNavigateFindings } from '../../common/hooks/use_navigate_findings';
import { cloudPosturePages } from '../../common/navigation/constants';
import {
  CSPM_POLICY_TEMPLATE,
  KSPM_POLICY_TEMPLATE,
  RULE_FAILED,
  RULE_PASSED,
} from '../../../common/constants';
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
  const cspmIntegrationLink = useCspIntegrationLink(CSPM_POLICY_TEMPLATE) || '';
  const kspmIntegrationLink = useCspIntegrationLink(KSPM_POLICY_TEMPLATE) || '';

  const benchmarkRulesStats = getBenchmarks.data?.items.find(
    (benchmark) =>
      benchmark.id === rulesPageParams.benchmarkId &&
      benchmark.version === rulesPageParams.benchmarkVersion
  );

  if (!benchmarkRulesStats) {
    return <></>;
  }

  const benchmarkDynamicValues: Record<
    BenchmarksCisId,
    {
      integrationType: string;
      integrationName: string;
      resourceName: string;
      integrationLink: string;
    }
  > = {
    cis_aws: {
      integrationType: 'CSPM',
      integrationName: 'AWS',
      resourceName: 'Accounts',
      integrationLink: cspmIntegrationLink,
    },
    cis_gcp: {
      integrationType: 'CSPM',
      integrationName: 'GCP',
      resourceName: 'Projects',
      integrationLink: cspmIntegrationLink,
    },
    cis_azure: {
      integrationType: 'CSPM',
      integrationName: 'Azure',
      resourceName: 'Subscriptions',
      integrationLink: cspmIntegrationLink,
    },
    cis_k8s: {
      integrationType: 'KSPM',
      integrationName: 'Kubernetes',
      resourceName: 'Clusters',
      integrationLink: kspmIntegrationLink,
    },
    cis_eks: {
      integrationType: 'KSPM',
      integrationName: 'EKS',
      resourceName: 'Clusters',
      integrationLink: kspmIntegrationLink,
    },
  };

  if (benchmarkRulesStats.score.totalFindings === 0) {
    return (
      <EuiEmptyPrompt
        color="plain"
        icon={<EuiImage size="fullWidth" src={noDataIllustration} alt="no_data_illustration" />}
        // title={<h2>Add Kubernetes Clusters to get started</h2>}
        title={
          <h2>
            <FormattedMessage
              id="xpack.csp.rulesPage.rulesCounterEmptyState.emptyStateTitle"
              defaultMessage="Add {integrationResourceName} to get started"
              values={{
                integrationResourceName: `${
                  benchmarkDynamicValues[benchmarkRulesStats?.id].integrationName
                }
                  ${benchmarkDynamicValues[benchmarkRulesStats?.id].resourceName}`,
              }}
            />
          </h2>
        }
        body={
          <p>
            <FormattedMessage
              id="xpack.csp.rulesPage.rulesCounterEmptyState.emptyStateTitle"
              defaultMessage="Add your {resourceName} in {integrationType} to begin detecing misconfigurations"
              values={{
                resourceName:
                  benchmarkDynamicValues[benchmarkRulesStats?.id].resourceName.toLowerCase(),
                integrationType: benchmarkDynamicValues[benchmarkRulesStats?.id].integrationType,
              }}
            />
          </p>
        }
        actions={[
          <EuiButton color="primary" fill>
            <FormattedMessage
              id="xpack.csp.rulesPage.rulesCounterEmptyState.emptyPrimapryButtonTitle"
              defaultMessage="Add {integrationType} integration"
              values={{
                integrationType: benchmarkDynamicValues[benchmarkRulesStats?.id].integrationType,
              }}
            />
          </EuiButton>,
          <EuiButtonEmpty color="primary">Learn more</EuiButtonEmpty>,
        ]}
        layout="horizontal"
        paddingSize="m"
      />
    );
  }

  const counters = [
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate('xpack.csp.rulesCounters.postureScoreTitle', {
        defaultMessage: 'Posture Score',
      }),
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EvaluationPieChart
            failed={benchmarkRulesStats.score.totalFailed}
            passed={benchmarkRulesStats.score.totalPassed}
          />
          {`${benchmarkRulesStats.score.postureScore}%`}
        </div>
      ),
      button: (
        <EuiButtonEmpty
          iconType="pivot"
          target="_blank"
          href={http.basePath.prepend(`/app/security${cloudPosturePages.dashboard.path}`)}
        >
          {i18n.translate('xpack.csp.rulesCounters.postureScoreButton', {
            defaultMessage: 'Dashboard',
          })}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate('xpack.csp.rulesCounters.accountsEvaluatedTitle', {
        defaultMessage: '{resourceName} Evaluated',
        values: {
          resourceName: benchmarkDynamicValues[benchmarkRulesStats.id].resourceName,
        },
      }),
      title: benchmarkRulesStats.evaluation || 0,
      button: (
        <EuiButtonEmpty
          iconType="listAdd"
          target="_blank"
          href={benchmarkDynamicValues[benchmarkRulesStats.id].integrationLink}
        >
          {i18n.translate('xpack.csp.rulesCounters.accountsEvaluatedButton', {
            defaultMessage: 'Add more {resourceName}',
            values: {
              resourceName:
                benchmarkDynamicValues[benchmarkRulesStats.id].resourceName.toLowerCase(),
            },
          })}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate('xpack.csp.rulesCounters.failedFindingsTitle', {
        defaultMessage: 'Failed Findings',
      }),
      title: benchmarkRulesStats.score.totalFailed,
      titleColor: benchmarkRulesStats.score.totalFailed > 0 ? statusColors.failed : undefined,
      button: (
        <EuiButtonEmpty
          iconType="pivot"
          target="_blank"
          onClick={() =>
            navToFindings({
              'result.evaluation': RULE_FAILED,
              'rule.benchmark.id': benchmarkRulesStats.id || '',
              'rule.benchmark.version': `v${benchmarkRulesStats.version}`,
            })
          }
        >
          {i18n.translate('xpack.csp.rulesCounters.failedFindingsButton', {
            defaultMessage: 'View all failed findings',
          })}
        </EuiButtonEmpty>
      ),
    },
    {
      id: DASHBOARD_COUNTER_CARDS.CLUSTERS_EVALUATED,
      description: i18n.translate('xpack.csp.rulesCounters.disabledRulesCounterTitle', {
        defaultMessage: 'Disabled Rules',
      }),
      title: 'WIP',
      button: (
        <EuiButtonEmpty iconType="search">
          {i18n.translate('xpack.csp.rulesCounters.disabledRulesCounterButton', {
            defaultMessage: 'View all disabled rules',
          })}
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
