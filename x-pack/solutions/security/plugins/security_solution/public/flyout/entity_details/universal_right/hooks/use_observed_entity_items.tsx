/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { UniversalEntityItem } from '../../../../../common/search_strategy';
import * as i18n from './translations';
import type { ObservedEntityData } from '../../shared/components/observed_entity/types';
import type { EntityTableRows } from '../../shared/components/entity_table/types';

const basicEntityFields: EntityTableRows<ObservedEntityData<UniversalEntityItem>> = [
  {
    label: i18n.SERVICE_ID,
    getValues: (entityData: ObservedEntityData<UniversalEntityItem>) =>
      entityData.details.entity?.id,
    field: 'entity.id',
  },
  // {
  //   label: i18n.SERVICE_NAME,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) => entityData.details.service?.name,
  //   field: 'service.name',
  // },
  // {
  //   label: i18n.ADDRESS,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.address,
  //   field: 'service.address',
  // },
  // {
  //   label: i18n.ENVIRONMENT,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.environment,
  //   field: 'service.environment',
  // },
  // {
  //   label: i18n.EPHEMERAL_ID,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.ephemeral_id,
  //   field: 'service.ephemeral_id',
  // },
  // {
  //   label: i18n.NODE_NAME,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.node?.name,
  //   field: 'service.node.name',
  // },
  // {
  //   label: i18n.NODE_ROLES,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.node?.roles,
  //   field: 'service.node.roles',
  // },
  // {
  //   label: i18n.NODE_ROLE,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.node?.role,
  //   field: 'service.node.role',
  // },
  // {
  //   label: i18n.STATE,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) => entityData.details.service?.state,
  //   field: 'service.state',
  // },
  // {
  //   label: i18n.TYPE,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) => entityData.details.service?.type,
  //   field: 'service.type',
  // },
  // {
  //   label: i18n.VERSION,
  //   getValues: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.details.service?.version,
  //   field: 'service.version',
  // },
  // {
  //   label: i18n.FIRST_SEEN,
  //   render: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.firstSeen.date ? (
  //       <FormattedRelativePreferenceDate value={entityData.firstSeen.date} />
  //     ) : (
  //       getEmptyTagValue()
  //     ),
  // },
  // {
  //   label: i18n.LAST_SEEN,
  //   render: (entityData: ObservedEntityData<ServiceItem>) =>
  //     entityData.lastSeen.date ? (
  //       <FormattedRelativePreferenceDate value={entityData.lastSeen.date} />
  //     ) : (
  //       getEmptyTagValue()
  //     ),
  // },
];

export const useObservedEntityItems = (
  entityData: ObservedEntityData<UniversalEntityItem>
): EntityTableRows<ObservedEntityData<UniversalEntityItem>> => {
  if (!entityData.details) {
    return [];
  }

  return basicEntityFields;
};
