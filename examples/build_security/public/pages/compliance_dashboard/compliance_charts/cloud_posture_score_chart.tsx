/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useMemo } from 'react';
import {
  Axis,
  BarSeries,
  Chart,
  Datum,
  Goal,
  Partition,
  PartitionLayout,
  Settings,
} from '@elastic/charts';
import { EuiText } from '@elastic/eui';
import { CspData } from './charts_data_types';

const mock = {
  totalPassed: 800,
  totalFailed: 300,
};

export const CloudPostureScoreChart = ({
  totalPassed = mock.totalPassed,
  totalFailed = mock.totalFailed,
}: CspData) => {
  const handleElementClick = (e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  };

  const total = totalPassed + totalFailed;
  const percentage = `${Math.floor((totalPassed / total) * 100)}%`;

  const data = useMemo(
    () => [
      { id: 'passed', label: 'Passed', value: totalPassed },
      { id: 'failed', label: 'Failed', value: totalFailed },
    ],
    [totalFailed, totalPassed]
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Chart size={{ height: 200 }}>
        <Settings />
        <Partition
          id="spec_1"
          data={data}
          valueGetter="percent"
          valueAccessor={(d: Datum) => d.value as number}
          layers={[
            {
              groupByRollup: (d: Datum) => d.label,
              shape: {
                fillColor: (d, index) => (d.dataName === 'Passed' ? 'green' : 'red'),
              },
            },
          ]}
          config={{
            partitionLayout: PartitionLayout.sunburst,
            linkLabel: { maximumSection: Infinity, maxCount: 0 },
            outerSizeRatio: 0.9, // - 0.5 * Math.random(),
            emptySizeRatio: 0.8,
            // circlePadding: 4,
            // fontFamily: 'Arial',
          }}
        />
      </Chart>
      <EuiText style={{ position: 'absolute', fontSize: 36, fontWeight: 'bold' }}>
        {percentage}
      </EuiText>
    </div>
  );
};
