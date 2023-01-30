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
    name: 'Inject Missing Labels',
    description:
      'Ensures that the named set of labels exist; any missing label will be added with its corresponding default value.',
    cis: '1.1.1',
    lastHit: Date.now(),
    status: true,
    code: `
enforce[decision] {
  parameters := {
    "labels": {}
  }

  data.library.v1.kubernetes.mutating.v1.add_missing_labels[decision]
    with data.library.parameters as parameters
}
    `,
  },
  {
    id: '2',
    name: 'Containers: Add Default Memory Limit',
    description:
      'Ensures that the container memory limit is set to a default value unless otherwise specified.',
    cis: '1.1.2',
    lastHit: Date.now(),
    status: false,
    code: `
mutate[decision] {
  parameters :=   {
    "memory_limit": ""
  }

  data.library.v1.kubernetes.mutating.v1.add_default_memory_limit[decision]
    with data.library.parameters as parameters
}
`,
  },
  {
    id: '3',
    name: 'Always Pull Images if Latest',
    description:
      'Ensures that the container memory limit is set to a default value unless otherwise specified.',
    cis: '1.1.3',
    lastHit: 'Never',
    status: true,
    code: `
mutate[decision] {
  data.library.v1.kubernetes.mutating.v1.set_image_pull_policy_always_if_latest[decision]
}
    `,
  },
  {
    id: '4',
    name: 'Resources: Add Namespace Labels to Resource',
    description:
      'Ensures that the container memory limit is set to a default value unless otherwise specified.',
    cis: '1.1.4',
    lastHit: 'Never',
    status: false,
    code: `
enforce[decision] {
  parameters := {
    "labels_to_add": set(),
    "labels_to_override": set()
  }

  data.library.v1.kubernetes.mutating.v1.inherit_namespace_labels[decision]
    with data.library.parameters as parameters
}
    `,
  },
];

export const MutationTable = () => {
  return <BaseTable items={items} columns={columns} toggleDetails={toggleDetails} />;
};
