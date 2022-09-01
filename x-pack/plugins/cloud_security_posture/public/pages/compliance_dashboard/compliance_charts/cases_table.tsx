/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiNotificationEvent } from '@elastic/eui';
import { ShortIdBadge } from '../../../components/short_id_badge';

export const CasesTable = ({ changes, handleInvestigateClick }) => {
  console.log(changes);
  return (
    <div>
      {changes.map((e) => {
        return (
          <EuiNotificationEvent
            key={e.x}
            id={e.x}
            type={'Warning'}
            // severity={<ShortIdBadge value={e.x} />}
            badgeColor={'warning'}
            iconType={'logoSecurity'}
            time={`Last hour`}
            // title={
            //   <>
            //     <ShortIdBadge value={e.x} />{' '}
            //     <span style={{ fontWeight: 400, fontSize: 12 }}>
            //       Evaluation was changed recently
            //     </span>
            //   </>
            // }
            isRead={false}
            primaryAction={'Click here to investigate cycles for this finding'}
            messages={[
              <>
                <ShortIdBadge value={e.x} /> <span>Evaluation was changed recently</span>
              </>,
            ]}
            // onRead={onRead}
            // onOpenContextMenu={onOpenContextMenu}
            onClickPrimaryAction={(v) => handleInvestigateClick(v, e)}
          />
        );
      })}
    </div>
  );
};
{
  /* <ShortIdBadge value={event.x} />*/
}
