/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  EuiPanel,
  EuiSpacer,
  EuiButton,
  EuiContextMenuItem,
  EuiNotificationEvent,
  EuiTitle,
  EuiDescriptionList,
  EuiFlexGrid,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiText,
  EuiButtonEmpty,
} from '@elastic/eui';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const notificationEventsData = [
  {
    id: 'alert-02',
    type: 'Alert',
    severity: 'Critical',
    iconType: 'logoKibana',
    iconAriaLabel: 'Kibana',
    badgeColor: 'danger',
    time: '1 min ago',
    title: '[Validations] Major Impact',
    messages: [
      'According to our impact analysis report, those changes might impact 60% of your previous policy decisions',
      'CIS 1.1.1 is no longer enforced',
      'CIS 1.1.2 is no longer enforced',
      'CIS 1.1.3 was deleted',
      'CIS 1.1.4 was deleted',
    ],
    isRead: false,
    primaryAction: 'View Diff',
  },
  {
    id: 'alert-01',
    type: 'Alert',
    severity: 'Warning',
    iconType: 'logoMaps',
    iconAriaLabel: 'Maps',
    badgeColor: 'warning',
    time: '1 min ago',
    title: '[Mutations] Recommended Changes',
    messages: [
      'The request completed at 12:32:33 GMT+4',
      'The request completed at 12:32:33 GMT+4',
      'A background request started at 12:32:33 GMT+4',
    ],
    isRead: false,
    primaryAction: 'Accept Changes',
  },
  {
    id: 'report-01',
    type: 'Report',
    iconType: 'logoKibana',
    iconAriaLabel: 'Kibana',
    time: '3 min ago',
    title: '[Compliance] General improvement',
    messages: ['your latest changes to mutation policy was greatly beneficial'],
    isRead: false,
    primaryAction: 'View Report',
  },
  {
    id: 'news-01',
    type: 'Report',
    iconType: 'logoElastic',
    iconAriaLabel: 'Elastic',
    time: '6 min ago',
    title: 'Monitoring Report',
    messages: [
      'Retain and search more data with searchable snapshots on low-cost object stores + a new cold data tier in 7.11.',
    ],
    isRead: false,
    primaryAction: 'View Report',
  },
];

const briefs = [
  {
    title: 'Validations',
    description: 'Have major drawback potential.',
    action: 'Revert Changes',
  },
  {
    title: 'Mutations',
    description: 'Changes have no impact potential, we made a few syntax changes.',
    action: 'Accept Change Request',
  },
  {
    title: 'Compliance',
    description:
      'Overall your compliance score has majorly improved. compared to your previous policy. Good job!',
  },
  {
    title: 'Reports',
    description:
      'Your policy has 17% less validation rules hits and 30% less mutation rule hits. compared to your previous policy.',
  },
];

export const Summary = () => {
  const [events, setEvents] = useState(notificationEventsData);
  const history = useHistory();

  const goToAnalyze = () => history.push(ROUTES.IMPACT_ANALYSIS.ANALYZE);

  const onRead = (id, isRead) => {
    const nextState = events.map((event) => {
      return event.id === id ? { ...event, isRead: !isRead } : event;
    });

    setEvents(nextState);
  };

  const onFilterByType = (type) => {
    const nextState = events.filter((event) => type.includes(event.type));

    setEvents(nextState);
  };

  const onOpenContextMenu = (id) => {
    const { isRead, type } = events.find(({ id: eventId }) => eventId === id);

    return [
      <EuiContextMenuItem key="contextMenuItemA" onClick={() => onRead(id, isRead)}>
        {isRead ? 'Mark as unread' : 'Mark as read'}
      </EuiContextMenuItem>,

      <EuiContextMenuItem key="contextMenuItemB" onClick={() => onFilterByType(type)}>
        View messages like this
      </EuiContextMenuItem>,

      <EuiContextMenuItem key="contextMenuItemC" onClick={() => {}}>
        Don’t notify me about this
      </EuiContextMenuItem>,
    ];
  };

  const notificationEvents = events.map((event) => {
    // we want to make the news title unclickable
    const onClickTitle = event.type === 'News' ? undefined : () => {};

    return (
      <EuiNotificationEvent
        key={event.id}
        id={event.id}
        type={event.type}
        severity={event.severity}
        badgeColor={event.badgeColor}
        iconType={event.iconType}
        iconAriaLabel={event.iconAriaLabel}
        time={event.time}
        title={event.title}
        isRead={event.isRead}
        primaryAction={event.primaryAction}
        messages={event.messages}
        onRead={onRead}
        onOpenContextMenu={onOpenContextMenu}
        onClickPrimaryAction={() => {
          goToAnalyze();
        }}
        onClickTitle={onClickTitle}
      />
    );
  });

  return (
    <>
      <EuiSpacer />
      <div style={{ display: 'flex' }}>
        <div>
          <EuiButton size="s" onClick={goToAnalyze} style={{ marginRight: '10px' }}>
            Revert All Changes
          </EuiButton>
          <EuiButton size="s" onClick={goToAnalyze}>
            Accept Change Request
          </EuiButton>
          <EuiSpacer />
          <EuiPanel role="feed" paddingSize="none" hasShadow={true} style={{ maxWidth: '540px' }}>
            {notificationEvents}
          </EuiPanel>
        </div>
        <div style={{ paddingTop: 60, marginLeft: 30 }}>
          <EuiTitle size="s">
            <h3>Changes Potential Brief</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiDescriptionList>
            {briefs.map((brief) => (
              <>
                <EuiDescriptionListTitle>{brief.title}</EuiDescriptionListTitle>
                <EuiDescriptionListDescription>{brief.description}</EuiDescriptionListDescription>
                {brief.action && <EuiButtonEmpty size="s">{brief.action}</EuiButtonEmpty>}
              </>
            ))}
          </EuiDescriptionList>
        </div>
      </div>
    </>
  );
};
