/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { transformError } from '@kbn/securitysolution-es-utils';
import { ElasticsearchClient } from '@kbn/core/server';
import {
  FINDINGS_STATUS_ROUTE_PATH,
  LATEST_FINDINGS_INDEX_DEFAULT_NS,
} from '../../../common/constants';
import { CspAppContext } from '../../plugin';
import { CspRouter } from '../../types';
import { FindingsStatus } from '../../../common/types';

const getLatestFindingsStatus = async (
  esClient: ElasticsearchClient
): Promise<FindingsStatus['status']> => {
  try {
    const queryResult = await esClient.search({
      index: LATEST_FINDINGS_INDEX_DEFAULT_NS,
      query: {
        match_all: {},
      },
      size: 1,
    });
    const hasLatestFinding = !!queryResult.hits.hits.length;

    return hasLatestFinding ? 'applicable' : 'inapplicable';
  } catch (e) {
    return 'inapplicable';
  }
};

export const defineGetFindingsStatus = (router: CspRouter, cspContext: CspAppContext): void =>
  router.get(
    {
      path: FINDINGS_STATUS_ROUTE_PATH,
      validate: false,
    },
    async (context, _, response) => {
      try {
        const esClient = (await context.core).elasticsearch.client.asCurrentUser;
        const latestFindingsIndexStatus = await getLatestFindingsStatus(esClient);

        const body: FindingsStatus = {
          status: latestFindingsIndexStatus,
        };

        return response.ok({
          body,
        });
      } catch (err) {
        const error = transformError(err);
        cspContext.logger.error(`Error while fetching findings status: ${err}`);

        return response.customError({
          body: { message: error.message },
          statusCode: error.statusCode,
        });
      }
    }
  );
