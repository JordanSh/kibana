/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from '@kbn/zod';

import { requestBasicOptionsSchema } from '../model/request_basic_options';
import { inspect } from '../model/inspect';
import { timerange } from '../model/timerange';
import { UniversalEntityQueries } from '../model/factory_query_type';

export const observedEntityDetailsSchema = requestBasicOptionsSchema.extend({
  entityName: z.string(),
  skip: z.boolean().optional(),
  timerange,
  inspect,
  factoryQueryType: z.literal(UniversalEntityQueries.observedDetails),
});

export type ObservedUniversalEntityDetailsRequestOptionsInput = z.input<
  typeof observedEntityDetailsSchema
>;

export type ObservedUniversalEntityDetailsRequestOptions = z.infer<
  typeof observedEntityDetailsSchema
>;
