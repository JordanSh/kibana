/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import type { UseQueryResult } from 'react-query';
import { NavLink } from 'react-router-dom';
import { EuiEmptyPrompt, EuiErrorBoundary, EuiTitle } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import {
  KibanaPageTemplate,
  type KibanaPageTemplateProps,
} from '../../../../../src/plugins/kibana_react/public';
import { allNavigationItems } from '../common/navigation/constants';
import type { CspNavigationItem } from '../common/navigation/types';
import { CLOUD_SECURITY_POSTURE } from '../common/translations';
import { CspLoadingState } from './csp_loading_state';
import { LOADING, PACKAGE_NOT_INSTALLED_TEXT, DEFAULT_NO_DATA_TEXT } from './translations';
import {
  CIS_KUBERNETES_INTEGRATION_VERSION,
  useCisKubernetesIntegration,
} from '../common/api/use_cis_kubernetes_integration';
import { useCISIntegrationLink } from '../common/navigation/use_navigate_to_cis_integration';
import { CIS_KUBERNETES_PACKAGE_NAME } from '../../common/constants';
import type { GetInfoResponse, DefaultPackagesInstallationError } from '../../../fleet/common';

type CommonError = Partial<{
  body: {
    error: string;
    message: string;
    statusCode: number;
  };
}>;

const activeItemStyle = { fontWeight: 700 };

export const getSideNavItems = (
  navigationItems: Record<string, CspNavigationItem>
): NonNullable<KibanaPageTemplateProps['solutionNav']>['items'] =>
  Object.entries(navigationItems)
    .filter(([_, navigationItem]) => !navigationItem.disabled)
    .map(([id, navigationItem]) => ({
      id,
      name: navigationItem.name,
      renderItem: () => (
        <NavLink to={navigationItem.path} activeStyle={activeItemStyle}>
          {navigationItem.name}
        </NavLink>
      ),
    }));

const DEFAULT_PAGE_PROPS: KibanaPageTemplateProps = {
  solutionNav: {
    name: CLOUD_SECURITY_POSTURE,
    items: getSideNavItems({
      dashboard: allNavigationItems.dashboard,
      findings: allNavigationItems.findings,
      benchmark: allNavigationItems.benchmarks,
    }),
  },
  restrictWidth: false,
};

export const DEFAULT_NO_DATA_CONFIG: KibanaPageTemplateProps['noDataConfig'] = {
  pageTitle: DEFAULT_NO_DATA_TEXT.PAGE_TITLE,
  solution: DEFAULT_NO_DATA_TEXT.SOLUTION,
  // TODO: Add real docs link once we have it
  docsLink: 'https://www.elastic.co/guide/index.html',
  logo: 'logoSecurity',
  actions: {},
};

const getPackageNotInstalledNoDataConfig = (
  cisIntegrationLink: string
): KibanaPageTemplateProps['noDataConfig'] => ({
  pageTitle: PACKAGE_NOT_INSTALLED_TEXT.PAGE_TITLE,
  solution: PACKAGE_NOT_INSTALLED_TEXT.SOLUTION,
  // TODO: Add real docs link once we have it
  docsLink: 'https://www.elastic.co/guide/index.html',
  logo: 'logoSecurity',
  actions: {
    elasticAgent: {
      href: cisIntegrationLink,
      title: PACKAGE_NOT_INSTALLED_TEXT.BUTTON_TITLE,
      description: PACKAGE_NOT_INSTALLED_TEXT.DESCRIPTION,
    },
  },
});

const DefaultLoading = () => <CspLoadingState>{LOADING}</CspLoadingState>;

const DefaultError = (error: CommonError) => (
  <EuiEmptyPrompt
    color="danger"
    iconType="alert"
    title={
      <>
        <EuiTitle>
          <h2>
            <FormattedMessage
              id="xpack.csp.pageTemplate.loadErrorMessage"
              defaultMessage="We couldn't fetch your cloud security posture data"
            />
          </h2>
        </EuiTitle>
        {error.body?.error && error.body?.statusCode && (
          <EuiTitle size="xs">
            <h5>{`${error.body.error} (${error.body.statusCode})`}</h5>
          </EuiTitle>
        )}
        {error.body?.message && (
          <EuiTitle size="xs">
            <h5>{error.body.message}</h5>
          </EuiTitle>
        )}
      </>
    }
  />
);

export const CspPageTemplate = <TData, TError = any>({
  query,
  children,
  loadingRender = DefaultLoading,
  errorRender = DefaultError,
  ...kibanaPageTemplateProps
}: KibanaPageTemplateProps & {
  loadingRender?: () => React.ReactNode;
  errorRender?: (error: TError) => React.ReactNode;
  query?: UseQueryResult<TData, TError>;
}) => {
  const integrationQueryResult = useCisKubernetesIntegration();
  const cisKubernetesPackageInfo = integrationQueryResult;
  const cisIntegrationLink = useCISIntegrationLink();

  const getNoDataConfig = (): KibanaPageTemplateProps['noDataConfig'] => {
    if (
      cisKubernetesPackageInfo?.isSuccess &&
      cisKubernetesPackageInfo.data.item.status === 'not_installed'
    ) {
      return getPackageNotInstalledNoDataConfig(cisIntegrationLink);
    }

    // when query was successful, but data is undefined
    if (query?.isSuccess && !query?.data) {
      return kibanaPageTemplateProps.noDataConfig || DEFAULT_NO_DATA_CONFIG;
    }

    // when the consumer didn't pass a query, most likely to handle the render on his own
    if (!query) return kibanaPageTemplateProps.noDataConfig;
  };

  const getTemplate = (): KibanaPageTemplateProps['template'] => {
    if (query?.isLoading || query?.isError) return 'centeredContent';

    return kibanaPageTemplateProps.template || 'default';
  };

  const render = () => {
    if (query?.isLoading || integrationQueryResult.isLoading) return loadingRender();
    if (query?.isError) return errorRender(query.error);
    if (query?.isSuccess) return children;

    return children;
  };

  return (
    <KibanaPageTemplate
      {...DEFAULT_PAGE_PROPS}
      {...kibanaPageTemplateProps}
      template={getTemplate()}
      noDataConfig={getNoDataConfig()}
    >
      <EuiErrorBoundary>
        {cisKubernetesPackageInfo?.data?.item.status === 'installed' && render()}
      </EuiErrorBoundary>
    </KibanaPageTemplate>
  );
};
