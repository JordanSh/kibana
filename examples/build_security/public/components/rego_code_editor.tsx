/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiCodeBlock } from '@elastic/eui';
import { PainlessLang, PainlessContext } from '@kbn/monaco';
import React from 'react';
import { CodeEditor } from '../../../../src/plugins/kibana_react/public';

// Fields are optional and only applicable in certain contexts
const fields = [
  {
    name: 'field1',
    type: 'float',
  },
  {
    name: 'field2',
    type: 'boolean',
  },
  {
    name: 'field3',
    type: 'boolean',
  },
];

export const RegoCodeEditor = ({
  code = 'test',
  onChange,
}: {
  code: string;
  onChange?: (v: any) => void;
}) => (
  // <CodeEditor
  //   languageId="json"
  //   // width="100%"
  //   // height="100%"
  //   value={JSON.stringify({ test: '123' })}
  //   // onChange={(v) => {
  //   //   console.log(v);
  //   // }}
  //   // suggestionProvider={PainlessLang.getSuggestionProvider(context, fields)}
  //   // options={{
  //   //   ...,
  //   //   suggest: {
  //   //     This is necessary to allow autocomplete suggestions for document fields
  //   // snippetsPreventQuickSuggestions: false,
  //   // }
  //   // }}
  // />
  <EuiCodeBlock language="graphql" paddingSize="s" isCopyable style={{ width: '100%' }}>
    {code}
  </EuiCodeBlock>
);
