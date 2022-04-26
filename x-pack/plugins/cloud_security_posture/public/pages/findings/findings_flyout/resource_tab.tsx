/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiAccordion,
  EuiCode,
  EuiCodeBlock,
  EuiDescriptionList,
  EuiPanel,
  EuiSpacer,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';
import { CspFinding } from '@kbn/cloud-security-posture-plugin/public/pages/findings/types';
import React, { useMemo } from 'react';
import * as TEXT from '@kbn/cloud-security-posture-plugin/public/pages/findings/translations';
import { getFlattenedObject } from '@kbn/std';

const getDescriptionDisplay = (value: any) => {
  if (typeof value === 'boolean') return <EuiCode>{value ? 'true' : 'false'}</EuiCode>;
  if (value === undefined) return <EuiCode>{'undefined'}</EuiCode>;
  if (value === null) return <EuiCode>{'null'}</EuiCode>;
  if (typeof value === 'object') {
    return (
      <EuiCodeBlock isCopyable={true} overflowHeight={300}>
        {JSON.stringify(value, null, 2)}
      </EuiCodeBlock>
    );
  }

  return <EuiText size="s">{value}</EuiText>;
};

const prepareDescriptionList = (data: Record<string, any>) =>
  Object.entries(getFlattenedObject(data))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({
      title: (
        <EuiText size="s">
          <strong>{key}</strong>
        </EuiText>
      ),
      description: getDescriptionDisplay(value),
    }));

export const ResourceTab = ({ data }: { data: CspFinding }) => {
  const { euiTheme } = useEuiTheme();

  const accordions = useMemo(
    () => [
      {
        title: TEXT.RESOURCE,
        id: 'resourceAccordion',
        listItems: prepareDescriptionList(data.resource),
      },
      {
        title: TEXT.HOST,
        id: 'hostAccordion',
        listItems: prepareDescriptionList(data.host),
      },
    ],
    [data.host, data.resource]
  );

  return (
    <>
      {accordions.map((accordion) => (
        <>
          <EuiPanel hasShadow={false} hasBorder>
            <EuiAccordion
              id={accordion.id}
              buttonContent={
                <EuiText>
                  <strong>{accordion.title}</strong>
                </EuiText>
              }
              arrowDisplay="right"
              initialIsOpen
            >
              <EuiDescriptionList
                listItems={accordion.listItems}
                type="column"
                style={{
                  marginTop: euiTheme.size.l,
                }}
                titleProps={{ style: { width: '35%' } }}
                descriptionProps={{ style: { width: '65%' } }}
              />
            </EuiAccordion>
          </EuiPanel>
          <EuiSpacer size="m" />
        </>
      ))}
    </>
  );
};
