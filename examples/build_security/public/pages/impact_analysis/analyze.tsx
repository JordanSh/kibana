/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiSuggestItem, EuiSpacer, EuiTitle, EuiButtonEmpty } from '@elastic/eui';
import React from 'react';

const sampleItems = [
  {
    id: '1',
    type: { iconType: 'kqlField', color: 'tint5' },
    label: 'Inject Missing Labels',
    description: 'CIS 1.1.1 is no longer enforced',
    change: 'revert',
  },
  {
    id: '2',
    type: { iconType: 'kqlValue', color: 'tint0' },
    label: 'Containers: Add Default Memory Limit',
    description: 'CIS 1.1.2 is no longer enforced',
    change: 'revert',
  },
  {
    id: '3',
    type: { iconType: 'kqlSelector', color: 'tint3' },
    label: 'Always Pull Images if Latest',
    description: 'CIS 1.1.3 is was deleted',
    change: 'revert',
  },
  {
    id: '4',
    type: { iconType: 'kqlOperand', color: 'tint1' },
    label: 'Resources: Add Namespace',
    description: 'CIS 1.1.4 is no longer enforced',
    change: 'revert',
  },
  {
    id: '5',
    type: { iconType: 'search', color: 'tint10' },
    label: 'Pod: Restrict User IDs',
    description: 'Syntax correction suggested',
    change: 'change',
  },
  {
    id: '6',
    type: { iconType: 'save', color: 'tint7' },
    label: 'Containers: Prohibit `:latest` Image Tag',
    description: 'Syntax correction suggested',
    change: 'change',
  },
  {
    id: '7',
    type: { iconType: 'search', color: 'tint10' },
    label: 'Pod: Restrict User IDs',
    description: 'Name change',
    change: 'safe',
  },
  {
    id: '8',
    type: { iconType: 'save', color: 'tint7' },
    label: 'Containers: Prohibit `:latest` Image Tag',
    description: 'Name change',
    change: 'safe',
  },
];

export const Analyze = () => {
  const [itemsState, setItems] = React.useState(sampleItems);

  const handleClick = (item, index) => {
    setItems((currItemState) => currItemState.filter((i) => i.id !== item.id));
  };

  return (
    <div style={{ width: 1000 }}>
      <EuiSpacer />

      <EuiTitle size="s">
        <h3>Revert Recommended</h3>
      </EuiTitle>
      <EuiSpacer />

      <div>
        {itemsState
          .filter((i) => i.change === 'revert')
          .map((item, index) => (
            <div style={{ display: 'flex' }}>
              <EuiSuggestItem
                type={item.type}
                key={index}
                label={item.label}
                description={item.description}
              />
              <EuiButtonEmpty size="xs" onClick={() => handleClick(item, index)}>
                Revert Changes
              </EuiButtonEmpty>
            </div>
          ))}
      </div>

      <EuiSpacer />
      <EuiTitle size="s">
        <h3>Change Requests</h3>
      </EuiTitle>
      <EuiSpacer />

      <div>
        {itemsState
          .filter((i) => i.change === 'change')
          .map((item, index) => (
            <div style={{ display: 'flex' }}>
              <EuiSuggestItem
                type={item.type}
                key={index}
                label={item.label}
                description={item.description}
              />
              <EuiButtonEmpty size="xs" onClick={() => handleClick(item, index)}>
                Accept Change Request
              </EuiButtonEmpty>
            </div>
          ))}
      </div>

      <EuiSpacer />
      <EuiTitle size="s">
        <h3>Safe Changes</h3>
      </EuiTitle>
      <EuiSpacer />

      <div>
        {itemsState
          .filter((i) => i.change === 'safe')
          .map((item, index) => (
            <EuiSuggestItem
              type={item.type}
              key={index}
              label={item.label}
              description={item.description}
            />
          ))}
      </div>
    </div>
  );
};
