/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiSpacer, EuiIcon, EuiCardProps } from '@elastic/eui';
import { allNavigationItems } from '../../common/navigation/constants';
import { useCspBreadcrumbs } from '../../common/navigation/use_csp_breadcrumbs';
import { SummarySection } from './dashboard_sections/summary_section';
import { BenchmarksSection } from './dashboard_sections/benchmarks_section';
import { useComplianceDashboardDataApi } from '../../common/api';
import { CspPageTemplate } from '../../components/csp_page_template';
import { type KibanaPageTemplateProps } from '../../../../../../src/plugins/kibana_react/public';
import * as TEXT from './translations';

const getNoDataConfig = (onClick: () => void): KibanaPageTemplateProps['noDataConfig'] => ({
  pageTitle: 'Cloud Security Compliance Dashboard',
  solution: 'adding data to your cloud security compliance dashboard',
  // TODO: Add real docs link once we have it
  docsLink: 'https://www.elastic.co/guide/index.html',
  logo: 'logoSecurity',
  actions: {
    dashboardNoDataCard: {
      icon: <EuiIcon type={'logoElastic'} size="xxl" />,
      onClick,
      // TODO: Use `href` prop to link to our own integration once we have it
      title: 'Refetch Data',
      description: 'You can try to refetch your data',
    },
  },
});

export const ComplianceDashboard = () => {
  const getDashboarDataQuery = useComplianceDashboardDataApi();
  useCspBreadcrumbs([allNavigationItems.dashboard]);

  return (
    <CspPageTemplate
      pageHeader={{
        pageTitle: TEXT.CLOUD_POSTURE,
      }}
      status={getDashboarDataQuery.status}
      noDataConfig={
        !getDashboarDataQuery.isLoading && !getDashboarDataQuery.data
          ? getNoDataConfig(getDashboarDataQuery.refetch)
          : undefined
      }
    >
      {getDashboarDataQuery.data && (
        <>
          <SummarySection complianceData={getDashboarDataQuery.data} />
          <EuiSpacer />
          <BenchmarksSection complianceData={getDashboarDataQuery.data} />
          <EuiSpacer />
        </>
      )}
    </CspPageTemplate>
  );
};
