/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import {
  EuiSpacer,
  EuiButtonEmpty,
  EuiPageHeader,
  type EuiDescriptionListProps,
} from '@elastic/eui';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from '@kbn/i18n-react';
import { generatePath } from 'react-router-dom';
import { i18n } from '@kbn/i18n';
import { CspInlineDescriptionList } from '../../../../components/csp_inline_description_list';
import { CloudPosturePageTitle } from '../../../../components/cloud_posture_page_title';
import * as TEST_SUBJECTS from '../../test_subjects';
import { PageTitle, PageTitleText } from '../../layout/findings_layout';
import { findingsNavigation } from '../../../../common/navigation/constants';
import { ResourceFindingsQuery, useResourceFindings } from './use_resource_findings';
import { useUrlQuery } from '../../../../common/hooks/use_url_query';
import type { FindingsBaseURLQuery, FindingsBaseProps, CspFinding } from '../../types';
import {
  getFindingsPageSizeInfo,
  getFilters,
  getPaginationQuery,
  getPaginationTableParams,
  useBaseEsQuery,
  usePersistedQuery,
} from '../../utils/utils';
import { ResourceFindingsTable } from './resource_findings_table';
import { FindingsSearchBar } from '../../layout/findings_search_bar';
import { ErrorCallout } from '../../layout/error_callout';
import { FindingsDistributionBar } from '../../layout/findings_distribution_bar';

const getDefaultQuery = ({
  query,
  filters,
}: FindingsBaseURLQuery): FindingsBaseURLQuery & ResourceFindingsQuery => ({
  query,
  filters,
  sort: { field: 'result.evaluation' as keyof CspFinding, direction: 'asc' },
  pageIndex: 0,
  pageSize: 10,
});

const BackToResourcesButton = () => (
  <Link to={generatePath(findingsNavigation.findings_by_resource.path)}>
    <EuiButtonEmpty iconType={'arrowLeft'}>
      <FormattedMessage
        id="xpack.csp.findings.resourceFindings.backToResourcesPageButtonLabel"
        defaultMessage="Back to group by resource view"
      />
    </EuiButtonEmpty>
  </Link>
);

const getResourceFindingSharedValues = (
  sharedValues: any
): EuiDescriptionListProps['listItems'] => [
  {
    title: i18n.translate('xpack.csp.findings.resourceFindingsSharedValues.resourceTypeTitle', {
      defaultMessage: 'Resource Type',
    }),
    description: sharedValues.resourceSubType,
  },
  {
    title: i18n.translate('xpack.csp.findings.resourceFindingsSharedValues.resourceIdTitle', {
      defaultMessage: 'Resource ID',
    }),
    description: sharedValues.resourceId,
  },
  {
    title: i18n.translate('xpack.csp.findings.resourceFindingsSharedValues.clusterIdTitle', {
      defaultMessage: 'Cluster ID',
    }),
    description: sharedValues.clusterId,
  },
];

export const ResourceFindings = ({ dataView }: FindingsBaseProps) => {
  const params = useParams<{ resourceId: string }>();
  const getPersistedDefaultQuery = usePersistedQuery(getDefaultQuery);
  const { urlQuery, setUrlQuery } = useUrlQuery(getPersistedDefaultQuery);

  /**
   * Page URL query to ES query
   */
  const baseEsQuery = useBaseEsQuery({
    dataView,
    filters: urlQuery.filters,
    query: urlQuery.query,
  });

  /**
   * Page ES query result
   */
  const resourceFindings = useResourceFindings({
    ...getPaginationQuery({
      pageSize: urlQuery.pageSize,
      pageIndex: urlQuery.pageIndex,
    }),
    sort: urlQuery.sort,
    query: baseEsQuery.query,
    resourceId: params.resourceId,
    enabled: !baseEsQuery.error,
    aggs: {
      resourceId: {
        terms: { field: 'resource.id' },
      },
      clusterId: {
        terms: { field: 'cluster_id' },
      },
      resourceSubType: {
        terms: { field: 'resource.sub_type' },
      },
      resourceName: {
        terms: { field: 'resource.name' },
      },
    },
  });

  const sharedValues = {
    clusterId: resourceFindings.data?.aggs.clusterId.buckets[0].key,
    resourceId: resourceFindings.data?.aggs.resourceId.buckets[0].key,
    resourceSubType: resourceFindings.data?.aggs.resourceSubType.buckets[0].key,
    resourceName: resourceFindings.data?.aggs.resourceName.buckets[0].key,
  };

  console.log(sharedValues);

  const error = resourceFindings.error || baseEsQuery.error;

  return (
    <div data-test-subj={TEST_SUBJECTS.FINDINGS_CONTAINER}>
      <FindingsSearchBar
        dataView={dataView}
        setQuery={(query) => {
          setUrlQuery({ ...query, pageIndex: 0 });
        }}
        loading={resourceFindings.isFetching}
      />
      <PageTitle>
        <BackToResourcesButton />
        <PageTitleText
          title={
            <CloudPosturePageTitle
              isBeta
              title={i18n.translate(
                'xpack.csp.findings.resourceFindings.resourceFindingsPageTitle',
                {
                  defaultMessage: '{resourceName} - Findings',
                  values: { resourceName: sharedValues.resourceName },
                }
              )}
            />
          }
        />
      </PageTitle>
      <EuiPageHeader
        description={
          sharedValues && (
            <CspInlineDescriptionList listItems={getResourceFindingSharedValues(sharedValues)} />
          )
        }
      />
      <EuiSpacer />
      {error && <ErrorCallout error={error} />}
      {!error && (
        <>
          {resourceFindings.isSuccess && !!resourceFindings.data.page.length && (
            <FindingsDistributionBar
              {...{
                type: i18n.translate('xpack.csp.findings.resourceFindings.tableRowTypeLabel', {
                  defaultMessage: 'Findings',
                }),
                total: resourceFindings.data.total,
                passed: resourceFindings.data.count.passed,
                failed: resourceFindings.data.count.failed,
                ...getFindingsPageSizeInfo({
                  pageIndex: urlQuery.pageIndex,
                  pageSize: urlQuery.pageSize,
                  currentPageSize: resourceFindings.data.page.length,
                }),
              }}
            />
          )}
          <EuiSpacer />
          <ResourceFindingsTable
            loading={resourceFindings.isFetching}
            items={resourceFindings.data?.page || []}
            pagination={getPaginationTableParams({
              pageSize: urlQuery.pageSize,
              pageIndex: urlQuery.pageIndex,
              totalItemCount: resourceFindings.data?.total || 0,
            })}
            sorting={{
              sort: { field: urlQuery.sort.field, direction: urlQuery.sort.direction },
            }}
            setTableOptions={({ page, sort }) =>
              setUrlQuery({ pageIndex: page.index, pageSize: page.size, sort })
            }
            onAddFilter={(field, value, negate) =>
              setUrlQuery({
                pageIndex: 0,
                filters: getFilters({
                  filters: urlQuery.filters,
                  dataView,
                  field,
                  value,
                  negate,
                }),
              })
            }
          />
        </>
      )}
    </div>
  );
};
