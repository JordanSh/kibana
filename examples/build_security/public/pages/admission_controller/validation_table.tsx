/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import { EuiLink, formatDate, EuiSwitch } from '@elastic/eui';
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
    field: 'cis',
    name: 'CIS',
    truncateText: true,
    sortable: true,
    render: (cis: any) => (
      <EuiLink
        href={`https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#:~:text=Node%20Configuration%20Files-,${cis},-Ensure%20that%20the`}
        target="_blank"
      >
        {cis}
      </EuiLink>
    ),
  },
  {
    field: 'lastHit',
    name: 'Last Hit',
    dataType: 'date',
    render: (date: any) => (date === 'Never' ? date : formatDate(date, 'dobLong')),
    sortable: true,
  },
  {
    field: 'status',
    name: 'Status',
    dataType: 'boolean',
    render: (status: boolean) => <StatusColumn status={status} />,
    sortable: true,
  },
  {
    name: 'Actions',
    actions,
  },
];

const StatusColumn = ({ status }: { status: boolean }) => {
  const [checked, setChecked] = useState(status);

  return (
    <EuiSwitch
      onChange={() => setChecked(!checked)}
      checked={checked}
      label={checked ? 'Enforce' : 'Monitor'}
    />
  );
};

const items = [
  {
    id: '1',
    name: 'Pod: Restrict User IDs',
    description: 'Ensure containers run with an approved user ID (MustRunAs).',
    cis: '1.1.1',
    lastHit: Date.now(),
    status: true,
    code: `
deny[msg] {
  parameters := {
    "user_id_ranges": set()
  }

  data.library.v1.kubernetes.admission.workload.v1.enforce_pod_runas_userid_rule_whitelist[message]
    with data.library.parameters as parameters

  decision := {
    "allowed": false,
    "message": message
  }
}
    `,
  },
  {
    id: '2',
    name: 'Containers: Prohibit `:latest` Image Tag',
    description: 'Prohibit container images that use the `:latest` tag.',
    cis: '1.1.2',
    lastHit: Date.now(),
    status: true,
    code: `
monitor[decision] {
  data.library.v1.kubernetes.admission.workload.v1.block_latest_image_tag[message]

  decision := {
    "allowed": false,
    "message": message
  }
}
`,
  },
];

export const ValidationTable = () => {
  return <BaseTable items={items} columns={columns} toggleDetails={toggleDetails} />;
};
