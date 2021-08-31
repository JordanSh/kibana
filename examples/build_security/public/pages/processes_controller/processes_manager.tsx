/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiCard } from '@elastic/eui';
import { useProcess } from './processes';

export const ProcessesManager = () => {
  const { processes } = useProcess();
  const handleClick = (steps) => {
    steps[0].onClick();
  };

  return (
    <EuiFlexGroup gutterSize="l">
      {processes.map(({ card, steps }) => (
        <EuiFlexItem>
          <EuiCard {...card} onClick={() => handleClick(steps)} />
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};
