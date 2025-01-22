/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { UniversalEntityEcs } from '@kbn/securitysolution-ecs';
import type { CommonFields, Maybe } from '../../..';

export interface UniversalEntityItem {
  service?: Maybe<UniversalEntityEcs>;
}

export interface UniversalEntityAggEsItem {
  service_id?: UniversalEntityBuckets;
  service_name?: UniversalEntityBuckets;
  service_address?: UniversalEntityBuckets;
  service_environment?: UniversalEntityBuckets;
  service_ephemeral_id?: UniversalEntityBuckets;
  service_node_name?: UniversalEntityBuckets;
  service_node_role?: UniversalEntityBuckets;
  service_node_roles?: UniversalEntityBuckets;
  service_state?: UniversalEntityBuckets;
  service_type?: UniversalEntityBuckets;
  service_version?: UniversalEntityBuckets;
}

export interface UniversalEntityBuckets {
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
}

export interface AllUniversalEntityAggEsItem {
  key: string;
  domain?: UniversalEntityDomainHitsItem;
  lastSeen?: { value_as_string: string };
}

type UniversalEntityFields = CommonFields &
  Partial<{
    [Property in keyof UniversalEntityEcs as `entity.${Property}`]: unknown[];
  }>;

interface UniversalEntityDomainHitsItem {
  hits: {
    hits: Array<{
      fields: UniversalEntityFields;
    }>;
  };
}
