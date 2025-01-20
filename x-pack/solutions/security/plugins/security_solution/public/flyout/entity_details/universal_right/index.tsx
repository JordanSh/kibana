/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { UniversalPanelHeader } from './header';
import { FlyoutNavigation } from '../../shared/components/flyout_navigation';
import type { HostPanelProps } from '../host_right';

export interface UniversalPanelExpandableFlyoutProps {
  key: 'universal-panel' | 'universal-preview-panel';
  params: HostPanelProps;
}

export const UniversalPanel = (props: UniversalPanelExpandableFlyoutProps) => {
  console.log(props);
  return (
    <>
      <FlyoutNavigation
      // flyoutIsExpandable={isRiskScoreExist}
      // expandDetails={openPanelFirstTab}
      // isPreview={scopeId === TableId.rulePreview}
      />
      <UniversalPanelHeader
        entityName={'entityName'}
        entity={{ type: 'user' }}
        timestamp={'13123124'}
        // observedService={observedService}
      />
      {/* <EntityPanelContent*/}
      {/*  entityName={entityName}*/}
      {/*  observedService={observedService}*/}
      {/*  riskScoreState={riskScoreState}*/}
      {/*  recalculatingScore={recalculatingScore}*/}
      {/*  onAssetCriticalityChange={calculateEntityRiskScore}*/}
      {/*  contextID={contextID}*/}
      {/*  scopeId={scopeId}*/}
      {/*  isDraggable={!!isDraggable}*/}
      {/*  openDetailsPanel={openDetailsPanel}*/}
      {/*  isLinkEnabled={isLinkEnabled}*/}
      {/* />*/}
    </>
  );
};
