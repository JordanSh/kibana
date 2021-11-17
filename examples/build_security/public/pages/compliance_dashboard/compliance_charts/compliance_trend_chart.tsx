/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import {
  Chart,
  Settings,
  Axis,
  LineSeries,
  timeFormatter,
  niceTimeFormatByDay,
} from '@elastic/charts';
import { CspData } from './charts_data_types';
import { dateValueToTuple } from '../compliance_dashboard';

const mock = [
  { date: Date.now(), value: 73 },
  { date: Date.now() - 10000, value: 53 },
  { date: Date.now() - 30000, value: 91 },
  { date: Date.now() - 60000, value: 34 },
  { date: Date.now() - 90000, value: 10 },
];

export const ComplianceTrendChart = ({ complianceScoreTrend = mock }: CspData) => (
  <Chart size={{ height: 200 }}>
    <Settings
      // theme={isDarkTheme ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme}
      showLegend={false}
      legendPosition="right"
      onElementClick={(d) => {
        // eslint-disable-next-line no-console
        console.log(d);
      }}
    />
    <LineSeries
      id="compliance_score"
      name="Compliance Score"
      data={complianceScoreTrend.map(dateValueToTuple)}
      xScaleType="time"
      xAccessor={0}
      yAccessors={[1]}
    />
    <Axis
      // title={formatDate(Date.now(), dateFormatAliases.date)}
      id="bottom-axis"
      position="bottom"
      tickFormat={timeFormatter(niceTimeFormatByDay(1))}
      // showGridLines
    />
    <Axis
      ticks={4}
      id="left-axis"
      position="left"
      showGridLines
      // tickFormat={(d) => Number(d).toFixed(2)}
      domain={{ min: 0, max: 100 }}
    />
  </Chart>
);
