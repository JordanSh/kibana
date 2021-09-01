/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState, useRef } from 'react';

import {
  EuiButton,
  EuiCheckboxGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFilePicker,
  EuiLink,
  EuiRange,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTextArea,
} from '@elastic/eui';

import { htmlIdGenerator } from '@elastic/eui/lib/services';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../../components/global_context';
import { ROUTES } from '../../utils/routes';

export const PublishPolicy = () => {
  const { setProcessId } = React.useContext(GlobalContext);
  const idPrefix = useRef(htmlIdGenerator()());
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const history = useHistory();

  const checkboxes = [
    {
      id: `${idPrefix.current}0`,
      label: 'Subscribers Only',
    },
    {
      id: `${idPrefix.current}1`,
      label: 'All Team Members',
    },
    {
      id: `${idPrefix.current}2`,
      label: 'Everyone 😈',
    },
  ];
  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState({
    [`${idPrefix.current}1`]: true,
  });

  const onSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  const onCheckboxChange = (optionId) => {
    const newCheckboxIdToSelectedMap = {
      ...checkboxIdToSelectedMap,
      ...{
        [optionId]: !checkboxIdToSelectedMap[optionId],
      },
    };

    setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
  };

  return (
    <EuiForm
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setProcessId(false);
        history.push(ROUTES.PROCESSES);
      }}
    >
      <EuiFormRow
        label="Git Branch"
        labelAppend={
          <EuiText size="xs">
            <EuiLink onClick={() => history.push(ROUTES.CONFIGURATION.GIT_INTEGRATION)}>
              Configure Git Intergration
            </EuiLink>
          </EuiText>
        }
      >
        <EuiSelect
          options={[
            { value: 'option_one', text: 'eyalush/master' },
            { value: 'option_two', text: 'eyalush/feature-egoz-page' },
            { value: 'option_three', text: 'eyalush/bug-hatzir-not-working' },
          ]}
        />
      </EuiFormRow>

      <EuiFormRow label="Commit Message" helpText="Should not be skipped">
        <EuiTextArea name="first" />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow label="Notify team members about policy changes" hasChildLabel={false}>
        <EuiSwitch
          name="switch"
          label="Notify"
          checked={isSwitchChecked}
          onChange={onSwitchChange}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiCheckboxGroup
        options={checkboxes}
        idToSelectedMap={checkboxIdToSelectedMap}
        onChange={onCheckboxChange}
        disabled={!isSwitchChecked}
        legend={{
          children: 'Select who do you want to notify',
        }}
      />

      <EuiSpacer />
      <EuiButton type="submit" fill>
        Save form
      </EuiButton>
    </EuiForm>
  );
};
