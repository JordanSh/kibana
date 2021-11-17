/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useContext, Fragment } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { Chart, BarSeries, Settings, LineSeries, AreaSeries, DataGenerator } from '@elastic/charts';

import {
  EUI_CHARTS_THEME_DARK,
  EUI_CHARTS_THEME_LIGHT,
  EUI_SPARKLINE_THEME_PARTIAL,
  EuiCallOut,
  EuiButton,
  EuiFlexGroup,
} from '@elastic/eui';

import {
  EuiPanel,
  EuiStat,
  EuiFlexGrid,
  EuiFlexItem,
  EuiIcon,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import { euiPaletteForDarkBackground, euiPaletteForLightBackground } from '@elastic/eui';
// import { TIME_DATA_SMALL } from './data';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from '../../components';
import { ROUTES } from '../../utils/routes';

export const Compliance = () => {
  const dg = new DataGenerator();
  const data1 = dg.generateGroupedSeries(10, 1);
  const data2 = dg.generateRandomGroupedSeries(10, 5);
  const TIME_DATA_SMALL = data1;

  const history = useHistory();

  const TIME_DATA_SMALL_REVERSE = cloneDeep(TIME_DATA_SMALL).reverse();
  const TIME_DATA_SMALL_REVERSE_MAJOR = cloneDeep(TIME_DATA_SMALL_REVERSE);
  TIME_DATA_SMALL_REVERSE_MAJOR[TIME_DATA_SMALL_REVERSE_MAJOR.length - 1][1] = -100;

  return (
    <>
      <EuiSpacer />
      <div>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiStat
              title="84.5"
              description="Overall Compliance Score"
              titleColor="success"
              reverse
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title="89.2"
              description="Previous Release Score"
              titleColor="subdued"
              reverse
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title="41"
              description="Overall Improvement Since Using Elastic"
              titleColor="primary"
              reverse
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat title="1,000" description="Success color" titleColor="success" reverse />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title="14,986"
              description="Hourly Validation Rules Hits"
              titleColor="danger"
              reverse
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title="1,241"
              description="Hourly Mutation Rules Hits"
              titleColor="success"
              reverse
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
      <EuiSpacer />

      <Fragment>
        <EuiFlexGrid columns={4} responsive={false}>
          <EuiFlexItem>
            <EuiPanel>
              <EuiStat title="" description="Compliance score by release" textAlign="right">
                <EuiSpacer size="s" />
                <Chart size={{ height: 64 }}>
                  <Settings showLegend={false} tooltip="none" />
                  <BarSeries id="numbers" data={TIME_DATA_SMALL} />
                </Chart>
              </EuiStat>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel>
              <EuiStat
                title=""
                description="Increase over time"
                titleColor="success"
                textAlign="right"
              >
                <EuiSpacer size="s" />
                <Chart size={{ height: 48 }}>
                  <Settings showLegend={false} tooltip="none" />
                  <LineSeries id="increase" data={TIME_DATA_SMALL} />
                </Chart>
                <EuiSpacer size="s" />
                <EuiText size="xs" color="success">
                  <EuiIcon type="sortUp" /> <strong>15%</strong>
                </EuiText>
              </EuiStat>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel>
              <EuiStat
                title={
                  <span>
                    <EuiIcon size="xl" type="sortDown" /> 15%
                  </span>
                }
                description="Major decrease over time"
                titleColor="danger"
                textAlign="right"
              >
                <EuiSpacer size="s" />
                <Chart size={{ height: 16 }}>
                  <Settings showLegend={false} tooltip="none" />
                  <LineSeries id="major" data={TIME_DATA_SMALL_REVERSE_MAJOR} />
                </Chart>
              </EuiStat>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel>
              <EuiStat title="" description="Subtle decrease" titleColor="danger" textAlign="right">
                <EuiSpacer size="s" />
                <Chart size={{ height: 48 }}>
                  <Settings showLegend={false} tooltip="none" />
                  <AreaSeries id="subtle" data={TIME_DATA_SMALL_REVERSE} />
                </Chart>
                <EuiSpacer size="s" />
                <EuiText size="xs" color="danger">
                  - 15 points since last Tuesday
                </EuiText>
              </EuiStat>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGrid>
      </Fragment>
      <EuiSpacer />

      <EuiCallOut title="Compliance Score Dropped!" color="warning" iconType="help">
        <p>We have detected a drop in your overall compliance score</p>
        <p>Use our Analyze tool to understand and fix some of your problems</p>
        <EuiButton onClick={() => history.push(ROUTES.IMPACT_ANALYSIS.ANALYZE)} color="warning">
          Analyze Recent Changes
        </EuiButton>
      </EuiCallOut>
    </>
  );
};
