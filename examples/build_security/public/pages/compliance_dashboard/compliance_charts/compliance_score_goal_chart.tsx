/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import { Chart, Settings, Goal, BandFillColorAccessorInput } from '@elastic/charts';
import { CspData } from './charts_data_types';

function bandFillColor(value: number) {
  if (value <= 65) return 'red';
  if (value <= 85) return 'yellow';
  if (value <= 100) return 'green';
  return 'error';
}

const mock = 20;

export const ComplianceScoreGoalChart = ({ postureScore = mock }: CspData) => {
  function bandFillCentralMinor(value: number) {
    if (value <= 65) return 'High severity violations';
    if (value <= 85) return 'Some violations';
    if (value <= 100) return 'Compliant';
    return 'error';
  }

  return (
    <Chart>
      <Settings
      // baseTheme={useBaseTheme()}
      />
      <Goal
        id="spec_1"
        // subtype={subtype}
        base={0}
        // target={260}
        actual={postureScore}
        bands={[65, 85, 100]}
        ticks={[0, 50, 100]}
        // tickValueFormatter={({ value }: BandFillColorAccessorInput) => String(value)}
        // bandFillColor={({ value }: BandFillColorAccessorInput) => bandFillColor(value)}
        bandFillColor={({ value }: BandFillColorAccessorInput) => bandFillColor(value)}
        labelMajor=""
        labelMinor=""
        centralMajor={postureScore.toString()}
        // @ts-ignore -- 'actual' does exist here
        centralMinor={({ actual }: BandFillColorAccessorInput) => bandFillCentralMinor(actual)}
        config={{
          angleStart: Math.PI + (Math.PI - (2 * Math.PI) / 3) / 2,
          angleEnd: -(Math.PI - (2 * Math.PI) / 3) / 2,
        }}
      />
    </Chart>
  );
};
