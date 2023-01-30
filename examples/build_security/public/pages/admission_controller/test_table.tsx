/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import { EuiLink, formatDate, EuiSwitch, EuiBadge } from '@elastic/eui';
import { BaseTable } from '../../components/base_table';
import { toggleDetails } from './admission_toggle_details';

const actions = [
  {
    name: 'Clone',
    description: 'Clone',
    icon: 'copy',
    type: 'icon',
    onClick: () => {},
  },
  {
    name: 'Delete',
    description: 'Delete',
    icon: 'trash',
    type: 'icon',
    color: 'danger',
    onClick: () => {},
  },
];

const columns: any = [
  {
    field: 'name',
    name: 'Rule',
    truncateText: true,
    sortable: true,
  },
  {
    field: 'lastTestSucceed',
    name: 'Last Test Result',
    dataType: 'boolean',
    render: (lastTestSucceed: any) => (
      <EuiBadge color={lastTestSucceed ? 'success' : 'danger'}>
        {lastTestSucceed ? 'PASSED' : 'FAILED'}
      </EuiBadge>
    ),
    sortable: true,
  },
  {
    field: 'lastUpdate',
    name: 'Last Update',
    dataType: 'date',
    render: (date: any) => formatDate(date, 'dobLong'),
    sortable: true,
  },
  {
    name: 'Actions',
    actions,
  },
];

const items = [
  {
    id: '1',
    name: 'Validation Tests',
    lastUpdate: Date.now(),
    lastTestSucceed: true,
    code: `package policy["kubernetes.validations"].test.test`,
  },
  {
    id: '2',
    name: 'Mutation Tests',
    lastUpdate: Date.now(),
    lastTestSucceed: false,
    code: `package policy["kubernetes.mutations"].test.test`,
  },
];

export const TestTable = () => {
  return <BaseTable items={items} columns={columns} toggleDetails={toggleDetails} />;
};
