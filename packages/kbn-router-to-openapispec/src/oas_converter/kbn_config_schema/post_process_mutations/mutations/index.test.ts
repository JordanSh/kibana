/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { schema } from '@kbn/config-schema';
import { processMap, processRecord } from '.';
import { joi2JsonInternal } from '../../parse';
import { createCtx } from '../context';

test.each([
  [
    'processMap',
    processMap,
    schema.mapOf(schema.string(), schema.object({ a: schema.string() }, { meta: { id: 'myRef' } })),
  ],
  [
    'processRecord',
    processRecord,
    schema.recordOf(
      schema.string(),
      schema.object({ a: schema.string() }, { meta: { id: 'myRef' } })
    ),
  ],
])('%p parses any additional properties specified', (_, processFn, obj) => {
  const ctx = createCtx({ refs: true });
  const parsed = joi2JsonInternal(obj.getSchema());

  processFn(ctx, parsed);

  expect(parsed).toEqual({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/myRef',
    },
  });
  expect(ctx.sharedSchemas.get('myRef')).toEqual({
    type: 'object',
    additionalProperties: false,
    properties: {
      a: {
        type: 'string',
      },
    },
    required: ['a'],
  });
});
