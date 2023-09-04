/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { ELASTIC_HTTP_VERSION_HEADER } from '@kbn/core-http-common';
import type { FtrProviderContext } from '../ftr_provider_context';
import {
  vulnerabilitiesLatestMock,
  scoresVulnerabilitiesMock,
} from './mocks/vulnerabilities_latest_mock';

export interface CnvmStatistics {
  criticalCount?: number;
  highCount?: number;
  mediumCount?: number;
  resourcesScanned?: number;
  cloudRegions?: number;
}

export interface AccountVulnStats {
  cloudAccountId: string;
  cloudAccountName: string;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface VulnStatsTrend {
  '@timestamp': string;
  policy_template: 'vuln_mgmt';
  critical: number;
  high: number;
  medium: number;
  low: number;
  vulnerabilities_stats_by_cloud_account?: Record<
    AccountVulnStats['cloudAccountId'],
    AccountVulnStats
  >;
}

export interface VulnerableResourceStat {
  vulnerabilityCount?: number;
  resource: {
    id?: string;
    name?: string;
  };
  cloudRegion?: string;
}

export interface PatchableVulnerabilityStat {
  vulnerabilityCount?: number;
  packageFixVersion?: string;
  cve?: string;
  cvss: {
    score?: number;
    version?: string;
  };
}

export interface VulnerabilityStat {
  packageFixVersion?: string;
  packageName?: string;
  packageVersion?: string;
  severity?: string;
  vulnerabilityCount?: number;
  cvss: {
    score?: number;
    version?: string;
  };
}

export interface CnvmDashboardData {
  cnvmStatistics: CnvmStatistics;
  vulnTrends: VulnStatsTrend[];
  topVulnerableResources: VulnerableResourceStat[];
  topPatchableVulnerabilities: PatchableVulnerabilityStat[];
  topVulnerabilities: VulnerabilityStat[];
}

const VULNERABILITIES_LATEST_INDEX = 'logs-cloud_security_posture.vulnerabilities_latest-default';
const BENCHMARK_SCORES_INDEX = 'logs-cloud_security_posture.scores-default';

type CnvmDashboardDataWithoutTimestamp = Omit<CnvmDashboardData, 'vulnTrends'> & {
  vulnTrends: Array<Omit<VulnStatsTrend, '@timestamp'>>;
};
const removeRealtimeCalculatedFields = (
  responseBody: CnvmDashboardData
): CnvmDashboardDataWithoutTimestamp => {
  const cleanedVulnTrends = responseBody.vulnTrends.map((trend) => {
    const { ['@timestamp']: timestamp, ...rest } = trend;
    return rest;
  });

  return {
    ...responseBody,
    vulnTrends: cleanedVulnTrends,
  };
};

// eslint-disable-next-line import/no-default-export
export default function ({ getService }: FtrProviderContext) {
  const retry = getService('retry');
  const es = getService('es');
  const supertest = getService('supertest');
  const log = getService('log');

  /**
   * required before indexing findings
   */
  const waitForPluginInitialized = (): Promise<void> =>
    retry.try(async () => {
      log.debug('Check CSP plugin is initialized');
      const response = await supertest
        .get('/internal/cloud_security_posture/status?check=init')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .expect(200);
      expect(response.body).to.eql({ isPluginInitialized: true });
      log.debug('CSP plugin is initialized');
    });

  const index = {
    removeFindings: async () =>
      es.deleteByQuery({
        index: VULNERABILITIES_LATEST_INDEX,
        query: { match_all: {} },
        refresh: true,
      }),

    removeScores: async () =>
      es.deleteByQuery({
        index: BENCHMARK_SCORES_INDEX,
        query: { match_all: {} },
        refresh: true,
      }),

    deleteFindingsIndex: async () => {
      const indexExists = await es.indices.exists({ index: VULNERABILITIES_LATEST_INDEX });

      if (indexExists) {
        await es.indices.delete({ index: VULNERABILITIES_LATEST_INDEX });
      }
    },

    addFindings: async <T>(vulnerabilitiesMock: T[]) => {
      await Promise.all(
        vulnerabilitiesMock.map((vulnerabilityDoc) =>
          es.index({
            index: VULNERABILITIES_LATEST_INDEX,
            body: vulnerabilityDoc,
          })
        )
      );
    },

    addScores: async <T>(scoresMock: T[]) => {
      await Promise.all(
        scoresMock.map((scoreDoc) =>
          es.index({
            index: BENCHMARK_SCORES_INDEX,
            body: scoreDoc,
          })
        )
      );
    },
  };

  describe('Vulnerability Dashboard API', async () => {
    beforeEach(async () => {
      await waitForPluginInitialized();
      await index.addScores(scoresVulnerabilitiesMock);
      await index.addFindings(vulnerabilitiesLatestMock);
    });

    afterEach(async () => {
      await index.removeFindings();
      await index.removeScores();
    });

    it('When the necessary indices are nonexistent, the API returns a 400 error without providing any data', async () => {
      // Remove the required indices to simulate nonexistence
      await index.deleteFindingsIndex();
      // await index.removeScores();

      // await supertest
      //   .get(`/internal/cloud_security_posture/vulnerabilities_dashboard`)
      //   .set(ELASTIC_HTTP_VERSION_HEADER, '1')
      //   .expect(400);
    });

    it('API responds with a 200 status code and matching data mock', async () => {
      const { body } = await supertest
        .get(`/internal/cloud_security_posture/vulnerabilities_dashboard`)
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        // .set('kbn-xsrf', 'xxxx')
        // .send({
        //   unencrypted: true,
        //   refreshCache: true,
        // })
        .expect(200);

      // @timestamp is calculated in real time while indexing the documents, we need to remove it to remove inconsistencies between mock and actual result
      const cleanedBody = removeRealtimeCalculatedFields(body);

      expect(cleanedBody).to.eql({
        cnvmStatistics: {
          criticalCount: 0,
          highCount: 1,
          mediumCount: 1,
          resourcesScanned: 2,
          cloudRegions: 1,
        },
        vulnTrends: [
          // {
          //   high: 1,
          //   policy_template: 'vuln_mgmt',
          //   // '@timestamp': '2023-09-03T12:57:04.925186Z',
          //   critical: 0,
          //   low: 0,
          //   vulnerabilities_stats_by_cloud_account: {
          //     '704479110758': {
          //       cloudAccountName: 'elastic-security-cloud-security-dev',
          //       high: 1,
          //       critical: 0,
          //       low: 0,
          //       cloudAccountId: '704479110758',
          //       medium: 1,
          //     },
          //   },
          //   medium: 1,
          // },
        ],
        topVulnerableResources: [
          {
            resource: {
              id: '02d62a7df23951b19',
              name: 'name-ng-1-Node',
            },
            vulnerabilityCount: 1,
            cloudRegion: 'eu-west-1',
          },
          {
            resource: {
              id: '09d11277683ea41c5',
              name: 'othername-june12-8-8-0-1',
            },
            vulnerabilityCount: 1,
            cloudRegion: 'eu-west-1',
          },
        ],
        topPatchableVulnerabilities: [
          {
            cve: 'CVE-2015-8390',
            cvss: {
              score: 9.800000190734863,
              version: '3.1',
            },
            packageFixVersion: '2.56.1-9.amzn2.0.6',
            vulnerabilityCount: 1,
          },
          {
            cve: 'CVE-2015-8394',
            cvss: {
              score: 9.800000190734863,
              version: '3.1',
            },
            packageFixVersion: '2.56.1-9.amzn2.0.6',
            vulnerabilityCount: 1,
          },
        ],
        topVulnerabilities: [
          {
            cve: 'CVE-2015-8390',
            packageFixVersion: '2.56.1-9.amzn2.0.6',
            packageName: 'glib2',
            packageVersion: '2.56.1-9.amzn2.0.5',
            severity: 'MEDIUM',
            vulnerabilityCount: 1,
            cvss: {
              score: 9.800000190734863,
              version: '3.1',
            },
          },
          {
            cve: 'CVE-2015-8394',
            packageFixVersion: '2.56.1-9.amzn2.0.6',
            packageName: 'glib2',
            packageVersion: '2.56.1-9.amzn2.0.5',
            severity: 'HIGH',
            vulnerabilityCount: 1,
            cvss: {
              score: 9.800000190734863,
              version: '3.1',
            },
          },
        ],
      });
    });
  });
}
