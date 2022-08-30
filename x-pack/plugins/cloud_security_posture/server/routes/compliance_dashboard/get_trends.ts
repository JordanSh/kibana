/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { ElasticsearchClient } from '@kbn/core/server';
import { BENCHMARK_SCORE_INDEX_DEFAULT_NS } from '../../../common/constants';
import { Stats } from '../../../common/types';
import { calculatePostureScore } from './get_stats';

export interface ScoreTrendDoc {
  '@timestamp': string;
  total_findings: number;
  passed_findings: number;
  failed_findings: number;
  score_by_cluster_id: Record<
    string,
    {
      total_findings: number;
      passed_findings: number;
      failed_findings: number;
    }
  >;
}

// TODO: export those to functions to a hook
export const latestSnapshotsQuery = () => ({
  index: BENCHMARK_SCORE_INDEX_DEFAULT_NS,
  size: 0,
  aggs: {
    snapshots: {
      terms: {
        field: 'snapshot_id',
        order: {
          sort_user: 'desc',
        },
      },
      aggs: {
        sort_user: {
          min: {
            field: '@timestamp',
          },
        },
      },
    },
  },
});

export const getLatestSnapshots = (latestSnapshotsQueryResult) => {
  return latestSnapshotsQueryResult.aggregations.snapshots.buckets.map((b) => b.key);
};

const getScoreQuery = (latestSnapshots): SearchRequest => ({
  index: BENCHMARK_SCORE_INDEX_DEFAULT_NS,
  size: 0,
  aggs: {
    aggs_by_snapshot: {
      terms: {
        field: 'snapshot_id',
        include: latestSnapshots,
        // size: 5,
        // order: { _key: 'desc' },
      },
      aggs: {
        total_findings: {
          value_count: {
            field: 'result.evaluation.keyword',
          },
        },
        timestamp: {
          terms: {
            field: '@timestamp',
            size: 1,
          },
        },
        passed_findings: {
          filter: {
            term: {
              'result.evaluation.keyword': 'passed',
            },
          },
        },
        failed_findings: {
          filter: {
            term: {
              'result.evaluation.keyword': 'failed',
            },
          },
        },
        score_by_cluster_id: {
          terms: {
            field: 'cluster_id',
          },
          aggregations: {
            total_findings: {
              value_count: {
                field: 'result.evaluation.keyword',
              },
            },
            passed_findings: {
              filter: {
                term: {
                  'result.evaluation.keyword': 'passed',
                },
              },
            },
            failed_findings: {
              filter: {
                term: {
                  'result.evaluation.keyword': 'failed',
                },
              },
            },
          },
        },
      },
    },
  },
});

// export const getTrendsQuery = () => ({
//   index: BENCHMARK_SCORE_INDEX_DEFAULT_NS,
//   // large number that should be sufficient for 24 hours considering we write to the score index every 5 minutes
//   size: 999,
//   sort: '@timestamp:desc',
//   query: {
//     bool: {
//       must: {
//         range: {
//           '@timestamp': {
//             gte: 'now-1d',
//             lte: 'now',
//           },
//         },
//       },
//     },
//   },
// });

export type Trends = Array<{
  timestamp: string;
  summary: Stats;
  clusters: Record<string, Stats>;
}>;

export const getTrendsFromQueryResult = (scoreTrendDocs: ScoreTrendDoc[]): Trends =>
  scoreTrendDocs.map((data) => ({
    timestamp: data['@timestamp'],
    snapshot: data.snapshot,
    summary: {
      totalFindings: data.total_findings,
      totalFailed: data.failed_findings,
      totalPassed: data.passed_findings,
      postureScore: calculatePostureScore(data.passed_findings, data.failed_findings),
    },
    clusters: Object.fromEntries(
      Object.entries(data.score_by_cluster_id).map(([clusterId, cluster]) => [
        clusterId,
        {
          totalFindings: cluster.total_findings,
          totalFailed: cluster.failed_findings,
          totalPassed: cluster.passed_findings,
          postureScore: calculatePostureScore(cluster.passed_findings, cluster.failed_findings),
        },
      ])
    ),
  }));

const getScoreTrendDocFromTrendsQueryResult = (trendsQueryResult: any): ScoreTrendDoc[] => {
  const buckets = trendsQueryResult.aggregations.aggs_by_snapshot.buckets;
  const scoreTrendDoc = buckets.map((bucket: any) => {
    // console.log(bucket.score_by_cluster_id);
    const timestamp = bucket.timestamp.buckets[0].key_as_string;
    console.log(bucket);
    return {
      snapshot: bucket.key,
      '@timestamp': timestamp,
      total_findings: bucket.total_findings.value,
      passed_findings: bucket.passed_findings.doc_count,
      failed_findings: bucket.failed_findings.doc_count,
      score_by_cluster_id: bucket.score_by_cluster_id.buckets.reduce((acc, value) => {
        acc = {
          [value.key]: {
            total_findings: value.total_findings.value,
            passed_findings: value.passed_findings.doc_count,
            failed_findings: value.failed_findings.doc_count,
          },
        };
        return acc;
      }, {}),
    };
  });

  return scoreTrendDoc;
};

export const getTrends = async (esClient: ElasticsearchClient): Promise<Trends> => {
  // const latestSnapshotsQueryResult = await esClient.search(latestSnapshotsQuery());
  // console.log(latestSnapshotsQueryResult.aggregations.snapshots.buckets);
  // const latestSnapshots = latestSnapshotsQueryResult.aggregations.snapshots.buckets.map(
  //   (b) => b.key
  // );
  // console.log(latestSnapshots);
  const latestSnapshotsQueryResult = await esClient.search<ScoreTrendDoc>(latestSnapshotsQuery());
  const latestSnapshots = getLatestSnapshots(latestSnapshotsQueryResult);
  const trendsQueryResult = await esClient.search<ScoreTrendDoc>(getScoreQuery(latestSnapshots));
  // console.log(trendsQueryResult.aggregations.aggs_by_snapshot.buckets);
  const scoreTrendDoc = getScoreTrendDocFromTrendsQueryResult(trendsQueryResult);
  // console.log(scoreTrendDoc)

  console.log({ scoreTrendDoc });

  // if (!trendsQueryResult.hits.hits) throw new Error('missing trend results from score index');
  //
  // const scoreTrendDocs = trendsQueryResult.hits.hits.map((hit) => {
  //   if (!hit._source) throw new Error('missing _source data for one or more of trend results');
  //   return hit._source;
  // });

  return getTrendsFromQueryResult(scoreTrendDoc);
};
