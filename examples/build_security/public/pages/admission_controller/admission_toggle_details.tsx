/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { EuiDescriptionList, EuiFlexGrid, EuiSpacer } from '@elastic/eui';
import { RegoCodeEditor } from '../../components/rego_code_editor';

export const toggleDetails = (item, itemIdToExpandedRowMap, setItemIdToExpandedRowMap) => {
  const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
  if (itemIdToExpandedRowMapValues[item.id]) {
    delete itemIdToExpandedRowMapValues[item.id];
  } else {
    itemIdToExpandedRowMapValues[item.id] = (
      <EuiFlexGrid direction={'column'} style={{ width: '100%' }}>
        <EuiSpacer />
        <EuiDescriptionList listItems={[{ title: item.name, description: item.description }]} />
        <EuiSpacer />
        <RegoCodeEditor code={item.code} />
        <EuiSpacer />
      </EuiFlexGrid>
    );
  }

  setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
};
