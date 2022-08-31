/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { copyToClipboard, EuiBadge } from '@elastic/eui';
import React from 'react';

export const ShortIdBadge = ({ value }) => (
  <EuiBadge
    title={value}
    onClick={() => copyToClipboard(value)}
    iconOnClick={() => copyToClipboard(value)}
    iconType="copy"
    iconSide="right"
    color="hollow"
  >
    {value.split('-')[0]}
  </EuiBadge>
);
