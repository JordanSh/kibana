/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Aggregators } from '@kbn/observability-plugin/common/custom_threshold_rule/types';
import { COMPARATORS } from '@kbn/alerting-comparators';

export const scenario5 = {
  dataView: {
    indexPattern: 'high-cardinality-data-fake_hosts.fake_hosts-*',
    id: 'data-view-id',
    shouldCreate: false,
  },
  ruleParams: {
    consumer: 'logs',
    name: 'custom_threshold_metric_avg_groupby',
    params: {
      criteria: [
        {
          comparator: COMPARATORS.GREATER_THAN,
          threshold: [80],
          timeSize: 5,
          timeUnit: 'm',
          metrics: [{ name: 'A', field: 'system.cpu.user.pct', aggType: Aggregators.AVERAGE }],
        },
      ],
      groupBy: ['host.name'],
      searchConfiguration: {
        query: {
          query: 'labels.scenario: custom_threshold_metric_avg_groupby',
        },
      },
    },
  },
};
