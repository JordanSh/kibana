/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useContext } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiCard } from '@elastic/eui';
import { ProcessProps, useProcess } from './processes';
import { GlobalContext } from '../../components/global_context';

export const ProcessesManager = () => {
  const { setProcessId } = useContext(GlobalContext);

  const { processes } = useProcess();
  const handleClick = (card: ProcessProps['card'], steps: ProcessProps['steps']) => {
    setProcessId(card.id);
    // @ts-ignore
    steps[0].onClick();
  };

  return (
    <EuiFlexGroup gutterSize="l">
      {processes.map(({ card, steps }) => (
        <EuiFlexItem>
          <EuiCard {...card} onClick={() => handleClick(card, steps)} />
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};
