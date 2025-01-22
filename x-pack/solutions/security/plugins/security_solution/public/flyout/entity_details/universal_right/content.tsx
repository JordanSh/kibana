/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiHorizontalRule } from '@elastic/eui';

import React from 'react';
import type { EntityItem } from '../../../../common/search_strategy';
import { AssetCriticalityAccordion } from '../../../entity_analytics/components/asset_criticality/asset_criticality_selector';
import { FlyoutRiskSummary } from '../../../entity_analytics/components/risk_summary_flyout/risk_summary';
import type { RiskScoreState } from '../../../entity_analytics/api/hooks/use_risk_score';
import { EntityType } from '../../../../common/entity_analytics/types';
import { UNIVERSAL_ENTITY_PANEL_RISK_SCORE_QUERY_ID } from '.';
import { FlyoutBody } from '../../shared/components/flyout_body';
import { ObservedEntity } from '../shared/components/observed_entity';
import type { ObservedEntityData } from '../shared/components/observed_entity/types';
import { useObservedEntityItems } from './hooks/use_observed_entity_items';
import type { EntityDetailsPath } from '../shared/components/left_panel/left_panel_header';

export const OBSERVED_ENTITY_QUERY_ID = 'observedEntityDetailsQuery';

interface UniversalEntityPanelContentProps {
  entityName: string;
  observedEntity: ObservedEntityData<EntityItem>;
  riskScoreState: RiskScoreState<EntityType.universal>;
  recalculatingScore: boolean;
  contextID: string;
  scopeId: string;
  isDraggable: boolean;
  onAssetCriticalityChange: () => void;
  openDetailsPanel: (path: EntityDetailsPath) => void;
  isPreviewMode?: boolean;
  isLinkEnabled: boolean;
}

export const UniversalEntityPanelContent = ({
  entityName,
  observedEntity,
  riskScoreState,
  recalculatingScore,
  contextID,
  scopeId,
  isDraggable,
  openDetailsPanel,
  onAssetCriticalityChange,
  isPreviewMode,
  isLinkEnabled,
}: UniversalEntityPanelContentProps) => {
  const observedFields = useObservedEntityItems(observedEntity);

  return (
    <FlyoutBody>
      {riskScoreState.hasEngineBeenInstalled && riskScoreState.data?.length !== 0 && (
        <>
          <FlyoutRiskSummary
            riskScoreData={riskScoreState}
            recalculatingScore={recalculatingScore}
            queryId={UNIVERSAL_ENTITY_PANEL_RISK_SCORE_QUERY_ID}
            openDetailsPanel={openDetailsPanel}
            isPreviewMode={isPreviewMode}
            isLinkEnabled={isLinkEnabled}
            entityType={EntityType.universal}
          />
          <EuiHorizontalRule />
        </>
      )}
      <AssetCriticalityAccordion
        entity={{ name: entityName, type: EntityType.universal }}
        onChange={onAssetCriticalityChange}
      />
      <ObservedEntity
        observedData={observedEntity}
        contextID={contextID}
        scopeId={scopeId}
        isDraggable={isDraggable}
        observedFields={observedFields}
        queryId={OBSERVED_ENTITY_QUERY_ID}
      />
      <EuiHorizontalRule margin="m" />
    </FlyoutBody>
  );
};
