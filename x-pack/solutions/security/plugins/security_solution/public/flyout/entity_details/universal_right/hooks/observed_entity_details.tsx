/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useEffect, useMemo } from 'react';
import { i18n } from '@kbn/i18n';
import { useSearchStrategy } from '../../../../common/containers/use_search_strategy';
import type { inputsModel } from '../../../../common/store';
import type { InspectResponse } from '../../../../types';
import { EntitiesQueries } from '../../../../../common/search_strategy/security_solution/universal_entity';
import type { EntityItem } from '../../../../../common/search_strategy/security_solution/universal_entity/common';
import { OBSERVED_ENTITY_QUERY_ID } from '../content';

export interface EntityDetailsArgs {
  id: string;
  inspect: InspectResponse;
  entityDetails: EntityItem;
  refetch: inputsModel.Refetch;
  startDate: string;
  endDate: string;
}

interface UseEntityDetails {
  endDate: string;
  entityName: string;
  id?: string;
  indexNames: string[];
  skip?: boolean;
  startDate: string;
}

export const useObservedEntityDetails = ({
  endDate,
  entityName,
  indexNames,
  id = OBSERVED_ENTITY_QUERY_ID,
  skip = false,
  startDate,
}: UseEntityDetails): [boolean, EntityDetailsArgs] => {
  const {
    loading,
    result: response,
    search,
    refetch,
    inspect,
  } = useSearchStrategy<EntitiesQueries.observedDetails>({
    factoryQueryType: EntitiesQueries.observedDetails,
    initialResult: {
      entityDetails: {},
    },
    errorMessage: i18n.translate('xpack.securitySolution.entityDetails.failSearchDescription', {
      defaultMessage: `Failed to run search on entity details`,
    }),
    abort: skip,
  });

  const entityDetailsResponse = useMemo(
    () => ({
      endDate,
      entityDetails: response.entityDetails,
      id,
      inspect,
      refetch,
      startDate,
    }),
    [endDate, id, inspect, refetch, response.entityDetails, startDate]
  );

  const entityDetailsRequest = useMemo(
    () => ({
      defaultIndex: indexNames,
      factoryQueryType: EntitiesQueries.observedDetails,
      entityName,
      timerange: {
        interval: '12h',
        from: startDate,
        to: endDate,
      },
    }),
    [endDate, indexNames, startDate, entityName]
  );

  useEffect(() => {
    if (!skip) {
      search(entityDetailsRequest);
    }
  }, [entityDetailsRequest, search, skip]);

  return [loading, entityDetailsResponse];
};
