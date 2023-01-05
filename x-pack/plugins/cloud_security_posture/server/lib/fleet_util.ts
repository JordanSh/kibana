/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { map, uniq } from 'lodash';
import type { SavedObjectsClientContract } from '@kbn/core/server';
import type {
  AgentPolicyServiceInterface,
  AgentService,
  PackagePolicyClient,
} from '@kbn/fleet-plugin/server';
import type {
  AgentPolicy,
  GetAgentStatusResponse,
  ListResult,
  PackagePolicy,
} from '@kbn/fleet-plugin/common';
import { CspSetupStatus } from '../../common/types';
import { truthy } from '../../common/utils/helpers';
import { CLOUD_SECURITY_POSTURE_PACKAGE_NAME } from '../../common/constants';
import {
  BENCHMARK_PACKAGE_POLICY_PREFIX,
  BenchmarksQueryParams,
} from '../../common/schemas/benchmark';

export const PACKAGE_POLICY_SAVED_OBJECT_TYPE = 'ingest-package-policies';

const getPackageNameQuery = (packageName: string, benchmarkFilter?: string): string => {
  const integrationNameQuery = `${PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${packageName}`;
  const kquery = benchmarkFilter
    ? `${integrationNameQuery} AND ${PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name: *${benchmarkFilter}*`
    : integrationNameQuery;

  return kquery;
};

export type AgentStatusByAgentPolicyMap = Record<string, GetAgentStatusResponse['results']>;

export const getAgentStatusesByAgentPolicies = async (
  agentService: AgentService,
  agentPolicies: AgentPolicy[] | undefined
): Promise<AgentStatusByAgentPolicyMap> => {
  if (!agentPolicies?.length) return {};

  const internalAgentService = agentService.asInternalUser;
  const result: AgentStatusByAgentPolicyMap = {};

  for (const agentPolicy of agentPolicies) {
    result[agentPolicy.id] = await internalAgentService.getAgentStatusForAgentPolicy(
      agentPolicy.id
    );
  }

  return result;
};

export const getCspAgentPolicies = async (
  soClient: SavedObjectsClientContract,
  packagePolicies: PackagePolicy[],
  agentPolicyService: AgentPolicyServiceInterface
): Promise<AgentPolicy[]> =>
  agentPolicyService.getByIds(soClient, uniq(map(packagePolicies, 'policy_id')), {
    withPackagePolicies: true,
    ignoreMissing: true,
  });

export const getCspPackagePolicies = (
  soClient: SavedObjectsClientContract,
  packagePolicyService: PackagePolicyClient,
  packageName: string,
  queryParams: Partial<BenchmarksQueryParams>
): Promise<ListResult<PackagePolicy>> => {
  const sortField = queryParams.sort_field?.replaceAll(BENCHMARK_PACKAGE_POLICY_PREFIX, '');

  return packagePolicyService.list(soClient, {
    kuery: getPackageNameQuery(packageName, queryParams.benchmark_name),
    page: queryParams.page,
    perPage: queryParams.per_page,
    sortField,
    sortOrder: queryParams.sort_order,
  });
};

export const getInstalledPolicyTemplates = async (
  packagePolicyClient: PackagePolicyClient,
  soClient: SavedObjectsClientContract
) => {
  try {
    // getting all installed csp package policies
    const queryResult = await packagePolicyClient.list(soClient, {
      kuery: `${PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${CLOUD_SECURITY_POSTURE_PACKAGE_NAME}`,
      perPage: 1000,
    });

    // getting installed policy templates by findings enabled inputs
    const enabledPolicyTemplates = queryResult.items
      .map((policy) => {
        return policy.inputs.find((input) => input.enabled)?.policy_template;
      })
      .filter(truthy) as CspSetupStatus['installedPolicyTemplates'];

    // removing duplicates
    return [...new Set(enabledPolicyTemplates)];
  } catch (e) {
    return [];
  }
};
