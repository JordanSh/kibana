/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { toMountPoint } from '@kbn/kibana-react-plugin/public';
import React from 'react';

export function toastTitle({ title, testAttribute }: { title: string; testAttribute?: string }) {
  return toMountPoint(<p data-test-sub={testAttribute}>{title}</p>);
}
