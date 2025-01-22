/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer, EuiBadge, EuiText, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import React, { useMemo } from 'react';

import { EntityType } from '../../../../common/search_strategy';
import { EntityIconByType } from '../../../entity_analytics/components/entity_store/helpers';
import type { EntityItem } from '../../../../common/search_strategy/security_solution/universal_entity/common';
import { PreferenceFormattedDate } from '../../../common/components/formatted_date';
import { FlyoutHeader } from '../../shared/components/flyout_header';
import { FlyoutTitle } from '../../shared/components/flyout_title';
import type { ObservedEntityData } from '../shared/components/observed_entity/types';

interface UniversalEntityPanelHeaderProps {
  entityName: string;
  observedEntity: ObservedEntityData<EntityItem>;
}

export const UniversalEntityPanelHeader = ({
  entityName,
  observedEntity,
}: UniversalEntityPanelHeaderProps) => {
  const lastSeenDate = useMemo(
    () => observedEntity.lastSeen.date && new Date(observedEntity.lastSeen.date),
    [observedEntity.lastSeen]
  );

  return (
    <FlyoutHeader data-test-subj="universal-entity-panel-header">
      <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
        <EuiFlexItem grow={false}>
          <EuiText size="xs" data-test-subj={'universal-entity-panel-header-lastSeen'}>
            {lastSeenDate && <PreferenceFormattedDate value={lastSeenDate} />}
            <EuiSpacer size="xs" />
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <FlyoutTitle title={entityName} iconType={EntityIconByType[EntityType.universal]} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              {observedEntity.lastSeen.date && (
                <EuiBadge
                  data-test-subj="universal-entity-panel-header-observed-badge"
                  color="hollow"
                >
                  <FormattedMessage
                    id="xpack.securitySolution.flyout.entityDetails.universalEntity.observedBadge"
                    defaultMessage="Observed"
                  />
                </EuiBadge>
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </FlyoutHeader>
  );
};
