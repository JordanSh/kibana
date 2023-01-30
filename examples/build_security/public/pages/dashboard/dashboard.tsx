/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState, Fragment, useContext } from 'react';
import { Chart, Settings, Axis, LineSeries, BarSeries, DataGenerator } from '@elastic/charts';

import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiColorPalettePicker,
  EuiButton,
  EuiEmptyPrompt,
} from '@elastic/eui';

import {
  euiPaletteColorBlind,
  euiPaletteComplimentary,
  euiPaletteForStatus,
  euiPaletteForTemperature,
  euiPaletteCool,
  euiPaletteWarm,
  euiPaletteNegative,
  euiPalettePositive,
  euiPaletteGray,
} from '@elastic/eui/lib/services';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const paletteData = {
  euiPaletteColorBlind,
  euiPaletteForStatus,
  euiPaletteForTemperature,
  euiPaletteComplimentary,
  euiPaletteNegative,
  euiPalettePositive,
  euiPaletteCool,
  euiPaletteWarm,
  euiPaletteGray,
};

export const Dashboard = () => {
  const history = useHistory();
  /**
   * Create data
   */
  const dg = new DataGenerator();
  const data1 = dg.generateGroupedSeries(20, 1);
  const data2 = dg.generateGroupedSeries(20, 5);

  /**
   * Setup theme based on current light/dark theme
   */

  return (
    <Fragment>
      <div style={{ filter: 'grayscale(0.95)' }}>
        <Chart size={{ height: 200 }}>
          <Settings showLegend={false} />
          <BarSeries
            id="status"
            name="Status"
            data={data2}
            xAccessor={'x'}
            yAccessors={['y']}
            splitSeriesAccessors={['g']}
            stackAccessors={['g']}
          />
          <LineSeries
            id="control"
            name="Control"
            data={data1}
            xAccessor={'x'}
            yAccessors={['y']}
            color={['black']}
          />
          <Axis id="bottom-axis" position="bottom" showGridLines />
          <Axis
            id="left-axis"
            position="left"
            showGridLines
            tickFormat={(d) => Number(d).toFixed(2)}
          />
        </Chart>
      </div>
      <EuiSpacer size="xxl" />
      <EuiEmptyPrompt
        iconType="editorStrike"
        title={<h2>You have no Data</h2>}
        body={
          <Fragment>
            <p>
              {`Navigating a big system can be tricky, even when you know what you need to do. That's
                why we've created Processes. Processes will guide you through Initial Setup, Policy Creation, Monitoring and more.`}
            </p>
            <p>{`“Tell me and I forget, teach me and I may remember, involve me and I learn.” – Benjamin Franklin`}</p>
          </Fragment>
        }
        actions={
          <EuiButton color="primary" fill onClick={() => history.push(ROUTES.PROCESSES)}>
            Start a Process
          </EuiButton>
        }
      />
    </Fragment>
  );
};
