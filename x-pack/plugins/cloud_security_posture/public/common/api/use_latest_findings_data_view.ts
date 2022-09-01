/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useQuery } from '@tanstack/react-query';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import type { DataView } from '@kbn/data-plugin/common';
import { BENCHMARK_SCORE_INDEX_DEFAULT_NS } from '../../../common/constants';
import { CspClientPluginStartDeps } from '../../types';

/**
 *  TODO: use perfected kibana data views
 */
export const useLatestFindingsDataView = () => {
  const {
    data: { dataViews },
  } = useKibana<CspClientPluginStartDeps>().services;

  const findDataView = async (): Promise<DataView> => {
    // const dataView = (await dataViews.find(CSP_LATEST_FINDINGS_DATA_VIEW))?.[0];
    const dataView = (await dataViews.find(BENCHMARK_SCORE_INDEX_DEFAULT_NS))?.[0];
    if (!dataView) {
      throw new Error('Findings data view not found');
    }

    return dataView;
  };

  return useQuery(['latest_findings_data_view'], findDataView);
};
