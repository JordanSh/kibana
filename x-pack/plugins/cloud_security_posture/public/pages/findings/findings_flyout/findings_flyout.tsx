/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useState } from 'react';
import {
  EuiFlexItem,
  EuiSpacer,
  EuiTextColor,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiTabs,
  EuiTab,
  EuiFlexGroup,
  PropsOf,
  EuiCodeBlock,
  EuiMarkdownFormat,
  EuiIcon,
  EuiTimeline,
  EuiAvatar,
  euiPaletteColorBlindBehindText,
  EuiPanel,
  EuiText,
  EuiButton,
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { assertNever } from '@kbn/std';
import { i18n } from '@kbn/i18n';
import moment from 'moment';
import { css } from '@emotion/react';
import { CSP_MOMENT_FORMAT } from '../../../common/constants';
import { useLatestFindings } from '../latest_findings/use_latest_findings';
import cisLogoIcon from '../../../assets/icons/cis_logo.svg';
import type { CspFinding } from '../types';
import { CspEvaluationBadge } from '../../../components/csp_evaluation_badge';
import { ResourceTab } from './resource_tab';
import { JsonTab } from './json_tab';
import { OverviewTab } from './overview_tab';
import { RuleTab } from './rule_tab';
import type { BenchmarkId } from '../../../../common/types';
import { CISBenchmarkIcon } from '../../../components/cis_benchmark_icon';

const tabs = [
  {
    id: 'overview',
    title: i18n.translate('xpack.csp.findings.findingsFlyout.overviewTabTitle', {
      defaultMessage: 'Overview',
    }),
  },
  {
    id: 'rule',
    title: i18n.translate('xpack.csp.findings.findingsFlyout.ruleTabTitle', {
      defaultMessage: 'Rule',
    }),
  },
  {
    id: 'resource',
    title: i18n.translate('xpack.csp.findings.findingsFlyout.resourceTabTitle', {
      defaultMessage: 'Resource',
    }),
  },
  {
    id: 'json',
    title: i18n.translate('xpack.csp.findings.findingsFlyout.jsonTabTitle', {
      defaultMessage: 'JSON',
    }),
  },
  {
    id: 'timeline',
    title: i18n.translate('xpack.csp.findings.findingsFlyout.timelineTabTitle', {
      defaultMessage: 'Timeline',
    }),
  },
] as const;

type FindingsTab = typeof tabs[number];

interface FindingFlyoutProps {
  onClose(): void;
  findings: CspFinding;
  latestSnapshots: number[];
  selectedSnapshot: number;
}

export const CodeBlock: React.FC<PropsOf<typeof EuiCodeBlock>> = (props) => (
  <EuiCodeBlock isCopyable paddingSize="s" overflowHeight={300} {...props} />
);

export const Markdown: React.FC<PropsOf<typeof EuiMarkdownFormat>> = (props) => (
  <EuiMarkdownFormat textSize="s" {...props} />
);

export const CisKubernetesIcons = ({ benchmarkId }: { benchmarkId: BenchmarkId }) => (
  <EuiFlexGroup gutterSize="s">
    <EuiFlexItem grow={false}>
      <EuiIcon type={cisLogoIcon} size="xxl" />
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <CISBenchmarkIcon type={benchmarkId} />
    </EuiFlexItem>
  </EuiFlexGroup>
);

const timelineItemsForFinding = (matchingFindings, setShowModal) => {
  return matchingFindings.map((mf, index) => {
    const evalu = mf.result.evaluation;
    // const hasChanged = true;
    const hasChanged =
      index !== matchingFindings.length - 1 &&
      evalu !== matchingFindings[index + 1].result.evaluation;

    const colorBlindBehindText = euiPaletteColorBlindBehindText({
      sortBy: 'natural',
    });

    return {
      icon: hasChanged ? (
        <EuiAvatar name="Alert" iconType="alert" color={colorBlindBehindText[9]} />
      ) : (
        'check'
      ),
      children: (
        <>
          <EuiPanel hasShadow={false} hasBorder>
            <EuiText color="subdued" size={'xs'} style={{ marginBottom: 10 }}>{`${moment(
              mf.snapshot_id
            ).format(CSP_MOMENT_FORMAT)} | snapshot id: ${mf.snapshot_id}`}</EuiText>
            <span>{'This finding '}</span>
            {hasChanged ? <strong>{'has changed!'}</strong> : <strong>{'did not change'}</strong>}
            {index !== matchingFindings.length - 1 && hasChanged && (
              <>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  <div>{`It used to be`}</div>
                  <CspEvaluationBadge type={matchingFindings[index + 1].result.evaluation} />
                  <div>{`but as for ${moment(mf.snapshot_id).fromNow()}, it is now`}</div>
                  <CspEvaluationBadge type={evalu} />
                </div>
                <div style={{ marginTop: 25, gap: 6, display: 'flex' }}>
                  {mf.result.evaluation === 'failed' && (
                    <EuiButton fill size={'s'} iconType={'bug'}>
                      Remediate
                    </EuiButton>
                  )}
                  <EuiButton size={'s'} iconType={'alert'}>
                    Alert on next change
                  </EuiButton>
                  <EuiButton
                    onClick={() =>
                      setShowModal({
                        currentFinding: mf,
                        previousFinding: matchingFindings[index + 1],
                      })
                    }
                    size={'s'}
                    iconType={'inspect'}
                  >
                    Investigate change
                  </EuiButton>
                </div>
              </>
            )}
          </EuiPanel>
        </>
      ),
    };
  });
};

const TimelineTab = ({ data: finding, snapshots }) => {
  const [showModal, setShowModal] = useState(false);

  const findingTimeline = useLatestFindings({
    sort: { field: 'snapshot_id', direction: 'desc' },
    size: 10,
    query: {
      bool: {
        filter: [
          {
            bool: {
              filter: [
                {
                  bool: {
                    should: [
                      {
                        match_phrase: {
                          resource_id: finding.resource.id,
                        },
                      },
                    ],
                    minimum_should_match: 1,
                  },
                },
                {
                  bool: {
                    should: [
                      {
                        match_phrase: {
                          'rule.id': finding.rule.id,
                        },
                      },
                    ],
                    minimum_should_match: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const matchingFindings = findingTimeline.data?.page;

  if (!matchingFindings) return 'Loading';

  return (
    <>
      <EuiTimeline items={timelineItemsForFinding(matchingFindings, setShowModal)} />
      {showModal && (
        <EuiModal
          onClose={() => setShowModal(false)}
          maxWidth={1600}
          css={css`
            .euiModal .euiModal__flex {
              max-height: 90vh;
            }
          `}
        >
          <EuiModalHeader style={{ display: 'flex', justifyContent: 'flex-start', gap: 20 }}>
            <EuiIcon type="searchProfilerApp" size="xxl" />
            <EuiModalHeaderTitle>
              <h1>Investigate Change</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiSpacer size="xs" />
            <div style={{ display: 'flex', gap: 20 }}>
              {/* previous */}
              <EuiPanel hasShadow={false} hasBorder>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <EuiTitle size="s">
                    <h5>{`Previous State - ${moment(
                      showModal.previousFinding.snapshot_id
                    ).fromNow()}`}</h5>
                  </EuiTitle>
                  <CspEvaluationBadge type={showModal.previousFinding.result.evaluation} />
                </div>
                <EuiSpacer size="xs" />
                <EuiText color="subdued" size={'xs'} style={{ marginBottom: 10 }}>{`${moment(
                  showModal.previousFinding.snapshot_id
                ).format(CSP_MOMENT_FORMAT)} | snapshot id: ${
                  showModal.previousFinding.snapshot_id
                }`}</EuiText>
                <EuiCodeBlock language="json" lineNumbers isCopyable overflowHeight={400}>
                  {JSON.stringify(showModal.previousFinding, null, 2)}
                </EuiCodeBlock>
              </EuiPanel>

              {/* current */}
              <EuiPanel hasShadow={false} hasBorder>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <EuiTitle size="s">
                    <h5>{`Investigated State - ${moment(
                      showModal.currentFinding.snapshot_id
                    ).fromNow()}`}</h5>
                  </EuiTitle>
                  <CspEvaluationBadge type={showModal.currentFinding.result.evaluation} />
                </div>
                <EuiSpacer size="xs" />
                <EuiText color="subdued" size={'xs'} style={{ marginBottom: 10 }}>{`${moment(
                  showModal.currentFinding.snapshot_id
                ).format(CSP_MOMENT_FORMAT)} | snapshot id: ${
                  showModal.currentFinding.snapshot_id
                }`}</EuiText>
                <EuiCodeBlock language="json" lineNumbers isCopyable overflowHeight={400}>
                  {JSON.stringify(showModal.currentFinding, null, 2)}
                </EuiCodeBlock>
              </EuiPanel>
            </div>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButton iconType={'alert'}>Alert on next change</EuiButton>
            {showModal.currentFinding.result.evaluation === 'failed' && (
              <EuiButton iconType={'bug'}>Remediate</EuiButton>
            )}
            <EuiButton onClick={() => setShowModal(false)} fill>
              Close
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

const FindingsTab = ({
  tab,
  findings,
  snapshots,
}: {
  findings: CspFinding;
  tab: FindingsTab;
  snapshots: any;
}) => {
  switch (tab.id) {
    case 'overview':
      return <OverviewTab data={findings} />;
    case 'rule':
      return <RuleTab data={findings} />;
    case 'resource':
      return <ResourceTab data={findings} />;
    case 'json':
      return <JsonTab data={findings} />;
    case 'timeline':
      return <TimelineTab data={findings} snapshots={snapshots} />;
    default:
      assertNever(tab);
  }
};

export const FindingsRuleFlyout = ({
  onClose,
  findings,
  latestSnapshots,
  selectedSnapshot,
}: FindingFlyoutProps) => {
  const [tab, setTab] = useState<FindingsTab>(tabs[0]);

  return (
    <>
      <EuiFlyout ownFocus={false} onClose={onClose}>
        <EuiFlyoutHeader>
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem grow={false}>
              <CspEvaluationBadge type={findings.result.evaluation} />
            </EuiFlexItem>
            <EuiFlexItem grow style={{ minWidth: 0 }}>
              <EuiTitle size="m" className="eui-textTruncate">
                <EuiTextColor color="primary" title={findings.rule.name}>
                  {findings.rule.name}
                </EuiTextColor>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiTabs>
            {tabs.map((v) => (
              <EuiTab key={v.id} isSelected={tab.id === v.id} onClick={() => setTab(v)}>
                {v.title}
              </EuiTab>
            ))}
          </EuiTabs>
        </EuiFlyoutHeader>
        <EuiFlyoutBody key={tab.id}>
          <FindingsTab
            tab={tab}
            findings={findings}
            snapshots={{ selected: selectedSnapshot, latest: latestSnapshots }}
          />
        </EuiFlyoutBody>
      </EuiFlyout>
    </>
  );
};
