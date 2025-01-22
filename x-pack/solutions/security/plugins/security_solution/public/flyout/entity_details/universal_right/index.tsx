/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import type { FlyoutPanelProps } from '@kbn/expandable-flyout';
import { TableId } from '@kbn/securitysolution-data-table';
import { noop } from 'lodash/fp';
import { useObservedEntity } from './hooks/use_observed_entity';
import { buildEntityNameFilter } from '../../../../common/search_strategy';
import { useRefetchQueryById } from '../../../entity_analytics/api/hooks/use_refetch_query_by_id';
import type { Refetch } from '../../../common/types';
import { RISK_INPUTS_TAB_QUERY_ID } from '../../../entity_analytics/components/entity_details_flyout/tabs/risk_inputs/risk_inputs_tab';
import { useCalculateEntityRiskScore } from '../../../entity_analytics/api/hooks/use_calculate_entity_risk_score';
import { useRiskScore } from '../../../entity_analytics/api/hooks/use_risk_score';
import { useQueryInspector } from '../../../common/components/page/manage_query';
import { useGlobalTime } from '../../../common/containers/use_global_time';
import { FlyoutLoading } from '../../shared/components/flyout_loading';
import { FlyoutNavigation } from '../../shared/components/flyout_navigation';
import { UniversalEntityPanelContent } from './content';
import { UniversalEntityPanelHeader } from './header';
import { EntityType } from '../../../../common/entity_analytics/types';
import { EntityDetailsLeftPanelTab } from '../shared/components/left_panel/left_panel_header';

export interface UniversalEntityPanelProps extends Record<string, unknown> {
  entityName: string;
  contextID: string;
  scopeId: string;
  isDraggable?: boolean;
}

export interface UniversalEntityPanelExpandableFlyoutProps extends FlyoutPanelProps {
  key: 'universal-entity-panel';
  params: UniversalEntityPanelProps;
}

export const UNIVERSAL_ENTITY_PANEL_RISK_SCORE_QUERY_ID = 'universalEntityPanelRiskScoreQuery';

const FIRST_RECORD_PAGINATION = {
  cursorStart: 0,
  querySize: 1,
};

export const UniversalEntityPanel = ({
  entityName,
  contextID,
  scopeId,
  isDraggable,
}: UniversalEntityPanelProps) => {
  const entityNameFilterQuery = useMemo(
    () => (entityName ? buildEntityNameFilter(EntityType.universal, [entityName]) : undefined),
    [entityName]
  );

  const riskScoreState = useRiskScore({
    riskEntity: EntityType.universal,
    filterQuery: entityNameFilterQuery,
    onlyLatest: false,
    pagination: FIRST_RECORD_PAGINATION,
  });

  const { inspect, refetch, loading } = riskScoreState;
  const { setQuery, deleteQuery } = useGlobalTime();
  const observedEntity = useObservedEntity(entityName, scopeId);
  const { data: entityRisk } = riskScoreState;
  const entityRiskData = entityRisk && entityRisk.length > 0 ? entityRisk[0] : undefined;
  const isRiskScoreExist = !!entityRiskData?.entity.risk;

  const refetchRiskInputsTab = useRefetchQueryById(RISK_INPUTS_TAB_QUERY_ID) ?? noop;
  const refetchRiskScore = useCallback(() => {
    refetch();
    (refetchRiskInputsTab as Refetch)();
  }, [refetch, refetchRiskInputsTab]);

  const { isLoading: recalculatingScore, calculateEntityRiskScore } = useCalculateEntityRiskScore(
    EntityType.universal,
    entityName,
    { onSuccess: refetchRiskScore }
  );

  useQueryInspector({
    deleteQuery,
    inspect,
    loading,
    queryId: UNIVERSAL_ENTITY_PANEL_RISK_SCORE_QUERY_ID,
    refetch,
    setQuery,
  });

  const { openDetailsPanel, isLinkEnabled } = useNavigateToEntityDetails({
    entityName,
    scopeId,
    contextID,
    isDraggable,
    isRiskScoreExist,
  });

  const openPanelFirstTab = useCallback(
    () =>
      openDetailsPanel({
        tab: EntityDetailsLeftPanelTab.RISK_INPUTS,
      }),
    [openDetailsPanel]
  );

  if (observedEntity.isLoading) {
    return <FlyoutLoading />;
  }

  return (
    <>
      <FlyoutNavigation
        flyoutIsExpandable={isRiskScoreExist}
        expandDetails={openPanelFirstTab}
        isPreview={scopeId === TableId.rulePreview}
      />
      <UniversalEntityPanelHeader entityName={entityName} observedEntity={observedEntity} />
      <UniversalEntityPanelContent
        entityName={entityName}
        observedEntity={observedEntity}
        riskScoreState={riskScoreState}
        recalculatingScore={recalculatingScore}
        onAssetCriticalityChange={calculateEntityRiskScore}
        contextID={contextID}
        scopeId={scopeId}
        isDraggable={!!isDraggable}
        openDetailsPanel={openDetailsPanel}
        isLinkEnabled={isLinkEnabled}
      />
    </>
  );
};

UniversalEntityPanel.displayName = 'UniversalEntityPanel';
