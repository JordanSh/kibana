/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo, useState } from 'react';
import { EuiEmptyPrompt, EuiLink, EuiPageHeader, EuiSpacer, EuiIcon } from '@elastic/eui';
import { css } from '@emotion/react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { NO_FINDINGS_STATUS_TEST_SUBJ } from '../../components/test_subjects';
import { useCspIntegrationLink } from '../../common/navigation/use_csp_integration_link';
import { ComplianceDashboardData } from '../../../common/types';
import { CloudPosturePageTitle } from '../../components/cloud_posture_page_title';
import {
  CloudPosturePage,
  CspNoDataPage,
  CspNoDataPageProps,
} from '../../components/cloud_posture_page';
import { DASHBOARD_CONTAINER } from './test_subjects';
import {
  useCspmComplianceDashboardDataApi,
  useKspmComplianceDashboardDataApi,
} from '../../common/api';
import { useCspSetupStatusApi } from '../../common/api/use_setup_status_api';
import { NoFindingsStates } from '../../components/no_findings_states';
import { CloudSummarySection } from './dashboard_sections/cloud_summary_section';
import { CloudBenchmarksSection } from './dashboard_sections/cloud_benchmarks_section';
import {
  CSPM_POLICY_TEMPLATE,
  KSPM_POLICY_TEMPLATE,
  PolicyTemplate,
} from '../../../common/constants';

const IntegrationPostureDashboard = ({
  complianceData,
  notInstalledConfig,
  isIntegrationInstalled,
}: {
  complianceData: ComplianceDashboardData;
  notInstalledConfig: CspNoDataPageProps;
  isIntegrationInstalled?: boolean;
}) => {
  const noFindings = complianceData.stats.totalFindings === 0;

  // the integration is not installed, and there are no findings for this integration
  if (noFindings && !isIntegrationInstalled && notInstalledConfig) {
    return <CspNoDataPage {...notInstalledConfig} />;
  }

  // the integration is installed, but there are no findings for this integration
  if (noFindings) {
    return (
      // height is calculated for the screen height minus the kibana header, page title, and tabs
      <div style={{ height: 'calc(100vh - 265px)', display: 'flex', justifyContent: 'center' }}>
        <EuiEmptyPrompt
          data-test-subj={NO_FINDINGS_STATUS_TEST_SUBJ.INDEX_TIMEOUT}
          color="plain"
          icon={<EuiIcon type="logoSecurity" size="xl" />}
          title={
            <h2>
              <FormattedMessage
                id="xpack.csp.integrationDashboard.noFindings.promptTitle"
                defaultMessage="No Findings"
              />
            </h2>
          }
          body={
            <p>
              <FormattedMessage
                id="xpack.csp.integrationDashboard.noFindingsPrompt.promptDescription"
                defaultMessage="Integration installed but you dont have findings"
              />
            </p>
          }
        />
      </div>
    );
  }

  // there are findings, displays dashboard even if integration is not installed
  return (
    <>
      <CloudSummarySection complianceData={complianceData} />
      <EuiSpacer />
      <CloudBenchmarksSection complianceData={complianceData} />
      <EuiSpacer />
    </>
  );
};

const noDataOptions: Record<
  PolicyTemplate,
  Pick<CspNoDataPageProps, 'docsLink' | 'actionTitle' | 'actionDescription'>
> = {
  kspm: {
    docsLink: 'https://ela.st/kspm',
    actionTitle: i18n.translate(
      'xpack.csp.cloudPosturePage.kspmIntegration.packageNotInstalled.buttonLabel',
      { defaultMessage: 'Add a KSPM integration' }
    ),
    actionDescription: (
      <FormattedMessage
        id="xpack.csp.cloudPosturePage.kspmIntegration.packageNotInstalled.description"
        defaultMessage="Use our {integrationFullName} (KSPM) integration to measure your Kubernetes cluster setup against CIS recommendations."
        values={{
          integrationFullName: (
            <EuiLink href="https://ela.st/kspm">
              <FormattedMessage
                id="xpack.csp.cloudPosturePage.kspmIntegration.packageNotInstalled.integrationNameLabel"
                defaultMessage="Kubernetes Security Posture Management"
              />
            </EuiLink>
          ),
        }}
      />
    ),
  },
  cspm: {
    docsLink: 'https://ela.st/cspm',
    actionTitle: i18n.translate(
      'xpack.csp.cloudPosturePage.cspmIntegration.packageNotInstalled.buttonLabel',
      { defaultMessage: 'Add a CSPM integration' }
    ),
    actionDescription: (
      <FormattedMessage
        id="xpack.csp.cloudPosturePage.cspmIntegration.packageNotInstalled.description"
        defaultMessage="Use our {integrationFullName} (CSPM) integration to measure your Cloud account setup against CIS recommendations."
        values={{
          integrationFullName: (
            <EuiLink href="https://ela.st/cspm">
              <FormattedMessage
                id="xpack.csp.cloudPosturePage.cspmIntegration.packageNotInstalled.integrationNameLabel"
                defaultMessage="Cloud Security Posture Management"
              />
            </EuiLink>
          ),
        }}
      />
    ),
  },
};

