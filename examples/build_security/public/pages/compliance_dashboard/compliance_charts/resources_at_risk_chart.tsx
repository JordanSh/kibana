/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { Axis, BarSeries, Chart, Settings } from '@elastic/charts';
import { euiPaletteForStatus } from '@elastic/eui/lib/services';
import { CspData } from './charts_data_types';

const mockData = [
  { id: '1', name: 'AWS S3 Buckets', value: 303, evaluation: 'pass' },
  { id: '2', name: 'AWS S3 Buckets', value: 204, evaluation: 'fail' },
  { id: '3', name: 'GCP Database', value: 180, evaluation: 'pass' },
  { id: '4', name: 'GCP Database', value: 200, evaluation: 'fail' },
  { id: '5', name: 'Kubernetes Pod Configuration', value: 150, evaluation: 'pass' },
  { id: '6', name: 'Kubernetes Pod Configuration', value: 130, evaluation: 'fail' },
  { id: '7', name: 'AWS IAM', value: 550, evaluation: 'pass' },
  { id: '8', name: 'AWS IAM', value: 230, evaluation: 'fail' },
  { id: '9', name: 'Azure Network Policies', value: 150, evaluation: 'pass' },
  { id: '10', name: 'Azure Network Policies', value: 130, evaluation: 'fail' },
];

export const ResourcesAtRiskChart = ({ resourcesEvaluations = mockData }: CspData) => {
  const handleElementClick = (e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  };

  return (
    <Chart size={{ height: 200 }}>
      <Settings
        theme={theme}
        rotation={90}
        // theme={[
        //   { colors: { vizColors: euiPaletteForStatus(2) } },
        //   // true ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme,
        // ]}
        showLegend={false}
        onElementClick={handleElementClick}
      />
      <Axis
        id="left"
        position="left"
        // showOverlappingTicks
        // labelFormat={(d: any) => `${Number(d * 100).toFixed(0)} %`}
      />
      {/* <Axis id="left-axis" position="left" showGridLines />*/}
      <BarSeries
        displayValueSettings={{
          showValueLabel: true,
          // valueFormatter: (d: any) => `${Number(d * 100).toFixed(0)} %`,
        }}
        id="bars"
        name="0"
        data={resourcesEvaluations}
        xAccessor={'name'}
        yAccessors={['value']}
        splitSeriesAccessors={['evaluation']}
        stackAccessors={['evaluation']}
        // stackMode="percentage"
      />
    </Chart>
  );
};

const theme = {
  colors: { vizColors: euiPaletteForStatus(2) },
  barSeriesStyle: {
    displayValue: {
      fontSize: 14,
      fontFamily: "'Open Sans', Helvetica, Arial, sans-serif",
      // fontStyle: 'normal',
      fill: { color: 'white', borderColor: 'blue', borderWidth: 0 },
      offsetX: 5,
      offsetY: -5,
      // alignment: {
      //   horizontal: {
      //     Default: undefined,
      //     Left: 'center',
      //     Center: 'start',
      //     Right: 'left',
      //   },
      //   vertical: {
      //     Default: undefined,
      //     Top: 'top',
      //     Middle: 'middle',
      //     Bottom: 'bottom',
      //   },
      // },
    },
  },
};
