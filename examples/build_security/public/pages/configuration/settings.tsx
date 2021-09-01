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

export const Settings = () => {
  return (
    <>
      <EuiSpacer />
      <EuiForm component="form" onSubmit={(e) => e.preventDefault()}>
        <EuiFormRow label="Organization Name">
          <EuiFieldText name="first" />
        </EuiFormRow>
        <EuiSpacer />
        <EuiButton type="submit" fill>
          Save form
        </EuiButton>
      </EuiForm>
    </>
  );
};
