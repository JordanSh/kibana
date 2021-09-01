/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState, Fragment } from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiHealth,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch,
  EuiSpacer,
  formatDate,
  RIGHT_ALIGNMENT,
  EuiButtonIcon,
} from '@elastic/eui';

/*
Example user object:

{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  dateOfBirth: Date.now(),
  nationality: 'NL',
  online: true
}

Example country object:

{
  code: 'NL',
  name: 'Netherlands',
  flag: '🇳🇱'
}
*/

export const BaseTable = ({ items, columns, actions, toggleDetails }: any) => {
  // const [pageIndex, setPageIndex] = useState(0);
  // const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [, setSelectedItems] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const onTableChange = ({ page = {}, sort = {} }: any) => {
    const { field, direction } = sort;
    // setPageIndex(index);
    // setPageSize(size);
    setSortField(field);
    setSortDirection(direction);
  };

  const onSelectionChange = (selectedItems: any) => {
    setSelectedItems(selectedItems);
  };

  const sorting: any = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const selection: any = {
    // selectable: (user: any) => user.online,
    // selectableMessage: (selectable: any) => (!selectable ? 'User is currently offline' : undefined),
    onSelectionChange,
  };

  const tableColumns = [
    ...columns,
    toggleDetails && {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      render: (item: any) => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item, itemIdToExpandedRowMap, setItemIdToExpandedRowMap)}
          // @ts-ignore
          iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
    },
  ];

  return (
    <>
      <EuiSpacer size="l" />
      <EuiBasicTable
        items={items}
        itemId="id"
        columns={tableColumns}
        sorting={sorting}
        selection={selection}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
      />
    </>
  );
};
