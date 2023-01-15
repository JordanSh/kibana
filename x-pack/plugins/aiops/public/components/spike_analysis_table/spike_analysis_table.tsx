/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FC, useCallback, useMemo, useState } from 'react';
import { sortBy } from 'lodash';

import {
  useEuiBackgroundColor,
  EuiBadge,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiIcon,
  EuiIconTip,
  EuiTableSortingType,
  EuiToolTip,
} from '@elastic/eui';

import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { escapeKuery } from '@kbn/es-query';
import type { ChangePoint } from '@kbn/ml-agg-utils';

import { SEARCH_QUERY_LANGUAGE } from '../../application/utils/search_utils';
import { useEuiTheme } from '../../hooks/use_eui_theme';
import { useAiopsAppContext } from '../../hooks/use_aiops_app_context';

import { MiniHistogram } from '../mini_histogram';

import { getFailedTransactionsCorrelationImpactLabel } from './get_failed_transactions_correlation_impact_label';
import { useSpikeAnalysisTableRowContext } from './spike_analysis_table_row_provider';

const NARROW_COLUMN_WIDTH = '120px';
const ACTIONS_COLUMN_WIDTH = '60px';
const UNIQUE_COLUMN_WIDTH = '40px';
const NOT_AVAILABLE = '--';

const PAGINATION_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_SORT_FIELD = 'pValue';
const DEFAULT_SORT_DIRECTION = 'asc';
const viewInDiscoverMessage = i18n.translate(
  'xpack.aiops.spikeAnalysisTable.linksMenu.viewInDiscover',
  {
    defaultMessage: 'View in Discover',
  }
);

interface SpikeAnalysisTableProps {
  changePoints: ChangePoint[];
  dataViewId?: string;
  loading: boolean;
  isExpandedRow?: boolean;
}

