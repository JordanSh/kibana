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
  EuiFieldPassword,
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../../components/global_context';
import { ROUTES } from '../../utils/routes';

export const GitIntegration = () => {
  const { setIsGitIntegrated } = React.useContext(GlobalContext);
  const history = useHistory();

  return (
    <>
      <EuiSpacer />
      <EuiForm
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          setIsGitIntegrated(true);
          history.push(ROUTES.PUBLISH);
        }}
      >
        <EuiFormRow label="Git Repo" helpText="Required">
          <EuiFieldText name="first" />
        </EuiFormRow>
        <EuiFormRow label="Access Key" helpText="Required">
          <EuiFieldPassword
            placeholder="Go to Git Settings -> Security -> Keys"
            type={'dual'}
            aria-label="Use aria labels when no actual label is in use"
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiButton type="submit" fill>
          Save form
        </EuiButton>
      </EuiForm>
    </>
  );
};
