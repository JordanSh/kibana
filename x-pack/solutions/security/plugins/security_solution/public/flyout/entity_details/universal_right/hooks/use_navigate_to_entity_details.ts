/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { useExpandableFlyoutApi } from '@kbn/expandable-flyout';
import { useCallback } from 'react';
import { EntityType } from '../../../../../common/search_strategy';
import type { EntityDetailsPath } from '../../shared/components/left_panel/left_panel_header';
import { useKibana } from '../../../../common/lib/kibana';
import { EntityEventTypes } from '../../../../common/lib/telemetry';
import { UniversalEntityDetailsPanelKey } from '../../universal_details_left';
import { useIsExperimentalFeatureEnabled } from '../../../../common/hooks/use_experimental_features';

interface UseNavigateToUniversalEntityDetailsParams {
  entityName: string;
  email?: string[];
  scopeId: string;
  contextID: string;
  isDraggable?: boolean;
  isRiskScoreExist: boolean;
  isPreviewMode?: boolean;
}

interface UseNavigateToUniversalEntityDetailsResult {
  /**
   * Opens the universal entity details panel
   */
  openDetailsPanel: (path: EntityDetailsPath) => void;
  /**
   * Whether the link is enabled
   */
  isLinkEnabled: boolean;
}

export const useNavigateToUniversalEntityDetails = ({
  entityName,
  scopeId,
  contextID,
  isDraggable,
  isRiskScoreExist,
  isPreviewMode,
}: UseNavigateToUniversalEntityDetailsParams): UseNavigateToUniversalEntityDetailsResult => {
  const { telemetry } = useKibana().services;
  const { openLeftPanel, openFlyout } = useExpandableFlyoutApi();
  const isNewNavigationEnabled = useIsExperimentalFeatureEnabled(
    'newExpandableFlyoutNavigationEnabled'
  );

  const isLinkEnabled = !isPreviewMode || (isNewNavigationEnabled && isPreviewMode);

  const openDetailsPanel = useCallback(
    (path: EntityDetailsPath) => {
      telemetry.reportEvent(EntityEventTypes.RiskInputsExpandedFlyoutOpened, {
        entity: EntityType.universal,
      });

      const left = {
        id: UniversalEntityDetailsPanelKey,
        params: {
          isRiskScoreExist,
          scopeId,
          entity: {
            name: entityName,
          },
          path,
        },
      };

      const right = {
        id: UniversalEntityPanelKey,
        params: {
          contextID,
          entityName,
          scopeId,
          isDraggable,
        },
      };

      // When new navigation is enabled, navigation in preview is enabled and open a new flyout
      if (isNewNavigationEnabled && isPreviewMode) {
        openFlyout({ right, left });
      } else if (!isPreviewMode) {
        // When not in preview mode, open left panel as usual
        openLeftPanel(left);
      }
    },
    [
      contextID,
      isDraggable,
      isNewNavigationEnabled,
      isPreviewMode,
      isRiskScoreExist,
      openFlyout,
      openLeftPanel,
      scopeId,
      entityName,
      telemetry,
    ]
  );

  return { openDetailsPanel, isLinkEnabled };
};