export const SpikeAnalysisTable: FC<SpikeAnalysisTableProps> = ({
  changePoints,
  dataViewId,
  loading,
  isExpandedRow,
}) => {
  const euiTheme = useEuiTheme();
  const primaryBackgroundColor = useEuiBackgroundColor('primary');

  const { pinnedChangePoint, selectedChangePoint, setPinnedChangePoint, setSelectedChangePoint } =
    useSpikeAnalysisTableRowContext();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof ChangePoint>(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(DEFAULT_SORT_DIRECTION);

  const { application, share, data } = useAiopsAppContext();

  const discoverLocator = useMemo(
    () => share.url.locators.get('DISCOVER_APP_LOCATOR'),
    [share.url.locators]
  );

  const discoverUrlError = useMemo(() => {
    if (!application.capabilities.discover?.show) {
      const discoverNotEnabled = i18n.translate(
        'xpack.aiops.spikeAnalysisTable.discoverNotEnabledErrorMessage',
        {
          defaultMessage: 'Discover is not enabled',
        }
      );

      return discoverNotEnabled;
    }
    if (!discoverLocator) {
      const discoverLocatorMissing = i18n.translate(
        'xpack.aiops.spikeAnalysisTable.discoverLocatorMissingErrorMessage',
        {
          defaultMessage: 'No locator for Discover detected',
        }
      );

      return discoverLocatorMissing;
    }
    if (!dataViewId) {
      const autoGeneratedDiscoverLinkError = i18n.translate(
        'xpack.aiops.spikeAnalysisTable.autoGeneratedDiscoverLinkErrorMessage',
        {
          defaultMessage: 'Unable to link to Discover; no data view exists for this index',
        }
      );

      return autoGeneratedDiscoverLinkError;
    }
  }, [application.capabilities.discover?.show, dataViewId, discoverLocator]);

  const generateDiscoverUrl = async (changePoint: ChangePoint) => {
    if (discoverLocator !== undefined) {
      const url = await discoverLocator.getRedirectUrl({
        indexPatternId: dataViewId,
        timeRange: data.query.timefilter.timefilter.getTime(),
        filters: data.query.filterManager.getFilters(),
        query: {
          language: SEARCH_QUERY_LANGUAGE.KUERY,
          query: `${escapeKuery(changePoint.fieldName)}:${escapeKuery(
            String(changePoint.fieldValue)
          )}`,
        },
      });

      return url;
    }
  };

  const columns: Array<EuiBasicTableColumn<ChangePoint>> = [
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnFieldName',
      field: 'fieldName',
      name: i18n.translate('xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.fieldNameLabel', {
        defaultMessage: 'Field name',
      }),
      sortable: true,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnFieldValue',
      field: 'fieldValue',
      name: i18n.translate('xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.fieldValueLabel', {
        defaultMessage: 'Field value',
      }),
      render: (_, { fieldValue }) => String(fieldValue),
      sortable: true,
      textOnly: true,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnLogRate',
      width: NARROW_COLUMN_WIDTH,
      field: 'pValue',
      name: (
        <EuiToolTip
          position="top"
          content={i18n.translate(
            'xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.logRateColumnTooltip',
            {
              defaultMessage:
                'A visual representation of the impact of the field on the message rate difference',
            }
          )}
        >
          <>
            <FormattedMessage
              id="xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.logRateLabel"
              defaultMessage="Log rate"
            />
            <EuiIcon size="s" color="subdued" type="questionInCircle" className="eui-alignTop" />
          </>
        </EuiToolTip>
      ),
      render: (_, { histogram, fieldName, fieldValue }) => (
        <MiniHistogram
          chartData={histogram}
          isLoading={loading && histogram === undefined}
          label={`${fieldName}:${fieldValue}`}
        />
      ),
      sortable: false,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnDocCount',
      width: NARROW_COLUMN_WIDTH,
      field: 'doc_count',
      name: i18n.translate('xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.docCountLabel', {
        defaultMessage: 'Doc count',
      }),
      sortable: true,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnPValue',
      width: NARROW_COLUMN_WIDTH,
      field: 'pValue',
      name: (
        <EuiToolTip
          position="top"
          content={i18n.translate(
            'xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.pValueColumnTooltip',
            {
              defaultMessage:
                'The significance of changes in the frequency of values; lower values indicate greater change',
            }
          )}
        >
          <>
            <FormattedMessage
              id="xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.pValueLabel"
              defaultMessage="p-value"
            />
            <EuiIcon size="s" color="subdued" type="questionInCircle" className="eui-alignTop" />
          </>
        </EuiToolTip>
      ),
      render: (pValue: number | null) => pValue?.toPrecision(3) ?? NOT_AVAILABLE,
      sortable: true,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnImpact',
      width: NARROW_COLUMN_WIDTH,
      field: 'pValue',
      name: (
        <EuiToolTip
          position="top"
          content={i18n.translate(
            'xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.impactLabelColumnTooltip',
            {
              defaultMessage: 'The level of impact of the field on the message rate difference',
            }
          )}
        >
          <>
            <FormattedMessage
              id="xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.impactLabel"
              defaultMessage="Impact"
            />
            <EuiIcon size="s" color="subdued" type="questionInCircle" className="eui-alignTop" />
          </>
        </EuiToolTip>
      ),
      render: (_, { pValue }) => {
        if (!pValue) return NOT_AVAILABLE;
        const label = getFailedTransactionsCorrelationImpactLabel(pValue);
        return label ? <EuiBadge color={label.color}>{label.impact}</EuiBadge> : null;
      },
      sortable: true,
      valign: 'top',
    },
    {
      'data-test-subj': 'aiOpsSpikeAnalysisTableColumnAction',
      name: i18n.translate('xpack.aiops.spikeAnalysisTable.actionsColumnName', {
        defaultMessage: 'Actions',
      }),
      actions: [
        {
          name: () => (
            <EuiToolTip content={discoverUrlError ? discoverUrlError : viewInDiscoverMessage}>
              <EuiIcon type="discoverApp" />
            </EuiToolTip>
          ),
          description: viewInDiscoverMessage,
          type: 'button',
          onClick: async (changePoint) => {
            const openInDiscoverUrl = await generateDiscoverUrl(changePoint);
            if (typeof openInDiscoverUrl === 'string') {
              await application.navigateToUrl(openInDiscoverUrl);
            }
          },
          enabled: () => discoverUrlError === undefined,
        },
      ],
      width: ACTIONS_COLUMN_WIDTH,
      valign: 'top',
    },
  ];

  if (isExpandedRow === true) {
    columns.unshift({
      'data-test-subj': 'aiopsSpikeAnalysisTableColumnUnique',
      width: UNIQUE_COLUMN_WIDTH,
      field: 'unique',
      name: '',
      render: (_, { unique }) => {
        if (unique) {
          return (
            <EuiIconTip
              content={i18n.translate(
                'xpack.aiops.explainLogRateSpikes.spikeAnalysisTable.uniqueColumnTooltip',
                {
                  defaultMessage: 'This field/value pair only appears in this group',
                }
              )}
              position="top"
              type="asterisk"
            />
          );
        }
        return '';
      },
      sortable: false,
      valign: 'top',
    });
  }

  const onChange = useCallback((tableSettings) => {
    const { index, size } = tableSettings.page;
    const { field, direction } = tableSettings.sort;

    setPageIndex(index);
    setPageSize(size);
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const { pagination, pageOfItems, sorting } = useMemo(() => {
    const pageStart = pageIndex * pageSize;
    const itemCount = changePoints?.length ?? 0;

    let items: ChangePoint[] = changePoints ?? [];
    items = sortBy(changePoints, (item) => {
      if (item && typeof item[sortField] === 'string') {
        // @ts-ignore Object is possibly null or undefined
        return item[sortField].toLowerCase();
      }
      return item[sortField];
    });
    items = sortDirection === 'asc' ? items : items.reverse();

    return {
      pageOfItems: items.slice(pageStart, pageStart + pageSize),
      pagination: {
        pageIndex,
        pageSize,
        totalItemCount: itemCount,
        pageSizeOptions: PAGINATION_SIZE_OPTIONS,
      },
      sorting: {
        sort: {
          field: sortField,
          direction: sortDirection,
        },
      },
    };
  }, [pageIndex, pageSize, sortField, sortDirection, changePoints]);

  const getRowStyle = (changePoint: ChangePoint) => {
    if (
      pinnedChangePoint &&
      pinnedChangePoint.fieldName === changePoint.fieldName &&
      pinnedChangePoint.fieldValue === changePoint.fieldValue
    ) {
      return {
        backgroundColor: primaryBackgroundColor,
      };
    }

    if (
      selectedChangePoint &&
      selectedChangePoint.fieldName === changePoint.fieldName &&
      selectedChangePoint.fieldValue === changePoint.fieldValue
    ) {
      return {
        backgroundColor: euiTheme.euiColorLightestShade,
      };
    }

    return {
      backgroundColor: euiTheme.euiColorEmptyShade,
    };
  };

  // Don't pass on the `loading` state to the table itself because
  // it disables hovering events. Because the mini histograms take a while
  // to load, hovering would not update the main chart. Instead,
  // the loading state is shown by the progress bar on the outer component level.
  // The outer component also will display a prompt when no data was returned
  // running the analysis and will hide this table.

  return (
    <EuiBasicTable
      data-test-subj="aiopsSpikeAnalysisTable"
      compressed
      columns={columns}
      items={pageOfItems}
      onChange={onChange}
      pagination={pagination}
      loading={false}
      sorting={sorting as EuiTableSortingType<ChangePoint>}
      rowProps={(changePoint) => {
        return {
          'data-test-subj': `aiopsSpikeAnalysisTableRow row-${changePoint.fieldName}-${changePoint.fieldValue}`,
          onClick: () => {
            if (
              changePoint.fieldName === pinnedChangePoint?.fieldName &&
              changePoint.fieldValue === pinnedChangePoint?.fieldValue
            ) {
              setPinnedChangePoint(null);
            } else {
              setPinnedChangePoint(changePoint);
            }
          },
          onMouseEnter: () => {
            setSelectedChangePoint(changePoint);
          },
          onMouseLeave: () => {
            setSelectedChangePoint(null);
          },
          style: getRowStyle(changePoint),
        };
      }}
    />
  );
};
