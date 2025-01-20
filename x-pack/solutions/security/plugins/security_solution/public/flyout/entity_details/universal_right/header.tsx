/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiSpacer, EuiText, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import { FlyoutHeader } from '../../shared/components/flyout_header';
import { FlyoutTitle } from '../../shared/components/flyout_title';
import { EntityType } from '../../../../common/search_strategy';
import { EntityIconByType } from '../../../entity_analytics/components/entity_store/helpers';
import { PreferenceFormattedDate } from '../../../common/components/formatted_date';

export const UniversalPanelHeader = (props) => {
  console.log('headerprops', props);
  return (
    <FlyoutHeader data-test-subj="service-panel-header">
      <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
        <EuiFlexItem grow={false}>
          <EuiText size="xs" data-test-subj={'service-panel-header-lastSeen'}>
            <PreferenceFormattedDate value={props.timestamp} />
            <EuiSpacer size="xs" />
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <FlyoutTitle
            title={props.entityName}
            iconType={EntityIconByType[props.entity.type || EntityType.universal]}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </FlyoutHeader>
  );
};