const getNotInstalledConfig = (
  policyTemplate: PolicyTemplate,
  actionHref: CspNoDataPageProps['actionHref']
) => ({
  pageTitle: i18n.translate('xpack.csp.cloudPosturePage.packageNotInstalled.pageTitle', {
    defaultMessage: 'Install Integration to get started',
  }),
  docsLink: noDataOptions[policyTemplate].docsLink,
  actionHref,
  actionTitle: noDataOptions[policyTemplate].actionTitle,
  actionDescription: noDataOptions[policyTemplate].actionDescription,
});

export const ComplianceDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('kspm');
  const getSetupStatus = useCspSetupStatusApi();
  const hasFindings = getSetupStatus.data?.status === 'indexed';
  const cspmIntegrationLink = useCspIntegrationLink(CSPM_POLICY_TEMPLATE);
  const kspmIntegrationLink = useCspIntegrationLink(KSPM_POLICY_TEMPLATE);

  const getCspmDashboardData = useCspmComplianceDashboardDataApi({
    enabled: hasFindings,
  });
  const getKspmDashboardData = useKspmComplianceDashboardDataApi({
    enabled: hasFindings,
  });

  const tabs = useMemo(
    () => [
      {
        label: 'Cloud',
        isSelected: selectedTab === CSPM_POLICY_TEMPLATE,
        onClick: () => setSelectedTab(CSPM_POLICY_TEMPLATE),
        content: (
          <CloudPosturePage query={getCspmDashboardData}>
            <IntegrationPostureDashboard
              complianceData={getCspmDashboardData.data!}
              notInstalledConfig={getNotInstalledConfig(CSPM_POLICY_TEMPLATE, cspmIntegrationLink)}
              isIntegrationInstalled={getSetupStatus.data?.installedPolicyTemplates.includes(
                CSPM_POLICY_TEMPLATE
              )}
            />
          </CloudPosturePage>
        ),
      },
      {
        label: 'Kubernetes',
        isSelected: selectedTab === KSPM_POLICY_TEMPLATE,
        onClick: () => setSelectedTab(KSPM_POLICY_TEMPLATE),
        content: (
          <CloudPosturePage query={getKspmDashboardData}>
            <IntegrationPostureDashboard
              complianceData={getKspmDashboardData.data!}
              notInstalledConfig={getNotInstalledConfig(KSPM_POLICY_TEMPLATE, kspmIntegrationLink)}
              isIntegrationInstalled={getSetupStatus.data?.installedPolicyTemplates.includes(
                KSPM_POLICY_TEMPLATE
              )}
            />
          </CloudPosturePage>
        ),
      },
    ],
    [
      cspmIntegrationLink,
      getCspmDashboardData,
      getKspmDashboardData,
      getSetupStatus.data?.installedPolicyTemplates,
      kspmIntegrationLink,
      selectedTab,
    ]
  );

  if (!hasFindings) return <NoFindingsStates />;

  return (
    <CloudPosturePage query={selectedTab === 'cspm' ? getCspmDashboardData : getKspmDashboardData}>
      <EuiPageHeader
        bottomBorder
        pageTitle={
          <CloudPosturePageTitle
            title={i18n.translate('xpack.csp.dashboard.cspPageTemplate.pageTitle', {
              defaultMessage: 'Cloud Posture',
            })}
          />
        }
        tabs={tabs.map(({ content, ...rest }) => rest)}
      />
      <EuiSpacer />
      <div
        data-test-subj={DASHBOARD_CONTAINER}
        css={css`
          max-width: 1600px;
          margin-left: auto;
          margin-right: auto;
          height: 100%;
        `}
      >
        {tabs.find((t) => t.isSelected)?.content}
      </div>
    </CloudPosturePage>
  );
};
