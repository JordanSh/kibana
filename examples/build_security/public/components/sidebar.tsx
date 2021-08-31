/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { EuiSideNav } from '@elastic/eui';
import { pages, sections } from '../utils/sections';

export const Sidebar = () => {
  const params = useParams<{ page_id: keyof typeof pages }>();
  const history = useHistory();

  const items = useMemo(
    () =>
      sections.map((section) => ({
        name: section.name,
        id: section.id,
        items: section.items.map(({ name, id, route }) => ({
          name,
          id,
          onClick: () => history.push(route),
          isSelected: params.page_id === id,
        })),
      })),

    [history, params.page_id]
  );

  return <EuiSideNav items={items} />;
};
