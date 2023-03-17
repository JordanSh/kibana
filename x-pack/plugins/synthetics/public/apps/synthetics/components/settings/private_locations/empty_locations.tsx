/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { EuiEmptyPrompt, EuiButton, EuiLink, EuiText } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { useDispatch } from 'react-redux';
import { PRIVATE_LOCATIOSN_ROUTE } from '../../../../../../common/constants';
import { setAddingNewPrivateLocation, setManageFlyoutOpen } from '../../../state/private_locations';

export const EmptyLocations = ({
  inFlyout = true,
  setIsAddingNew,
  disabled,
  redirectToSettings,
}: {
  inFlyout?: boolean;
  disabled?: boolean;
  setIsAddingNew?: (val: boolean) => void;
  redirectToSettings?: boolean;
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <EuiEmptyPrompt
      hasBorder
      title={<h2>{ADD_FIRST_LOCATION}</h2>}
      titleSize="s"
      body={
        <EuiText size="s">
          {!inFlyout ? FIRST_MONITOR : ''} {START_ADDING_LOCATIONS_DESCRIPTION}
        </EuiText>
      }
      actions={
        redirectToSettings ? (
          <EuiButton
            iconType="plusInCircle"
            color="primary"
            fill
            isDisabled={disabled}
            href={history.createHref({
              pathname: PRIVATE_LOCATIOSN_ROUTE,
            })}
          >
            {ADD_LOCATION}
          </EuiButton>
        ) : (
          <EuiButton
            iconType="plusInCircle"
            disabled={disabled}
            color="primary"
            fill
            onClick={() => {
              setIsAddingNew?.(true);
              dispatch(setManageFlyoutOpen(true));
              dispatch(setAddingNewPrivateLocation(true));
            }}
          >
            {ADD_LOCATION}
          </EuiButton>
        )
      }
      footer={
        <EuiText size="s">
          {LEARN_MORE} <PrivateLocationDocsLink />
        </EuiText>
      }
    />
  );
};

export const PrivateLocationDocsLink = ({ label }: { label?: string }) => (
  <EuiLink
    href="https://www.elastic.co/guide/en/observability/current/synthetics-private-location.html"
    target="_blank"
  >
    {label ?? READ_DOCS}
  </EuiLink>
);

const FIRST_MONITOR = i18n.translate('xpack.synthetics.monitorManagement.firstLocationMonitor', {
  defaultMessage: 'In order to create a monitor, you will need to add a location first.',
});

const ADD_FIRST_LOCATION = i18n.translate(
  'xpack.synthetics.monitorManagement.createFirstLocation',
  {
    defaultMessage: 'Create your first private location',
  }
);

export const START_ADDING_LOCATIONS_DESCRIPTION = i18n.translate(
  'xpack.synthetics.monitorManagement.startAddingLocationsDescription',
  {
    defaultMessage:
      'Private locations allow you to run monitors from your own premises. They require an Elastic agent and Agent policy which you can control and maintain via Fleet.',
  }
);

const ADD_LOCATION = i18n.translate('xpack.synthetics.monitorManagement.createLocation', {
  defaultMessage: 'Create location',
});

export const READ_DOCS = i18n.translate('xpack.synthetics.monitorManagement.readDocs', {
  defaultMessage: 'read the docs',
});

export const LEARN_MORE = i18n.translate('xpack.synthetics.monitorManagement.learnMore', {
  defaultMessage: 'For more information,',
});
